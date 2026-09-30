import type { CSSProperties } from 'react'
import { AuroraGL } from '@/components/AuroraGL'
import { ClickSpark } from '@/components/ClickSpark'
import { CountUp } from '@/components/CountUp'
import { AppShowcase } from '@/components/AppShowcase'
import { Footer } from '@/components/Footer'
import { LogoDefs } from '@/components/Logos'
import { PersonSection } from '@/components/PersonSection'
import { ServiceCard } from '@/components/ServiceCard'
import { ThemeToggle } from '@/components/ThemeToggle'
import { UpcomingCard } from '@/components/UpcomingCard'
import { apps, people, services, upcoming } from '@/data/site'

function SectionTitle({
  children,
  count,
  delay,
}: {
  children: string
  count: number
  delay: number
}) {
  return (
    <div
      className="anim mb-5 flex items-center gap-3"
      style={{ '--d': `${delay}s` } as CSSProperties}
    >
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-dim">{children}</h2>
      <CountUp to={count} delay={delay + 0.1} className="text-xs tabular-nums text-dim" />
      <span className="h-px flex-1" style={{ background: 'hsl(var(--hairline))' }} />
    </div>
  )
}

export default function App() {
  return (
    <>
      <AuroraGL />
      <ClickSpark />
      {/* İnce nokta dokusu — düz zemine derinlik veriyor, okunurluğa
          dokunmayacak kadar soluk (%. birkaç). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 opacity-[0.35] [background-size:22px_22px] [mask-image:radial-gradient(70%_60%_at_50%_0%,#000,transparent)]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, hsl(var(--hairline)) 1px, transparent 0)',
        }}
      />
      <LogoDefs />

      <div className="mx-auto flex min-h-dvh w-full max-w-4xl flex-col px-6 sm:px-8">
        <header className="flex items-center justify-between py-6">
          <a
            href="/"
            className="group flex items-center gap-2 text-[15px] font-semibold tracking-[-0.02em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <img src="/brand/akts-studio.svg" alt="" className="h-6 w-6 rounded-[6px]" />
            Akts Studio
          </a>
          <ThemeToggle />
        </header>

        <main className="my-auto flex-1 pb-10 pt-10 sm:pt-16">
          <h1
            className="anim max-w-[18ch] text-[clamp(2.25rem,7.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em]"
            style={{ '--d': '.02s' } as CSSProperties}
          >
            Uygulamalar, siteler{' '}
            <span className="bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
              ve servisler.
            </span>
          </h1>
          <p
            className="anim mt-5 max-w-[50ch] text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-muted-foreground"
            style={{ '--d': '.09s' } as CSSProperties}
          >
            Akts Studio'nun Android uygulamaları, web siteleri ve kendi sunucusunda çalışan
            servisleri. Hepsi tek çatı altında.
          </p>

          <section className="mt-14">
            <SectionTitle count={apps.length} delay={0.13}>
              Uygulamalar
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {apps.map((app, i) => (
                <AppShowcase key={app.href} app={app} delay={0.17 + i * 0.06} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle count={services.length} delay={0.17}>
              Siteler ve servisler
            </SectionTitle>
            <div className="grid gap-4 sm:grid-cols-2">
              {services.map((item, i) => (
                <ServiceCard key={item.href} item={item} delay={0.23 + i * 0.06} />
              ))}
            </div>
          </section>

          {upcoming.length > 0 && (
            <section className="mt-14">
              <SectionTitle count={upcoming.length} delay={0.35}>
                Yakında
              </SectionTitle>
              <div className="grid gap-4">
                {upcoming.map((item, i) => (
                  <UpcomingCard key={item.name} item={item} delay={0.41 + i * 0.06} />
                ))}
              </div>
            </section>
          )}

          {/* Yeni kişi eklemek için src/data/site.ts içindeki `people`
              dizisine bir nesne ekle — burada değişiklik gerekmiyor. */}
          <section className="mt-14">
            <SectionTitle count={people.length} delay={0.53}>
              Kişiler
            </SectionTitle>
            <div className="grid gap-4">
              {people.map((person, i) => (
                <PersonSection key={person.name} person={person} delay={0.59 + i * 0.08} />
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  )
}
