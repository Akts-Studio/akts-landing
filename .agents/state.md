# Durum — akts-landing

Güncelleme: 2026-10-22 | Son araç: claude

## 2026-10-22 (CANLI, index-DYagB64T.js)

21 Ekim öncesine geri alınmıştı; yalnız kart efekti (RimCard, rAF'lı pointermove) ve BlankReel tarzı liquid glass Navbar (logo, bağlantılar, tema, Discord hapı) geri eklendi. Yıldız zemini, 3D ve Discord durumu YOK. legal.ts'e dokunulmadı. Derleme scratch kopyada, `rsync -a dist/` (--delete yok).

## 2026-10-14 tema (CANLI)

Vurgu turuncu-kırmızı: `--brand-accent` `#ff5b4a`/`#c8281c`, aurora `--aurora-1..3`. Uygulamalar `md:grid-cols-3`, telefonlar yelpaze (AppShowcase `index` prop). Aktaş Fit vitrini Inter'le HTML'den yeniden çizildi (`shots/aktasfit.jpg?v=2`) — gerçek cihaz görüntüsü gelirse değiştir. Profil `profile.jpg?v=2` (Snoopy). Derleme scratch'te `git archive HEAD` + `npm ci` ile yapıldı, `rsync -a dist/ akts:/var/www/akts.tr/`. `src/data/legal.ts` ve `.claude/launch.json` önceden kalma commit'lenmemiş değişiklik — dokunulmadı.

## Bilinen tuzak — Aviary (2026-10-14)

Aviary "sıkıştırma yok" der ama Cloudflare br veriyor (yanlış pozitif); `alt=""` süs görsellerini "eksik" sayar. Eksik kalan tek başlık CSP, bilerek eklenmedi.

## Bilinen tuzak — iCloud (2026-10-11)

`~/Desktop/projects` iCloud'da; node_modules, package-lock ve hatta `.git/index`
"dataless" kalabiliyor, tsc/git saatlerce takılıyor. Doğrulamayı scratch'e
`rsync --exclude node_modules` + `npm ci` ile yap. Sunucuya çoklu dosya
scp'de dizin hedefi verme: `rsync --relative` kullan (bir kez app/page.tsx ezildi).

## Hedef

`gizlilik-footer-404` dalı tamamlandı ve push edildi. Landing tarafında
açık iş kalmadı; sıradaki iş Ezan Vaktim uygulamasında
(`~/Desktop/projects/ezan-vaktim`).

## Yapıldı

- [x] **2026-10-14 SEO/başlık düzeltmeleri (CANLI, Aviary denetimi, OyunHub hariç):** `snippets/akts-basliklar.conf` (HSTS, nosniff, X-Frame, Referrer, Permissions) akts.tr/eymen/ezan/fit/studytrack(+app) server'larına ve kendi add_header'ı olan her location'a include edildi; nginx.conf'ta gzip_types açıldı; akts.tr'ye /assets immutable + index no-cache, eymen'e index no-cache. robots.txt + sitemap.xml beş siteye (kaynak: akts-landing/public, websitesi, ezan-vaktim/site, sunucu/fit, studytrack/site/public). Başlıklar akts.tr ve eymen'de uzatıldı; fit ve studytrack'e canonical, studytrack'e OG. studytrack ve akts.tr index'i sunucuda elle yamandı (yeniden derlenmedi, kaynak da güncel). Yedekler `/root/nginx-yedek-20261014-2224/`, `/root/seo-yedek-20261014.tgz`. Diğer depolardaki (websitesi, ezan-vaktim, studytrack) değişiklikler commit'lenmedi.

- [x] **2026-10-14 fit.akts.tr (CANLI):** kaynak `sunucu/fit/` → `/var/www/fit.akts.tr/`, APK `/indir/AktasFit.apk` (elle rsync), nginx `sites-available/fit.akts.tr` (öz-imzalı, Cloudflare önde). Landing `apps`'te Aktaş Fit, portfolyoda bağlantı. Cloudflare 404'ü önbelleğe alıyor: yeni dosyaya `?v=` ver. Yedek `/root/akts.tr-yedek-2026-10-14-fit.tgz`.

- [x] **2026-10-14 ortak Akts 404 (CANLI):** `/var/www/akts-404/404.html` (kaynak `sunucu/akts-404/`), `snippets/akts-404.conf` akts.tr/eymen/oyun, ezan, studytrack(+app), mail bloklarına include edildi; blankreel ve maskepacks hariç. Yedekler `/root/*.nginx.yedek-20261014-*-404`. akts.tr apex artık =404 ile bitiyor ($uri.html dahil); React NotFound prod'da kullanılmıyor. oyun/studytrack SPA fallback yüzünden 404 vermez. Sayfa animasyonlu, reduced-motion guard var.

- [x] **2026-10-11 GitHub profil README'si (eymenaktas/eymenaktas, CANLI):** tüm görseller
      depodaki betiklerle üretiliyor (`scripts/butonlar.mjs`, `scripts/gorseller.mjs` → `output` dalı);
      shields/capsule/typing-svg/komarev kalktı. Görüntülenme sayacı akts.tr sunucusunda:
      pm2 `profil-sayac` (127.0.0.1:8794, `/srv/profil-sayac/sayi.json`), nginx `location = /sayac/profil`
      (yedek `/root/akts.tr.nginx.yedek-20261011-sayac`); komarev'den 155 ile başlatıldı.

- [x] **2026-10-11 hukuki risk temizliği (tüm projeler, CANLI):** Google Fonts
      her yerde yerelden (portfolyo, OyunHub, studytrack.tr + yasal + hesap-sil,
      BlankReel); canlıda Google'a 0 istek ölçüldü. BlankReel: Sentry replay
      kapalı, kayıtta zorunlu 16+ kutusu, plan butonu altında yenileme şartı.
      StudyTrack: kayıt metni + yasal sayfada 13 yaş. Gizlilik metinleri
      güncellendi (landing 218d374, portfolyo e5ddeae, studytrack 68a5f65).
      Canlı yedekleri: `*.yedek-20261011-*`, `/root/akts.tr-yedek-2026-10-11.tgz`,
      `/srv/blankreel/**.bak.20261011-*`.
      ÇÖZÜLDÜ (2026-10-14): BlankReel e583e64 üzerine rebase edilip push edildi (f66061e → 2b18834); MCP işi 4eda5a8'e kadar canlı dalda.
      web2: 7e57df9 push edildi (`yerel-oyunlar` dalı); `.git/index` iCloud'da dataless'tı,
      `.git/index.icloud-dataless` olarak kenara alınıp HEAD'den yeniden kuruldu.
      DMCA ajan kaydı Eymen'de (copyright.gov, BlankReel için).

- [x] 2026-10-10: `.claude/launch.json`'a `mehtapp-landing-vakit` (4201) eklendi;
      4200 başka oturumun. İş ezan-vaktim'deydi, oranın state.md'sine bak.

- [x] Yanlışlıkla açılan PR (Akts-Studio/akts-landing#1) 2026-10-10'da kapatıldı, dal duruyor.

- [x] Gizlilik metni, footer, 404 sayfası (6f2571c)
- [x] Aurora WebGL'e taşındı, footer giriş animasyonu kaldırıldı (81ff62f)
- [x] Harness kuruldu: `AGENTS.md`, `CLAUDE.md`, `.agents/`
- [x] ClickSpark + CountUp efektleri, `components.json` React Bits kaydı,
      `skillui/` ve `yedek/` gitignore'a alındı (5f2892d)
- [x] **Kâhya landing'den kaldırıldı** (d65d152): `people` girdisi,
      `i-kahya` karosu, `--c-kahya`, `public/assets/kahya.svg` silindi.
      `kahya.akts.tr` sunucuda açık kalmaya devam ediyor.
- [x] **"Yakında" bölümü + Ezan Vaktim kartı** (d65d152): `UpcomingCard`
      bileşeni, `upcoming` dizisi, `i-ezan` hilâl glifi, `--c-ezan`.
      Kart bilerek bağlantı değil (site yok, yalnız bilgi).
- [x] Tip kontrolü, secret taraması ve üç viewport görsel sensör temiz
- [x] Dal push edildi: `origin/gizlilik-footer-404`

- [x] **StudyTrack kartı** (6105b9f): `services`'te, `https://studytrack.tr`'ye
      gidiyor. Glif eski StudyTrack logosunun (kitap + onay) tek renk hâli,
      renk `#4cb572` doğrudan glifte (diğer glifler gibi; currentColor
      kartta siyah kalıyordu).
- [x] **Canlıya çıktı** (2026-09-19): `dist/` → `/var/www/akts.tr/`
      (`ezan/`, `studytrack/` dizinlerine dokunulmadan). Önceki canlı
      2 Eylül derlemesiydi; Kâhya kaldırma ve Ezan kartı da ilk kez
      canlıya çıktı. Yedek: `/root/akts.tr-yedek-2026-09-19.tgz`.

- [x] **Ezan Vaktim `services`'e taşındı** → `https://ezan.akts.tr`,
      **BlankReel eklendi** → `https://blankreel.com` (sitenin kendi işareti,
      koyu karo). `upcoming` boş; "Yakında" bölümü boşken gizleniyor
      (72d4486). Canlıda. Yedek: `/root/akts.tr-yedek-2026-09-19b.tgz`.

- [x] **Ezan karosundaki hilâl düzeltildi** (cd7833e): eski yol iki dairenin
      evenOdd farkıydı, iç daire dışarı taştığı için sağda ince bir şerit
      çıkıyordu. Artık kesişim noktalarından geçen gerçek yay yolu. Aynı
      düzeltme ezan-vaktim deposundaki altı dosyada da yapıldı. Canlıda.

- [x] **Maske paket kurucusu maskepacks.com'a taşındı** (2026-09-24): akts.tr/maske nginx'te
      301 ile yönleniyor (`/etc/nginx/sites-available/akts.tr`), `maske/` klasörü kaldırıldı.
      Kaynak `~/Desktop/projects/maske-pack`.

- [x] **Paylaşım görselleri** (2026-09-24): `scripts/og-image.mjs` (harness Playwright
      ile 1200x630). akts.tr `public/og.png`; aynı üreticiyle maske, eymen (websitesi),
      mail (aktas-mail) ve oyun (web2) görselleri. `theme-color` Discord şeridinin rengi.
      Canlıya çıktı; yedek `/root/akts.tr-yedek-2026-09-24.tgz`.
- [x] **cpvp.io ve Kâhya kapatıldı** (2026-09-24): nginx bağlantıları kaldırıldı,
      `kahya.akts.tr` bloğu `akts.tr` ayarından çıkarıldı, `cpvp-discord` pm2'de durduruldu.
      Geri açmak için yedek: `/root/kapatilan-2026-09-24/`.

- [x] **OyunHub gizlilik metni** (61f95fc): oyun sayaçları eklendi, Internet Archive
      çıkarıldı. Canlıda; yedek `/root/akts.tr-yedek-2026-09-24b.tgz`.

- [x] **maskepacks.com paket hatası** (2026-09-24): pm2 `maske-paket` süreci eski
      `MASKE_DATA=/var/www/akts.tr/maske/data` ile çalışıyordu; doğru yolla yeniden başlatıldı, `pm2 save`.
      Skin'ler `PlayerSkinInitEvent` ile atanıyor (8e7231f, maske-pack).

- [x] **Maske test sunucusu, 2026-09-24 akşamı** (maske-pack fd6b07e'ye kadar):
  - kalkan hep küçük, dolu/hollow seçimi kalıyor;
  - ağlayan obsidyen temaya boyanıyor; anchor üstü opak; sunucu paketinde anchor uğultusu ve ateş sesi yok;
  - müzik köşesi: jukebox, disklerin ek paketi `/muzik`;
  - bayraklı 10 dil: `Dil.java`, `sunucu/ceviri.py` → `resources/dil/*.json`, `/language`;
  - diyalog 3 sayfa, eşya başına boy seçimi;
  - kamera sırası öncelikli: `arka=1` ile ön çekim.

- [x] **Maske Packs servisi + "aka MaskeDev"** (a660c4c): `Person.aka`, `i-maske` glifi,
      `--c-maske`. Canlıda; yedek `/root/akts.tr-yedek-2026-09-25.tgz`.

- [x] **cpvp.io bitti** (2026-09-25): cpvp.io/admin → 301 maskepacks.com
      (`/etc/nginx/sites-available/cpvp-yonlendirme`), `cpvp-web`/`cpvp-discord` pm2'den
      silindi, `launch.json`'dan `cpvp-web` çıktı. cpvp için iş yapma.

- [x] **StudyTrack yeniden tasarım** (2026-09-25): uygulama ana/çalışma/analiz ekranları (studytrack b06c84d),
      Play görselleri `store/play/magaza`, yeni site `studytrack/site` (c7d64a0) canlıda
      (yedek `/root/studytrack-landing-yedek-2026-09-25.tgz`), saat teması (studytrack-android).
      Eski Figma kaynağı `~/Desktop/projects/studytrack-src/landing` artık kullanılmıyor.

- [x] **Play Console (2026-09-26):** StudyTrack mağaza görselleri yenilendi, reklam kimliği beyanı. MehtApp:
      gizlilik, reklam, reklam kimliği, devlet, finans, sağlık, giriş, hedef kitle (16+), veri güvenliği (veri yok),
      kategori Yaşam Tarzı, iletişim, mağaza sayfası (store/play), dahili test taslağı (versionCode 9).
      Yükleme anahtarları `~/Desktop/projects/_imza-anahtarlari/` (git dışı, yedeklenmeli).

- [x] **2026-09-26 akşam:** 20 depo Akts-Studio org'una taşındı (TeknoAIHL-Pulse geri kişisel; `eymenaktas/akts-studio` yönlendirme deposu).
      Akts Studio logosu `public/brand/`. Tüm site footer'ları "Akts Studio". Landing uygulama vitrini, portfolyo roller +
      MaskeDev, OyunHub turuncu yeniden tasarım (açık kaynak koleksiyonu kaldırıldı), mail giriş paneli, maskepacks oyun galerisi.
      Play: iki uygulamaya Wear OS form faktörü, saat görselleri ve saat paketleri (MehtApp 1009, StudyTrack 1003) dahili test taslağı.

- [x] **Testçi grubu** `akts-studio-test@googlegroups.com` (herkes katılabilir); iki uygulamada kapalı test (Alpha): 177 ülke + grup.
      MehtApp IARC derecelendirmesi tamam. StudyTrack yükleme anahtarı sıfırlandı → yeni anahtar SHA1 1E:B0:FE,
      **2026-09-28 19:07 UTC'de geçerli**; paketler hazır (telefon app-release.aab, saat wear-release.aab).
- [x] **Maske Packs ayrıldı** (2026-09-27): landing'den kartı, `i-maske`, `--c-maske`, `maske.png` silindi (75b9944);
      maskepacks.com footer'ı "© 2026 Maske Packs", Akts Studio bağlantısı yok (maske-pack 04a9465); portfolyodan da silindi (websitesi 80dbeec). Hepsi canlıda;
      yedek `/root/akts.tr-yedek-2026-09-27.tgz`. Maskepacks'e Akts Studio markası koyma.

- [x] **Kimlik "Akts Studio"** (2026-09-30, commit edilmedi): index/404/gizlilik başlık+og, PageShell, hero, Aktaş Mail açıklaması;
      og.png Akts Studio logosuyla yeniden üretildi (`scripts/og/akts.json`); theme-color ve başlık noktası marka kırmızısı #bb2a2a.
      `vite build` bu makinede "transforming"de asılıyor (HEAD'de de; ortam sorunu), tsc+sensör+dev sunucusunda visual temiz. Canlıya çıkmadı.

- [x] **OyunHub önizleme/metin güncellemesi** (2026-10-01): oyun.akts.tr meta + og.png (600+ oyun, turuncu kimlik, `?v=2`),
      landing OyunHub kartı "600+", gizlilik metnine HilltopAds reklamı + beğeni sayacı. Canlıda; yedek `/root/akts.tr-yedek-2026-10-01-oyunhub.tgz`.
      `vite build` bu kez `~/dev/akts-landing` klonunda 8 sn'de bitti (asılma yalnız Desktop kopyasında).

- [x] **Maske Packs gerçek istatistikler** (2026-10-03, maske-pack): servis `maske-istatistik` (8793),
      `/etc/maske-istatistik.env` `HARIC_IP` = Eymen'in test IP'si (değişirse ekle), nginx
      `/istatistik.json` + `/api/say`. İndirme sayacı 2026-10-03'te sıfırdan başladı.

## Sıradaki adım

Play (2026-09-30 kontrolü): testçi grubunda sahip dahil 4 üye (3 testçi, hepsi 26 Eylül), 12 için 9 eksik; grupta "Who can post" üyelere açık.
Play Console `/u/2/` (Eymen izinli; `/u/0/` nemyontop). MehtApp 0.5.1 kapalı testte YAYINDA (29 Eylül), ama 0 testçi opt-in: gruba katılanlar
`https://play.google.com/apps/testing/tr.akts.mehtapp` bağlantısından teste de katılmalı. StudyTrack'te hiç sürüm yok (Alpha boş) — AAB yüklenmeli.
Developer verification iki pakette de "Registered" (25 Eylül), bekleyen yok. Bu işte Claude şef: alt işler Sonnet ajanlarına, Opus yalnız kritik kararlarda.
StudyTrack 2026-09-30: koyu tema, yeni giriş/kayıt, burger'dan Ayarlar çıktı (76b1202); site cila+hover canlıda (c0de36d, yedek
`/root/studytrack-landing-yedek-2026-09-30.tgz`; rsync `--delete`'siz: yasal/ hesap-sil/ cof.png yalnız sunucuda). AAB sürüm kodu 4,
`~/Downloads/StudyTrack-app-release.aab`, `-PplayUpload=true` ile imzalanmalı (yoksa debug anahtarıyla çıkar: SHA1 5E:8F). Eymen Alpha
"Sürümü düzenle" sayfasında yükleyecek (Brave, `/u/2/…/tracks/4700770244161658404/releases/1/prepare`); sonra sürüm notu, inceleme, testçi bağlantısı.
StudyTrack Alpha (2026-09-30): sürüm 5 (2.0.1) yüklendi, not+ad girildi, hata yok, KAYDEDİLDİ; "incelemeye gönder" Eymen'de
(Yayınlama genel bakışı) → Eymen GÖNDERDİ (2026-09-30 akşam); Play kontrolü geçti: 5 (2.0.1) Alpha'da YAYINDA (Sep 30 20:58, "Available to selected testers", 178 ülke). Sıradaki: 12 testçiyi
`https://play.google.com/apps/testing/tr.akts.studytrack` ve mehtapp bağlantısından teste sokmak; sayaç 12 kişide başlar. Kod 4 hatalıydı (USE_EXACT_ALARM vb.) → izinler app.json blockedPermissions ile kaldırıldı (commit var). Ardından: testçi bağlantısı/sayaç.
Önceki: MehtApp 0.5.1 incelemede (26 Eylül); StudyTrack 48 MB AAB (`studytrack/android/app/build/outputs/bundle/release/app-release.aab`) Eymen elle yükleyecek. Landing'de iş yok. Yeni bir "yakında" işi olursa `upcoming` dizisine eklemek
yeter, bölüm kendiliğinden görünür.

## Bilinen tuzaklar

- Play Console görsel paneli: alanın "Add assets"ı → panelde "Select button" (JS click) → aria-label="Add" düğmesi. Sürükle-bırak çalışmıyor. Chrome eklentisi dosya yükleme sınırı 10 MB.
- Play formlarında JS ile value atamak kaydedilmiyor; alanı tıklayıp klavyeyle yaz. Kaydet düğmesi koordinatla (1245,884) tıklanınca çalışıyor.

- studytrack-android gradle için `JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home` gerekli; yoksa sessizce derlemez.

- **`pm2 update` çalıştırma**: süreç listesini boşalttı, `pm2 resurrect` ile döndü.
  Bir sürecin ortamı için `pm2 env <id>` yeter.
- Minestom girişte skin'i `PlayerSkinInitEvent` ile yeniden yazar; yapılandırma
  olayında `setSkin` işe yaramaz.
- **Önizleme kareleri gerçek istemciden** (maske-pack 32b852c): `maske-kare` servisi (8792),
  gizli ad `/etc/maske-kamera.env`, kareler `/var/www/maske-kare/<kod>/` (bir kez çekilir, kalıcı).
  Paket içeriği değişirse eski kareler kalır: `rm -rf /var/www/maske-kare/*` + `kamera/hazirla.sh`.
- maske sunucusuna yeni metin eklenince `sunucu/ceviri.py` tablosuna 9 dilde satır ekle, çalıştır.
- `systemctl restart maske-kare` sırayı siler; sonra `systemd-run --unit=maske-hazirla --collect /srv/maske-kamera/hazirla.sh`.
- ssh komutunda `pkill -f "desen"` ssh kabuğunu da öldürür; `pkill -f "[-]-desen"` yaz.

- **Commit kimliği `eymen@akts.tr`.** 2026-09-23'te bu depo dahil 9 depoda
  `gizliman2345@gmail.com` (GitHub'da `nemyontop`) geçmişten silindi ve
  force-push edildi; eski SHA'lar (ör. 5039d04) artık yok.

- `.claude/launch.json` önizleme girdileri (oyunhub, maske-site, portfolyo…) yerel;
  commit'leme; canlıya çıkarken çalışma ağacından değil, commit'ten
  `git worktree add --detach` ile derle (node_modules'u symlink'le).

- Lint yapılandırması yok; `npm run lint` diye bir script arama.
- Dev sunucusu `.claude/launch.json`'da **4180** portunda, 5173'te değil.
  Görsel sensörü `HARNESS_URL=http://localhost:4180` ile çalıştır.
- Browser pane'de `computer{action:"zoom"}` bölge kırpmayı desteklemiyor,
  tam ekran görüntüsü döndürüyor. Küçük glifi büyütüp bakmak için öğeyi
  JS ile geçici klonlayıp büyütmek gerekiyor.
- Browser pane ekran görüntüsü DOM değişikliğinin bir tur gerisinde
  kalabiliyor; JS ile öğe ekledikten sonra ilk screenshot boş çıktı,
  ikincisinde göründü. Bir kare daha al, "olmadı" deme.
- `scroll-behavior: smooth` yüzünden `window.scrollTo(y)` erken dönüyor;
  `behavior: 'instant'` kullan. `scrollIntoView` da aynı sebeple ilk
  görüntüde yansımayabiliyor.
- Playwright MCP'si bu makinede çalışmıyor (Chrome yok, Brave var).
  Bunun yerine `harness visual` — paketlenmiş Chromium ile çalışıyor.
- Ölçekli SVG'de degradeler `objectBoundingBox` (varsayılan) kalmalı;
  maske ise `userSpaceOnUse` olmalı.
- Canlıya çıkış elle: `npm run build` sonra `rsync -a dist/ akts:/var/www/akts.tr/`
  (**`--delete` kullanma**: `ezan/`, `studytrack/` ve `maske/` dizinleri orada).
- `.claude/launch.json`'daki `maske-site` girdisi maske-pack önizlemesi içindir;
  landing commit'ine girmesin.

## 2026-10-22 navbar kasma + gösterge (claude, CANLI index-CzWaEcpr.js, 131bb3e)
Kasma sebebi: scroll'da setState + max-width/padding/border-radius geçişi (layout) backdrop-filter'lı kapsülde. Şimdi state yok; passive scroll + rAF yalnız data-scrolled yazar, küçülme transform. BlankReel navbar'ındaki kayan damla (components/landing/navbar.tsx) uyarlandı: üst %33 çizgisi, IntersectionObserver, transform, hover takibi, reduced-motion. Ölçüm (scrollperf, 4sn kaydırma): script 70→28 ms, recalc 73→45 ms.

## 2026-10-22 navbar yok olma + yükleme ekranı (claude, CANLI)
Kök neden: navbar `position:sticky` + backdrop-filter; hızlı kaydırmada compositor kareleri çubuğu çiziyor/düşürüyordu (screencast ölçümü: 346 kareden 102'sinde çubuk yoktu). `position:fixed` (wrap yalnız yer tutucu) ile 0/336. "Uygulamalar" bağlantısı "Projelerim" oldu; hafif yükleme ekranı (≤1.5 sn, reduced-motion uyumlu); OyunHub metni 20 seçkin oyun. theme-color #bb2a2a bilerek (marka kırmızısı).
