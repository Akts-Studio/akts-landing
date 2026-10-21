/* ═══════════════════════════════════════════════════════════════
   Sayfanın tüm içeriği burada. Yeni kişi/servis eklemek için
   HTML kopyalamak yok — aşağıdaki dizilere bir nesne ekle.
   `icon` değeri src/components/Logos.tsx içindeki tanımın adı.
   ═══════════════════════════════════════════════════════════════ */

export type LogoName = 'mail' | 'oyun' | 'n8n' | 'kod' | 'zarf' | 'github' | 'ezan' | 'study' | 'blankreel' | 'fit'

export type Link = {
  name: string
  desc: string
  href: string
  icon: LogoName
  /** satırın accent rengi — index.css'teki servis renklerinden biri */
  accent: string
  /** öne çıkan satır: etrafında yumuşak hâle ve nabız atar */
  featured?: boolean
  /** önizlemesiz, tam genişlikte ince satır */
  span?: boolean
}

export type Person = {
  name: string
  role: string
  /** yoksa baş harfler gösterilir */
  avatar?: string
  initials: string
  /** adın hemen altında: oyun içi takma ad */
  aka?: string
  /** Discord kullanıcı kimliği: kişi kartında canlı durum gösterilir */
  discord?: string
  links: Link[]
}

export type App = {
  name: string
  tagline: string
  desc: string
  href: string
  icon: LogoName
  /** ekran görüntüsü, public/shots altında */
  shot: string
  /** vitrin panelinin zemini: uygulamanın kendi rengi */
  tint: string
  /** kart çerçevesinin rengi (--brand) */
  accent: string
  tags: string[]
}

export const apps: App[] = [
  {
    name: 'MehtApp',
    tagline: 'Ezan vakti ve namaz takibi',
    desc: 'Diyanet takvimiyle aynı vakitler, kilit ekranında ezan uyarısı, seri ve kaza takibi.',
    href: 'https://ezan.akts.tr',
    icon: 'ezan',
    shot: '/shots/mehtapp.webp?v=3',
    accent: 'var(--c-ezan)',
    tint: 'radial-gradient(120% 90% at 50% 0%, #15523f, #0b3b2e 55%, #062419)',
    tags: ['Android', 'Galaxy Watch', 'Widget'],
  },
  {
    name: 'StudyTrack',
    tagline: 'Ders çalışma takibi',
    desc: 'Pomodoro zamanlayıcı, günlük hedef, seri ve rozetler; haftalık ve ders bazlı analiz.',
    href: 'https://studytrack.tr',
    icon: 'study',
    shot: '/shots/studytrack.webp?v=3',
    accent: 'var(--c-study)',
    tint: 'radial-gradient(120% 90% at 50% 0%, #e3efe7, #cde0d4 60%, #a9ccb7)',
    tags: ['Android', 'Wear OS', 'Web'],
  },
  {
    name: 'Aktaş Fit',
    tagline: 'Yağ insin, kas kalsın',
    desc: 'Fotoğraftan kalori, saatinden ölçülen yakım ve her gün yeniden dengelenen hedef.',
    href: 'https://fit.akts.tr',
    icon: 'fit',
    shot: '/shots/aktasfit.webp?v=3',
    accent: 'var(--c-portfolyo)',
    tint: 'radial-gradient(120% 90% at 50% 0%, #4a1414, #2a0b0b 55%, #120505)',
    tags: ['Android', 'Yapay zekâ', 'Widget'],
  },
]

export const services: Link[] = [
  {
    name: 'Aktaş Mail',
    desc: 'Akts Studio posta kutusu · passkey ile giriş',
    href: 'https://mail.akts.tr',
    icon: 'mail',
    accent: 'var(--c-mailapp)',
    featured: true,
  },
  {
    name: 'OyunHub',
    desc: '600+ ücretsiz tarayıcı oyunu · 2 kişilik, ikonik ve arcade · indirme yok',
    href: 'https://oyun.akts.tr',
    icon: 'oyun',
    accent: 'var(--c-oyun)',
  },
  {
    name: 'BlankReel',
    desc: 'Kodla kısa video üretimi · TikTok, Shorts ve Reels için API',
    href: 'https://blankreel.com',
    icon: 'blankreel',
    accent: 'var(--c-blankreel)',
  },
  {
    name: 'n8n',
    desc: 'İş akışı otomasyonu · giriş gerekir',
    href: 'https://n8n.akts.tr',
    icon: 'n8n',
    accent: 'var(--c-n8n)',
    span: true,
  },
]

export const people: Person[] = [
  {
    name: 'Eymen Aktaş',
    role: 'Minecraft ekosistemi · makine öğrenmesi',
    avatar: '/assets/profile.webp?v=3',
    initials: 'EA',
    aka: 'Nemy',
    discord: '1507392064206278919',
    links: [
      {
        name: 'Portfolyo',
        desc: 'eymen.akts.tr',
        href: 'https://eymen.akts.tr',
        icon: 'kod',
        accent: 'var(--c-portfolyo)',
      },
      {
        name: 'GitHub',
        desc: 'github.com/eymenaktas',
        href: 'https://github.com/eymenaktas',
        icon: 'github',
        accent: 'var(--c-github)',
      },
      {
        name: 'Akts Studio',
        desc: 'github.com/Akts-Studio',
        href: 'https://github.com/Akts-Studio',
        icon: 'github',
        accent: 'var(--c-github)',
      },
      {
        name: 'Mail gönder',
        desc: 'eymen@akts.tr',
        href: 'mailto:eymen@akts.tr',
        icon: 'zarf',
        accent: 'var(--c-mail)',
      },
    ],
  },
]

/** Henüz yayında olmayan işler. Bağlantı yok — yalnız bilgi veriyor. */
export type Upcoming = {
  name: string
  desc: string
  icon: LogoName
  accent: string
  /** karttaki etiket, ör. "Geliştiriliyor" */
  status: string
}

export const upcoming: Upcoming[] = []
