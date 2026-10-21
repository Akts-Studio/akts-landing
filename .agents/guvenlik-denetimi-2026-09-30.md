# Güvenlik denetimi — 2026-09-30 (salt-okunur)

Kapsam: akts.tr + alt alanlar, studytrack.tr, maskepacks.com, blankreel.com, sunucu `akts` (213.146.184.194).
Yöntem: yalnız sıradan GET/HEAD, sunucuda okuma komutları, `dig`, `openssl s_client`, halka açık depoların klonu.
Hiçbir şey değiştirilmedi. Tek "yazma benzeri" istek: mail girişine 2 adet sahte kimlikli POST (hız sınırı ölçümü). Sır değeri rapora yazılmadı.

## Özet

Olağandışı/acil bir kırılma yok: kaynak (.git, .env, yedek, .map) sızıntısı yok, dizin listeleme yok, iç servisler 127.0.0.1'de, SSH yalnız anahtar, UFW + fail2ban aktif, TLS 1.2+, bekleyen güvenlik güncellemesi yok. Gerçek sorunlar: origin'in Cloudflare'siz erişilebilir olması, güvenlik başlıklarının büyük kısmının yokluğu, her şeyin root altında koşması, /root altında herkesçe okunabilir sır dosyaları (regresyon), mail sertifikası yenileme yolunun kırık olması ve mail girişinde X-Forwarded-For ile uygulama hız sınırı atlatma.

## KESİN (kanıtlı) bulgular

### 1. [Orta] Origin Cloudflare atlanarak erişilebiliyor
- Kanıt: `curl -sk --resolve akts.tr:443:213.146.184.194 https://akts.tr/` -> 200 (aynı şekilde mail., maskepacks.com, blankreel.com, studytrack.tr, app.studytrack.tr, ezan., n8n., eymen., oyun. hepsi 200). UFW 80/443 "Anywhere"; nginx'te Cloudflare aralıklarına kısıtlama yok (`cloudflare-realip.conf` yalnız gerçek IP için).
- IP zaten kamuya açık: `mail.akts.tr` A = 213.146.184.194 (DNS-only, posta için zorunlu) ve `test.maskepacks.com` A = aynı IP. IP gizlenemez; bu nedenle "origin nasıl açık" iddiası doğru ama IP'yi saklamak zaten mümkün değil.
- Etki: Cloudflare WAF/hız sınırı/bot koruması atlanır; n8n.akts.tr girişi ve /api uçları doğrudan vurulabilir. Origin sertifikası self-signed (CN=app.studytrack.tr, bitiş 2027-02-24) -> Cloudflare SSL modu büyük olasılıkla "Full" (strict değil); bunu panelden doğrulamadım.
- Düzeltme: (a) UFW'de 80/443'ü yalnız Cloudflare aralıklarına aç, mail.akts.tr için ayrı izin gerekmez çünkü mail web arayüzü de 443'te (ona doğrudan erişim lazım!) -> bu yüzden ya mail arayüzünü ayrı IP/port'a al, ya da nginx'te vhost başına `allow <CF aralıkları>; deny all;` yaz (mail.akts.tr hariç). (b) Kalıcı çözüm: Cloudflare Authenticated Origin Pulls (mTLS) + gerçek origin sertifikası (Cloudflare Origin CA) + SSL modu "Full (strict)".
- Hizmeti kırma riski: Orta (mail vhost'u ve kendi erişimin yanlış kısıtlanırsa kopar). Geri alma: `ufw delete ...` / nginx'te `allow/deny` satırlarını sil + `nginx -s reload`.

### 2. [Orta] Güvenlik başlıkları büyük oranda yok
- Kanıt (`curl -sI`): akts.tr, eymen., oyun., ezan., n8n., studytrack.tr, app.studytrack.tr, maskepacks.com -> yalnız `server: cloudflare`; HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy YOK. kahya.akts.tr yalnız Cloudflare'in referrer/x-frame başlığını dönüyor.
- mail.akts.tr: HSTS (includeSubDomains, preload YOK), nosniff, Referrer-Policy var; CSP ve X-Frame-Options/frame-ancestors YOK (web posta arayüzü için clickjacking açığı). API yanıtlarında helmet var ama statik sayfa nginx'ten geliyor.
- blankreel.com: tam set var (HSTS+preload, CSP, XFO, Permissions-Policy). CSP'de `'unsafe-inline' 'unsafe-eval'` var (Next.js için bilinen taviz). `X-Powered-By: Next.js` sızıyor.
- `server_tokens build;` -> mail.akts.tr `Server: nginx/1.26.0 (Ubuntu)` sürüm sızdırıyor.
- CORS: incelenen hiçbir yerde `Access-Control-Allow-Origin: *` görmedim; aktas-mail CORS'u `APP_ORIGIN`'e sabit.
- Düzeltme (Cloudflare tarafında en düşük riskli): Rules > Transform Rules > Response Header ile HSTS (max-age=31536000; includeSubDomains), nosniff, `Referrer-Policy: strict-origin-when-cross-origin`, `X-Frame-Options: SAMEORIGIN`; nginx `http {}` içine `server_tokens off;`; mail vhost'una `add_header X-Frame-Options "DENY" always; add_header Content-Security-Policy "default-src 'self'; frame-ancestors 'none'; ..." always;` (CSP'yi önce `Report-Only` dene, çünkü mail arayüzü kırılabilir). Risk: HSTS/XFO Düşük; CSP Orta.

### 3. [Orta] Bütün uygulamalar root olarak çalışıyor
- Kanıt: `pm2`'de n8n, blankreel, studytrack-api, ezan-api, oyunhub-stats, maske-paket hepsi kullanıcı root; Minecraft (Java, 25565 halka açık) ve maske-kamera (Python) root; `maildir-izleyici.mjs` root. Yalnız aktas-mail (`aktasmail`) ve postgres/redis/opendkim ayrıcalıksız.
- Etki: Herhangi bir uygulamada RCE = tam sunucu ele geçirme. n8n (kod çalıştırma özellikli) halka açık ve root.
- Düzeltme: Her servise ayrı sistem kullanıcısı (`useradd -r`), systemd/pm2 `--uid`, dizin sahipliği. Önce en riskli üçü: n8n, Minecraft, blankreel. Risk: Orta-Yüksek (dosya izinleri/yazma yolları kırılabilir). Geri alma: eski kullanıcı ile pm2 yeniden başlat.

### 4. [Orta/Düşük] /root altında herkesçe okunabilir sır dosyaları (önceki düzeltmenin gerilemesi)
- Kanıt (`stat`): 644 root -> `/root/bots/.env` (5 adet `BOT_n_TOKEN` Discord bot jetonu), `/root/mctiers-bot/.env` (`DISCORD_TOKEN`, `ALERTS_WEBHOOK_URL`), `/root/taskagitmakas/.env` (9 Discord jetonu), `/root/.n8n/.env`, `/root/private.key` + `public.key` (45 bayt, türü doğrulanmadı). `/root` dizini 711 (`drwx--x--x`) -> başkaları dizini listeleyemez ama yolu bilen her yerel kullanıcı (aktasmail, www-data, postgres, redis, guest) okuyabilir.
- Etki: Yerel yetki yükseltme/yanal hareket: aktas-mail veya nginx'te ele geçirilen bir süreç bu jetonları okur. Uzaktan tek başına sömürülemez.
- Ayrıca `/root/dovecot-yedek-2026-09-27.tgz` (644) içinde `etc/dovecot/users` (parola karmaları) var; asıl dosya 640 ama arşiv 644. `/root/*.tgz` yedekleri de 644 (akts.tr siteleri, hassas değil ama tutarlılık).
- Düzeltme: `chmod 600 /root/bots/.env /root/mctiers-bot/.env /root/taskagitmakas/.env /root/.n8n/.env /root/private.key /root/public.key /root/dovecot-yedek-2026-09-27.tgz; chmod 700 /root`. Risk: Düşük (hepsi root süreçlerince okunuyor; `/root` 700 olunca aktasmail'in /root'tan bir şey okuyup okumadığını kontrol et: aktasmail `.env`i /opt'ta, sorun yok). Geri alma: eski modlara `chmod`.
- Jetonları Discord'da yenilemek ("gerçekten sızdı mı" kanıtı yok; yalnız yerel okunabilirlik) isteğe bağlı.

### 5. [Orta] mail.akts.tr sertifika yenilemesi büyük olasılıkla başarısız olacak
- Kanıt: `certbot certificates` -> mail.akts.tr bitiş 2026-11-16 (46 gün); renewal: `authenticator = webroot`, `webroot_path = /var/www/acme`. Ama mail vhost'unda `/.well-known/acme-challenge/` için ayrı `location` yok: `http://mail.akts.tr/.well-known/acme-challenge/x` -> 301 -> https -> 200 `text/html` (SPA index.html, kök `/opt/aktas-mail/frontend/dist`). `/var/www/acme` boş. Yani challenge dosyası sunulamaz.
- Ayrıca `certbot.service` her çalışmada "failed" bitiyor (süresi dolmuş `trprac.net` ve `trprac.net-0001` sertifikaları yenilenemiyor; `systemctl` hata durumunda) — bu diğer sertifikaların yenilenmesini engellemez ama izlemeyi gürültülü yapar.
- Etki: 16 Kasım'da Postfix/Dovecot/web mail TLS sertifikası dolar -> posta ve giriş kesilir, istemciler uyarır.
- Düzeltme: mail vhost'una (hem 80 hem 443'te, redirect'ten önce) `location ^~ /.well-known/acme-challenge/ { root /var/www/acme; try_files $uri =404; }` ekle; `certbot renew --dry-run` ile doğrula; `certbot delete --cert-name trprac.net --cert-name trprac.net-0001`. Yenilemeden sonra Postfix/Dovecot için deploy-hook: `systemctl reload postfix dovecot nginx`. Risk: Düşük. Geri alma: bloğu sil, reload.

### 6. [Düşük-Orta] aktas-mail: X-Forwarded-For ile uygulama hız sınırı atlatılıyor
- Kanıt: `POST /api/auth/login` sahte kimlikle -> `x-ratelimit-limit: 5, remaining: 4`; aynı istek `X-Forwarded-For: 198.51.100.7` ile -> yine `remaining: 4` (sayaç ayrı IP'ye kaydoldu). Kod: `trustProxy: true` (backend/src/index.ts:29); nginx `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` istemcinin başlığını koruyup sonuna ekliyor, Fastify en soldakini alıyor.
- Hafifletici: nginx `limit_req zone=am_auth` (10 istek/dk, burst 5) `$binary_remote_addr` ile gerçek IP'ye uygulanıyor, bu yüzden kaba kuvvet yine yavaşlatılıyor. Brute-force denemedim.
- Düzeltme: mail vhost'unda iki `proxy_set_header X-Forwarded-For` satırını `proxy_set_header X-Forwarded-For $remote_addr;` yap. Risk: Düşük. Geri alma: eski satır.

### 7. [Düşük] aktas-mail bağımlılık açıkları
- Kanıt: `npm audit --omit=dev` (backend): 7 açık (3 yüksek, 4 orta): `nodemailer <=10.0.5` (alan adı doğrulama atlatma, DoS, SMTP kimlik bilgisi ifşası), `mailparser` buna bağlı. Düzeltme: `npm audit fix` (sürüm yükseltme; gönderim kodunu test et). Risk: Orta (API farkı olabilir). Diğer projeler: akts-landing 0 açık. studytrack/site, ezan-vaktim/web-*, maske-pack site, web2/oyunhub için `npm audit` çalıştırmadım (bu denetimde yerel kopyaları taramadım) -> yapılmadı.

### 8. [Düşük] DNS/e-posta
- akts.tr: SPF `-all` iyi; DKIM `mail._domainkey` var; DMARC `p=none` (yalnız izleme) ve rua `postmaster@aktas.tr` (farklı alan adı; o alan adında rua yetki kaydı `akts.tr._report._dmarc.aktas.tr` yoksa raporlar gelmeyebilir — doğrulamadım); MTA-STS, TLS-RPT, CAA, DNSSEC YOK. MX 10 mail.akts.tr.
- PTR: 213.146.184.194 -> `pool-ist1.mars.treas.net.tr`, `mail.akts.tr` ile uyuşmuyor (posta teslim edilebilirliği; barındırıcıdan rDNS değiştirme gerekir).
- maskepacks.com: MX/SPF/DMARC hiç yok -> e-posta göndermiyorsa sahte gönderime açık (`v=spf1 -all` + `_dmarc p=reject` yeterli).
- blankreel.com: MX `mail.blankreel.com`, DKIM `mail` var, ama SPF ve DMARC YOK (uygulama bu alan adından no-reply gönderiyor).
- studytrack.tr: SPF `+a +mx +a:domaincontrol.hostingdunyam.net -all` (eski barındırıcıdan kalma), DMARC `p=none`, MX `_dc-mx...` (eski barındırıcı). Kullanılmıyorsa temizle.
- CAA hiçbir alan adında yok: `CAA 0 issue "letsencrypt.org"` + `"pki.goog"` (Cloudflare'in universal sertifikası için) ekle. Risk: Düşük-Orta (yanlış CA yazılırsa yenileme kırılır).
- Subdomain takeover: CNAME yok; kahya.akts.tr hâlâ Cloudflare'de proxied A (HTTP 520, origin 444 döndürüyor) -> takeover riski yok (IP sizin) ama kayıt silinmeli. cpvp.io artık Spaceship NS'de, A kaydı yok; sunucuda `cpvp-yonlendirme` vhost'u ve cpvp.io/admin.cpvp.io Let's Encrypt sertifikaları (yenileme devam ediyor) duruyor -> alan adı elinizden çıktıysa yenilemeler zamanla başarısız olur; vhost ve sertifikaları kaldırın.

### 9. [Düşük] Sunucu sertleştirme eksikleri
- `server_tokens build;` (sürüm sızıyor, bkz. 2). nginx'te genel `limit_req` yalnız mail vhost'unda; diğer halka açık API'lerde (studytrack /api, ezan /api, oyun /api) yok (Cloudflare arkada ama bkz. 1 — atlanabilir).
- n8n 2.10.4 (`n8n.akts.tr`) halka açık; `/rest/settings` kimlik doğrulamasız ama yalnız genel ayar (güvenli, kayıt kapalı, `showSetupOnFirstLoad:false`, `authCookie.secure:true`); `/rest/login` yanlış denemeye 401. n8n'e yalnız kendi IP'lerinden erişim (nginx `allow/deny` veya Cloudflare Access) önerilir. `n8n.maskeproject.com.tr` vhost'u da aktif (ayrı alan adı, sertifika 2026-11-10) ve root altında.
- Redis 127.0.0.1'de, `requirepass` yok (yerel kullanıcılar kimlik doğrulamasız erişir; kritik değil ama bkz. 4).
- Postfix `smtpd_tls_security_level = may` (25'te normal), `smtpd_relay_restrictions = permit_mynetworks, permit_sasl_authenticated, reject_unauth_destination` (açık röle değil, test etmedim), `mynetworks` yalnız loopback, 587'de TLS+SASL zorunlu. Dovecot `ssl = required`, `auth_mechanisms = plain login` (TLS zorunlu olduğundan kabul edilebilir). 143 (IMAP) 0.0.0.0'da dinliyor ama UFW'de kapalı.
- `/var/www/*` dizinleri UID 501 (Mac kullanıcısı) sahipli (rsync -a'dan); sunucuda böyle bir kullanıcı yok -> izinler tutarsız ama yazılabilir (o+w) dosya yok.
- Disk 71% dolu; `/root/cpvp-backup-20260922.zip` ~11 GB, cpvp kapandığı için taşıma/silme adayı (silme kararı sizde).

## Bilgi / temiz çıkanlar (kanıtlı)
- Kaynak ifşası yok: `/.git/HEAD`, `.env`, `.env.local`, `.DS_Store`, `package.json`, `backup.*`, `*.sql`, `server.key`, `wp-config.php`, `.claude/` hepsi SPA index.html'e düşüyor (aynı boyut) veya 404; gerçek dosya dönen yok. `*.map` dosyaları 404 (akts.tr/static/index-*.js.map 200 döndü ama içerik SPA HTML'i, kaynak haritası değil). Dizin listeleme yok.
- TLS: edge ve origin yalnız TLS 1.2/1.3 (TLS1.0/1.1 reddediliyor). Edge sertifikası Google Trust Services, bitiş 2026-11-16 (Cloudflare otomatik yeniler).
- SSH: `PasswordAuthentication no`, `PermitRootLogin without-password`, `MaxAuthTries 3`, tek yetkili anahtar; fail2ban 5 jail (sshd, postfix, postfix-sasl, dovecot, recidive), son 24 saatte 338 başarısız deneme, başarılı girişler yalnız sizin anahtarınızla. UFW varsayılan deny, INPUT DROP. unattended-upgrades aktif, `apt list --upgradable` boş, yeniden başlatma gerekmiyor, çekirdek güncel.
- Dinleyen portlar: 0.0.0.0 -> yalnız 22, 25, 80, 143(UFW kapalı), 443, 587, 993, 25565 (Minecraft, bilinçli). Tüm Node/pm2/Next uygulamaları, Postgres (16, scram-sha-256), Redis 127.0.0.1.
- Halka açık depolar (Akts-Studio: akts-landing, aktas-mail, portfolio, turkce-spam-modeli, better-worlds, trCore, mArmorTrimer): geçmiş taramasında (`git log -p` + regex) gerçek sır bulunmadı; `.env.example` dosyaları yer tutucu (aktas-mail DATABASE_URL parolası 6 karakterlik `PA…` yer tutucu). Diğer açık depolar (PerPlayerKit, BetterRTP, AllayChat vb.) fork görünüyor, taramadım -> yapılmadı. Not: AGENTS.md "akts-landing özel" diyor ama GitHub'da akts-landing **PUBLIC**; bilinçli değilse gizliye al.
- aktas-mail kodu: çerez `httpOnly` + `sameSite=strict` + `secure` (prod), helmet, CORS `APP_ORIGIN`'e sabit, rate-limit, TOTP sırrı AES-256-GCM, IMAP parolası sunucuda düz saklanmıyor (istemci anahtarıyla), passkey, admin uçlarında 10/saat sınır. Hata sayfaları yığın izi sızdırmıyor (Fastify/Express kısa 404). Giriş uçları nginx'te 10 istek/dk.
- studytrack API, ezan API: hata gövdesi "Cannot GET" (Express) — sürüm/yığın yok.

## OLASI (doğrulanamadı)
- Cloudflare SSL modu (Flexible/Full/Strict) ve WAF/hız sınırı kuralları — panele erişimim yok. Nginx'teki `$http_x_forwarded_proto = "http"` yönlendirmeleri Flexible döneminden kalmış olabilir.
- Cloudflare Authenticated Origin Pulls / Bot Fight durumu.
- studytrack/ezan/oyunhub/maske-paket API'lerinde giriş/kayıt/şifre sıfırlama hız sınırları, CSRF, JWT sırrı varsayılan mı: kod depoları yerelde okunmadı, uçlara istek atılmadı -> yapılmadı. (Yalnız aktas-mail incelendi.)
- SSRF/açık yönlendirme: yalnız aktas-mail'de işaret aranmadı ayrıntılı; `akts.tr/maske` yönlendirmeleri sabit hedefli (açık yönlendirme yok).
- Mail arayüzü passkey yapısı kodda makul; canlı passkey akışı denenmedi.
- Postfix açık röle testi bilerek yapılmadı; yapılandırma okunarak açık röle görünmüyor.
- Discord jetonlarının (bulgu 4) gerçekten sızıp sızmadığı.

## Dolandırıcı e-postadaki iddialar ile eşleşme
- "Origin açık": KISMEN DOĞRU (bulgu 1) — ama bu, IP'nin zaten `mail.akts.tr` A kaydıyla herkese açık olmasından kaynaklanıyor; "buldum" diyecek yeni bir şey değil, otomatik tarayıcı çıktısı.
- "DNS politikası": DOĞRU ama düşük önem (DMARC p=none, CAA/MTA-STS/DNSSEC yok, blankreel/maskepacks SPF+DMARC yok; bulgu 8). Bir güvenlik açığı değil, e-posta kimlik doğrulama eksikliği.
- "Açık kaynak ağacında öğeler": DOĞRULANAMADI — halka açık depolarda sır/anahtar yok (bulgu: temiz). Olası tek "öğe" akts-landing'in PUBLIC olması.
- e-postanın "15 USD" talebi: tipik dolandırıcılık kalıbı; ödeme yapmayın, yanıt vermeyin. Rapordaki hiçbir bulgu uzaktan doğrudan sömürülebilir kritik açık değil.

## Hemen yapılabilecek düşük riskli düzeltmeler
1. `chmod 600` ile sır dosyaları + `chmod 700 /root` (bulgu 4).
2. mail vhost'una ACME `location` ekle, `certbot renew --dry-run`, eski trprac sertifikalarını sil (bulgu 5). Son tarih: 16 Kasım (yenileme ~17 Ekim'de denenir).
3. mail vhost: `X-Forwarded-For $remote_addr` (bulgu 6).
4. nginx `http {}`: `server_tokens off;` (bulgu 2).
5. Cloudflare Response Header kuralı: HSTS, nosniff, Referrer-Policy, XFO (bulgu 2).
6. DNS: `_dmarc`/SPF `-all` maskepacks.com için; blankreel.com için SPF (+ DMARC p=none ile başla); CAA kayıtları; kahya.akts.tr kaydını sil.
7. `aktas-mail` için `npm audit fix` + test (bulgu 7).

## Eymen'in kararı gereken
1. Origin kilitleme yöntemi: Cloudflare IP'lerine kısıtlama mı, Authenticated Origin Pulls + Origin CA + Full (strict) mi? mail.akts.tr doğrudan kalmak zorunda. (Bulgu 1)
2. Servisleri root'tan çıkarma (n8n, Minecraft, blankreel öncelikli) — bakım penceresi gerektirir. (Bulgu 3)
3. n8n.akts.tr erişimini kimlerle sınırlayalım (IP/Cloudflare Access)?
4. Discord jetonlarını yenilemek ister misiniz (yalnız yerel okunabilirlik vardı)?
5. `/root/cpvp-backup-20260922.zip` (11 GB), `cpvp-yonlendirme` vhost'u ve cpvp.io/admin.cpvp.io sertifikaları: kaldırılsın mı?
6. `akts-landing` GitHub deposu PUBLIC: bilinçli mi, gizliye alınsın mı?
7. DMARC politikasını `p=none`'dan `quarantine`'e yükseltme zamanı ve `rua` adresi (aktas.tr yetki kaydı) kararı.
8. Mail arayüzüne CSP/XFO eklerken önce Report-Only denemesi onayı.
