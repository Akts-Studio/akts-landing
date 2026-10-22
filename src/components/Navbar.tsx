import { useEffect, useRef } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

const DISCORD = 'https://discord.com/users/1507392064206278919'

const LINKS = [
  { href: '#projelerim', label: 'Projelerim' },
  { href: '#kisiler', label: 'Kişiler' },
]

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M19.6 5.3A17 17 0 0 0 15.4 4l-.5 1.1a15.7 15.7 0 0 0-5.8 0L8.6 4a17 17 0 0 0-4.2 1.3C1.7 9.3 1 13.2 1.3 17a17 17 0 0 0 5.2 2.6l1.1-1.8c-.6-.2-1.2-.5-1.8-.9l.4-.3a12.2 12.2 0 0 0 11.6 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.3-3.1-11.7ZM8.7 14.7c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm6.6 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
    </svg>
  )
}

/**
 * BlankReel navbar'ından uyarlandı (components/landing/navbar.tsx): aktif bölüm ekranın üst
 * üçte birindeki çizgiye göre seçilir, gösterge aynı yay (stiffness 380, damping 30, mass 0.8)
 * karakterinde kayan cam damla; framer-motion yerine transform + CSS.
 * Kaydırma ve gösterge React state'i kullanmaz: tek passive scroll dinleyicisi rAF ile
 * yalnız eşik geçilince data-scrolled yazar; animasyon yalnız transform/opacity.
 */
export function Navbar() {
  const headerRef = useRef<HTMLElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const indRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const header = headerRef.current
    const list = listRef.current
    const ind = indRef.current
    if (!header || !list || !ind) return

    let raf = 0
    let scrolled = false
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        const next = window.scrollY > 20
        if (next !== scrolled) {
          scrolled = next
          header.toggleAttribute('data-scrolled', next)
        }
        // Sayfa sonunda son bölüm üst %33 çizgisine ulaşamaz: en alttaysak son bağlantı aktif
        const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
        const want = atBottom ? links.length - 1 : ioActive
        if (want !== active) {
          active = want
          if (!list.matches(':hover')) {
            shown = -2
            place(active)
          }
        }
      })
    }
    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a'))
    let active = -1
    let ioActive = -1
    let shown = -1
    const place = (i: number) => {
      if (i === shown) return
      shown = i
      const el = links[i]
      if (!el) {
        ind.style.opacity = '0'
        return
      }
      ind.style.opacity = '1'
      ind.style.transform = `translate3d(${el.offsetLeft}px,0,0) scaleX(${el.offsetWidth / 100})`
      links.forEach((l, k) => l.toggleAttribute('data-on', k === i))
    }
    const rest = () => place(active)
    window.addEventListener('scroll', onScroll, { passive: true })

    links.forEach((l, i) => {
      l.addEventListener('pointerenter', () => place(i))
      l.addEventListener('focus', () => place(i))
      l.addEventListener('blur', rest)
    })
    list.addEventListener('pointerleave', rest)

    const ids = links.map((l) => l.getAttribute('href')!.slice(1))
    const seen = new Map<string, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
        const i = ids.findIndex((id) => seen.get(id))
        ioActive = i
        onScroll()
      },
      { rootMargin: '-33% 0px -66.5% 0px' },
    )
    ids.forEach((id) => {
      const t = document.getElementById(id)
      if (t) io.observe(t)
    })

    // Yerleşim değişince (yeniden boyut, font yüklenmesi) göstergeyi yeniden konumla
    const ro = new ResizeObserver(() => {
      const cur = shown
      shown = -2
      place(cur)
    })
    ro.observe(list)

    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
    }
  }, [])

  return (
    <header ref={headerRef} className="nav-wrap">
      <nav
        aria-label="Ana gezinme"
        className="liquid-glass nav-bar mx-auto flex max-w-4xl items-center justify-between gap-2 rounded-[22px] px-4 py-2.5"
      >
        <a
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-foreground"
        >
          <img src="/brand/akts-studio.svg" alt="" width={24} height={24} className="h-6 w-6 rounded-[6px]" />
          <span className="max-[399px]:sr-only">Akts Studio</span>
        </a>
        <ul ref={listRef} className="nav-list relative hidden items-center gap-1 md:flex">
          <span ref={indRef} className="nav-ind" aria-hidden="true" />
          {LINKS.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="nav-link">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a
            href={DISCORD}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-pill btn-pill--brand"
            style={{ '--brand': '#4752c4' } as React.CSSProperties}
          >
            <DiscordGlyph />
            Discord
          </a>
        </div>
      </nav>
    </header>
  )
}
