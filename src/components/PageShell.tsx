/**
 * Alt sayfaların (gizlilik, 404) ortak çerçevesi: aynı Aurora, aynı
 * nokta dokusu, aynı başlık çubuğu, aynı genişlik.
 *
 * App.tsx bunu KULLANMIYOR — ana sayfanın kendi düzeni var ve onu
 * buraya sığdırmaya çalışmak iki sayfayı da bozardı. Ortak olan
 * yalnızca çerçeve; ortaklaştırılan da o kadar.
 */
import type { ReactNode } from 'react'
import { AuroraGL } from '@/components/AuroraGL'
import { Footer } from '@/components/Footer'
import { ThemeToggle } from '@/components/ThemeToggle'

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <>
      <AuroraGL />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--hairline)) 1px, transparent 0)',
        }}
      />

      <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <a
            href="/"
            className="group flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <span
              className="h-1.5 w-1.5 rounded-full motion-safe:animate-breathe"
              style={{ background: '#bb2a2a', animationDuration: '7s' }}
              aria-hidden="true"
            />
            Akts Studio
          </a>
          <ThemeToggle />
        </header>

        <main className="flex-1">{children}</main>

        <Footer />
      </div>
    </>
  )
}
