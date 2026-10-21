import type { CSSProperties } from 'react'
import { GlowCard } from '@/components/GlowCard'
import { Logo } from '@/components/Logos'
import type { Upcoming } from '@/data/site'

/**
 * Henüz açılmamış bir işin kartı. `ServiceCard`'ın geniş biçimine benziyor
 * ama bağlantı DEĞİL: gidecek yer yok, o yüzden <a> yerine <div> ve imleç
 * de değişmiyor. Etiketin yanındaki nokta nefes alıyor — işin durduğunu
 * değil sürdüğünü anlatan tek hareket.
 */
export function UpcomingCard({ item, delay }: { item: Upcoming; delay: number }) {
  return (
    <div className="anim group block rounded-[var(--radius)]" style={{ '--d': `${delay}s` } as CSSProperties}>
      <GlowCard accent={item.accent} className="flex h-full items-center gap-5 p-5 sm:gap-6 sm:p-6">
        <span
          className="grid h-14 w-14 shrink-0 place-items-center rounded-xl border"
          style={{
            background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
            borderColor: 'color-mix(in srgb, var(--brand) 22%, transparent)',
            color: 'var(--brand)',
          }}
        >
          <Logo name={item.icon} className="h-8 w-8" />
        </span>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold tracking-[-0.02em]">{item.name}</span>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
              style={{
                color: 'var(--brand)',
                background: 'color-mix(in srgb, var(--brand) 14%, transparent)',
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full motion-safe:animate-breathe"
                style={{ background: 'var(--brand)', animationDuration: '4s' }}
                aria-hidden="true"
              />
              {item.status}
            </span>
          </div>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.desc}</p>
        </div>

        {/* Dar ekranda açıklamayı sıkıştırıyor; rozet zaten aynı şeyi söylüyor. */}
        <span className="hidden shrink-0 text-xs text-dim sm:block">yakında</span>
      </GlowCard>
    </div>
  )
}
