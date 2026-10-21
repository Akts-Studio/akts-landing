import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { DISCORD_PROFIL, useDiscord } from '@/lib/discord'

const LINKS = [
  { href: '#uygulamalar', label: 'Uygulamalar' },
  { href: '#servisler', label: 'Servisler' },
  { href: '#kisiler', label: 'Kişiler' },
]

function DiscordGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true" fill="currentColor">
      <path d="M19.6 5.3A17 17 0 0 0 15.4 4l-.5 1.1a15.7 15.7 0 0 0-5.8 0L8.6 4a17 17 0 0 0-4.2 1.3C1.7 9.3 1 13.2 1.3 17a17 17 0 0 0 5.2 2.6l1.1-1.8c-.6-.2-1.2-.5-1.8-.9l.4-.3a12.2 12.2 0 0 0 11.6 0l.4.3c-.6.4-1.2.7-1.8.9l1.1 1.8a17 17 0 0 0 5.2-2.6c.4-4.4-.7-8.3-3.1-11.7ZM8.7 14.7c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Zm6.6 0c-1 0-1.9-1-1.9-2.1s.8-2.1 1.9-2.1 1.9 1 1.9 2.1-.8 2.1-1.9 2.1Z" />
    </svg>
  )
}

/** Üstte ince, kaydırınca camlaşan navbar. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const v = useDiscord()
  const discord = v?.sunucu?.davet || DISCORD_PROFIL

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="nav-bar sticky top-0 z-40" data-scrolled={scrolled}>
      <nav aria-label="Ana gezinme" className="mx-auto flex h-14 w-full max-w-4xl items-center gap-2 px-4 sm:px-8">
        <a
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
        >
          <img src="/brand/akts-studio.svg" alt="" width={24} height={24} className="h-6 w-6 rounded-[6px]" />
          <span className="max-[359px]:sr-only">Akts Studio</span>
        </a>
        <ul className="ml-auto hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-1.5 md:ml-2">
          <ThemeToggle />
          <a
            href={discord}
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
