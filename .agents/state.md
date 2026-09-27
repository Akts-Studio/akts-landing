# Durum — akts-landing

Güncelleme: 2026-09-27 | Son araç: claude

## Hedef

`gizlilik-footer-404` dalı tamamlandı ve push edildi. Landing tarafında
açık iş kalmadı; sıradaki iş Ezan Vaktim uygulamasında
(`~/Desktop/projects/ezan-vaktim`).

## Yapıldı

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

## Sıradaki adım

Play: MehtApp içerik derecelendirmesi (IARC koşulları, Eymen onayı), 12 test kullanıcısı e-postası, kapalı test; StudyTrack 48 MB AAB (`studytrack/android/app/build/outputs/bundle/release/app-release.aab`) Eymen elle yükleyecek. Landing'de iş yok. Yeni bir "yakında" işi olursa `upcoming` dizisine eklemek
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
