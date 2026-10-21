import { useEffect, useState } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'
import { cn } from '@/lib/utils'

const DISCORD = 'https://discord.com/users/1507392064206278919'

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

/** BlankReel tarzı: yüzen liquid glass kapsül, kaydırınca daralır. */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 20)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  return (
    <header className="nav-wrap">
      <nav
        aria-label="Ana gezinme"
        className={cn(
          'liquid-glass mx-auto flex items-center justify-between gap-2',
          scrolled ? 'max-w-3xl rounded-2xl px-3 py-1.5' : 'max-w-4xl rounded-[22px] px-4 py-2.5',
        )}
      >
        <a
          href="/"
          className="flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-foreground"
        >
          <img src="/brand/akts-studio.svg" alt="" width={24} height={24} className="h-6 w-6 rounded-[6px]" />
          <span className="max-[399px]:sr-only">Akts Studio</span>
        </a>
        <ul className="hidden items-center gap-1 md:flex">
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
