/* ═══════════════════════════════════════════════════════════════
   Sayfanın tüm içeriği burada. Yeni kişi/servis eklemek için
   HTML kopyalamak yok — aşağıdaki dizilere bir nesne ekle.
   `icon` değeri src/components/Logos.tsx içindeki tanımın adı.
   ═══════════════════════════════════════════════════════════════ */

export type LogoName = 'mail' | 'oyun' | 'n8n' | 'kod' | 'zarf' | 'github' | 'ezan' | 'study' | 'blankreel'

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
  tags: string[]
}

export const apps: App[] = [
  {
    name: 'MehtApp',
    tagline: 'Ezan vakti ve namaz takibi',
    desc: 'Diyanet takvimiyle aynı vakitler, kilit ekranında ezan uyarısı, seri ve kaza takibi.',
    href: 'https://ezan.akts.tr',
    icon: 'ezan',
    shot: '/shots/mehtapp.jpg?v=2',
    tint: 'radial-gradient(120% 90% at 50% 0%, #15523f, #0b3b2e 55%, #062419)',
    tags: ['Android', 'Galaxy Watch', 'Widget'],
  },
  {
    name: 'StudyTrack',
    tagline: 'Ders çalışma takibi',
    desc: 'Pomodoro zamanlayıcı, günlük hedef, seri ve rozetler; haftalık ve ders bazlı analiz.',
    href: 'https://studytrack.tr',
    icon: 'study',
    shot: '/shots/studytrack.jpg',
    tint: 'radial-gradient(120% 90% at 50% 0%, #e3efe7, #cde0d4 60%, #a9ccb7)',
    tags: ['Android', 'Wear OS', 'Web'],
  },
]

export const services: Link[] = [
  {
    name: 'Aktaş Mail',
    desc: 'akts.tr posta kutusu · passkey ile giriş',
    href: 'https://mail.akts.tr',
    icon: 'mail',
    accent: 'var(--c-mailapp)',
    featured: true,
  },
  {
    name: 'OyunHub',
    desc: 'Tarayıcıda anında oynanan Türkçe oyun portalı',
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
    avatar: '/assets/profile.jpg',
    initials: 'EA',
    aka: 'MaskeDev',
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
