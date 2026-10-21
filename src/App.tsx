import type { CSSProperties } from 'react'
import { AuroraGL } from '@/components/AuroraGL'
import { ClickSpark } from '@/components/ClickSpark'
import { CountUp } from '@/components/CountUp'
import { AppShowcase } from '@/components/AppShowcase'
import { Footer } from '@/components/Footer'
import { LogoDefs } from '@/components/Logos'
import { PersonSection } from '@/components/PersonSection'
import { ServiceCard } from '@/components/ServiceCard'
import { Navbar } from '@/components/Navbar'
import { SpaceBackdrop } from '@/components/SpaceBackdrop'
import { UpcomingCard } from '@/components/UpcomingCard'
import { apps, people, services, upcoming } from '@/data/site'

function SectionTitle({
  children,
  count,
  delay,
  id,
}: {
  children: string
  count: number
  delay: number
  id?: string
}) {
  return (
    <div
      id={id}
      className="title-in mb-5 flex scroll-mt-20 items-center gap-3"
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
      <SpaceBackdrop />
      <LogoDefs />
      <Navbar />

      <div className="mx-auto flex min-h-[calc(100dvh-3.5rem)] w-full max-w-4xl flex-col px-6 sm:px-8">
        <main className="my-auto flex-1 pb-10 pt-8 sm:pt-12">
          <div className="grid items-center gap-6 md:grid-cols-[1fr_minmax(0,300px)]">
          <div>
          <h1
            className="anim max-w-[18ch] text-[clamp(2.25rem,7.5vw,4rem)] font-semibold leading-[1.04] tracking-[-0.045em]"
            style={{ '--d': '.02s' } as CSSProperties}
          >
            Uygulamalar, siteler{' '}
            <span style={{ color: 'var(--brand-accent)' }}>ve servisler.</span>
          </h1>
          <p
            className="anim mt-5 max-w-[50ch] text-[clamp(1rem,2vw,1.15rem)] leading-relaxed text-muted-foreground"
            style={{ '--d': '.09s' } as CSSProperties}
          >
            Akts Studio'nun Android uygulamaları, web siteleri ve kendi sunucusunda çalışan
            servisleri. Hepsi tek çatı altında.
          </p>
          </div>
          <div className="hero-orbit mx-auto aspect-square w-44 sm:w-56 md:w-full" aria-hidden="true">
            <span>A</span>
          </div>
          </div>

          <section className="mt-14">
            <SectionTitle id="uygulamalar" count={apps.length} delay={0.13}>
              Uygulamalar
            </SectionTitle>
            <div className="grid gap-4 md:grid-cols-3">
              {apps.map((app, i) => (
                <AppShowcase key={app.href} app={app} index={i} delay={0.17 + i * 0.06} />
              ))}
            </div>
          </section>

          <section className="mt-14">
            <SectionTitle id="servisler" count={services.length} delay={0.17}>
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
            <SectionTitle id="kisiler" count={people.length} delay={0.53}>
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
