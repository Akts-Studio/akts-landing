/* ═══════════════════════════════════════════════════════════════
   GİZLİLİK METNİ — TEK KAYNAK.

   Bu metin akts.tr/gizlilik adresinde yayımlanıyor ve alan adı
   altındaki DİĞER siteler (eymen.akts.tr) buraya
   bağlanıyor. Metni üç yere kopyalamak yerine tek yerde tutmanın
   sebebi: kopyalar zamanla ayrışır ve birbiriyle çelişen iki
   gizlilik taahhüdü hukuken kötü bir yerdir.

   Her sitenin kendine özgü kısmı (o sitenin tarayıcıda ne sakladığı)
   `siteNotes` içinde ayrı ayrı duruyor; diğer siteler yalnızca kendi
   maddesini gösterip gerisi için buraya bağlanıyor.

   DEĞİŞTİRİRKEN: `updated` alanını da güncelle. Sözleşmenin ne zaman
   değiştiğini göstermek KVKK aydınlatma yükümlülüğünün parçası.
   ═══════════════════════════════════════════════════════════════ */

export const legal = {
  /** Metnin son güncellendiği tarih — sayfada görünür. */
  updated: '2026-10-11',

  controller: {
    name: 'Eymen Aktaş',
    /** KVKK'da "veri sorumlusu", GDPR'da "controller" */
    title: 'Veri sorumlusu',
    email: 'eymen@akts.tr',
    scope: 'akts.tr ve alt alan adları',
  },
} as const

export type LegalSection = {
  heading: string
  /** Düz paragraflar */
  body?: string[]
  /** Madde listesi */
  bullets?: string[]
  /** Öne çıkan kutu — sayfada çerçeveli gösterilir */
  callout?: string
}

/* Metnin kendisi. Türkçe, sade, avukat dili değil — ama KVKK m.10
   aydınlatma yükümlülüğünün istediği başlıkları karşılıyor:
   kimlik, işleme amacı, hukuki sebep, aktarım, haklar. */
export const privacySections: LegalSection[] = [
  {
    heading: 'Kısaca',
    callout:
      'Bu sitelerde analitik yok, izleme çerezi yok, üyelik yok, reklam yok. ' +
      'Sunucuya gönderilen kişisel veri toplanmıyor. Tarayıcında tutulan ' +
      'birkaç tercih var; onlar da senin cihazından hiç çıkmıyor.',
    body: [
      'Aşağısı aynı şeyin uzun ve eksiksiz hâli. Kısa hâliyle uzun hâli ' +
        'çelişirse geçerli olan uzun hâlidir.',
    ],
  },
  {
    heading: 'Veri sorumlusu',
    body: [
      `Bu sitelerin veri sorumlusu ${legal.controller.name}. İletişim: ${legal.controller.email}.`,
      'Metin akts.tr alan adı ile alt alan adlarındaki halka açık siteleri ' +
        'kapsar: akts.tr (karşılama sayfası) ve ' +
        'eymen.akts.tr (kişisel portfolyo).',
    ],
  },
  {
    heading: 'Toplanmayanlar',
    body: [
      'Ne yapılmadığını yazmak, ne yapıldığını yazmak kadar önemli. ' +
        'Bu sitelerde aşağıdakilerin hiçbiri yok:',
    ],
    bullets: [
      'Google Analytics, Plausible, Matomo, Umami ya da başka bir analitik aracı',
      'Hiçbir sitede reklam ağı, piksel ya da yeniden hedefleme etiketi yok',
      'İzleme (tracking) çerezi veya üçüncü taraf çerezi',
      'Üyelik, hesap açma, giriş yapma',
      'İletişim formu, bülten kaydı, e-posta toplama',
      'Parmak izi (fingerprinting) çıkaran betikler',
    ],
  },
  {
    heading: 'Tarayıcında saklananlar',
    body: [
      'Siteler bazı tercihlerini hatırlar. Bunlar tarayıcının ' +
        'localStorage alanında, yalnızca senin cihazında durur. ' +
        'Sunucuya gönderilmez, tarafımızdan okunamaz, başkasıyla ' +
        'paylaşılmaz. Tarayıcının site verilerini temizlemen hepsini siler.',
      'Hangi sitenin ne sakladığı aşağıda ayrı ayrı yazılı.',
    ],
  },
  {
    heading: 'Sunucu kayıtları',
    body: [
      'Siteler kendi sunucumuzda nginx ile yayımlanıyor. Sunucu ' +
        'Türkiye’de barındırılıyor (Treas Internet ve Bilişim ' +
        'Teknolojileri). Her web sunucusu gibi nginx de erişim kaydı ' +
        'tutar. Bu kayıtlar teknik işletim ve kötüye kullanımın tespiti ' +
        'amacıyla, meşru menfaat hukuki sebebine dayanarak işlenir; ' +
        'pazarlama için kullanılmaz, profil çıkarmak için kullanılmaz, ' +
        'üçüncü taraflara satılmaz veya devredilmez.',
      'Kayıtlar günlük olarak döndürülür ve on dört gün sonra silinir.',
    ],
    bullets: [
      'IP adresi',
      'İstek zamanı, istenen adres ve HTTP durum kodu',
      'Tarayıcı kimliği (user agent) ve varsa yönlendiren adres',
    ],
  },
  {
    heading: 'Üçüncü taraflar',
    body: [
      'Sayfalar mümkün olduğunca kendi sunucumuzdan servis edilir. ' +
        'Yine de aşağıdaki taraflara istek gider; bu isteklerde ilgili ' +
        'sağlayıcı IP adresini teknik olarak görür.',
    ],
    bullets: [
      'Cloudflare — akts.tr ve alt alan adlarının DNS’i ve trafiği Cloudflare üzerinden geçer (proxy açık). Yani siteye gelen her istek önce Cloudflare’ın sunucularına, sonra bize ulaşır. Cloudflare bu sırada IP adresini ve istek bilgisini işler ve bunu yurt dışındaki sunucularında yapabilir. Amaç güvenlik ve hız; Cloudflare’ın kendi gizlilik politikası geçerlidir.',
      'Bir dış bağlantıya tıkladığında (GitHub, Discord vb.) artık o sitenin politikası geçerlidir',
    ],
  },
  {
    heading: 'Yurt dışına aktarım',
    body: [
      'Barındırma Türkiye’de. Ancak trafik Cloudflare’ın küresel ağından ' +
        'geçtiği için istekler fiilen yurt dışındaki bir uç sunucuda ' +
        'karşılanır — bu metin yazılırken Türkiye’den gelen istekler ' +
        'Cloudflare’ın Prag ucuna düşüyordu. Yazı tipleri dahil tüm ' +
        'dosyalar kendi sunucumuzdan gelir; Google Fonts kullanılmaz.',
      'Yani teknik veriler (başta IP adresi) yurt dışında işleniyor. ' +
        'Bu aktarım hizmetin sunulabilmesi için zorunludur, pazarlama ' +
        'amacı taşımaz ve aktarılan veri istek üstverisiyle sınırlıdır.',
    ],
  },
  {
    heading: 'Çerezler',
    body: [
      'Bu siteler çerez (cookie) yazmaz. Bu yüzden bir çerez onay ' +
        'penceresi de yoktur — sorulacak bir şey olmadığı için. ' +
        'Yukarıda anlatılan localStorage kayıtları çerez değildir ve ' +
        'sunucuya hiç gönderilmez.',
      'Tek istisna olabilecek yer Cloudflare’dır: bot koruması devreye ' +
        'girerse teknik bir güvenlik çerezi koyabilir. Bu çerez ' +
        'pazarlama veya izleme amacı taşımaz. Bu metnin yazıldığı tarihte ' +
        'üç sitenin hiçbiri yanıtında çerez göndermiyordu.',
    ],
  },
  {
    heading: 'Haklarınız',
    body: [
      'KVKK m.11 ve GDPR m.15–22 kapsamında kişisel verilerinize ilişkin ' +
        'haklarınız saklıdır: işlenip işlenmediğini öğrenme, bilgi talep ' +
        'etme, düzeltilmesini veya silinmesini isteme, işlemeye itiraz etme.',
      `Bu haklar için ${legal.controller.email} adresine yazabilirsiniz. ` +
        'Talepler en geç otuz gün içinde yanıtlanır.',
      'Pratikte elimizde size ait tanımlanabilir bir kayıt bulunması pek ' +
        'olası değildir — üyelik yok, form yok, analitik yok. Sunucu ' +
        'erişim kayıtları ise on dört gün sonra silinir.',
    ],
  },
  {
    heading: 'Çocukların gizliliği',
    body: [
      'Bu siteler çocuklara yönelik değildir ve bilerek çocuklardan ' +
        'kişisel veri toplamaz. Zaten hiç kimseden hesap bilgisi ' +
        'toplamıyor.',
    ],
  },
  {
    heading: 'Değişiklikler',
    body: [
      'Bu metin değişirse üstteki güncelleme tarihi değişir. Geriye ' +
        'dönük olarak sessizce değiştirilmez.',
    ],
  },
  {
    heading: 'İletişim',
    body: [
      `Gizlilikle ilgili her soru için: ${legal.controller.email}`,
    ],
  },
]

/* Her sitenin tarayıcıda ne sakladığı. Bu diziler kodun kendisinden
   okunarak yazıldı (grep ile localStorage anahtarları), tahminle değil.
   Yeni bir tercih eklendiğinde buraya da eklenmeli. */
export type SiteNote = {
  site: string
  host: string
  items: { key: string; what: string }[]
}

export const siteNotes: SiteNote[] = [
  {
    site: 'akts.tr — karşılama sayfası',
    host: 'akts.tr',
    items: [{ key: 'akts-theme', what: 'Açık/koyu tema tercihi' }],
  },
  {
    site: 'Kişisel portfolyo',
    host: 'eymen.akts.tr',
    items: [{ key: '—', what: 'Hiçbir şey saklanmıyor' }],
  },
]
