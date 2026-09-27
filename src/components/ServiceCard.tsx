import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { GlowCard } from '@/components/GlowCard'
import { Logo } from '@/components/Logos'
import { cn } from '@/lib/utils'
import type { Link } from '@/data/site'

/**
 * İki biçim var:
 *  - normal : dikey kart, ızgarada bir hücre
 *  - wide   : öne çıkan servis, satırın tamamını kaplayan yatay kart
 * Hiyerarşi buradan geliyor — Aktaş Mail alan adının vitrini, öbür
 * ikisi yanında duran servisler.
 */
const APP_ICONS = new Set(['oyun', 'ezan', 'study', 'blankreel'])

export function ServiceCard({ item, delay }: { item: Link; delay: number }) {
  const wide = !!item.featured

  return (
    <a
      href={item.href}
      className={cn(
        'anim group block rounded-[var(--radius)]',
        wide && 'sm:col-span-2',
      )}
      style={{ '--d': `${delay}s` } as CSSProperties}
    >
      <GlowCard
        accent={item.accent}
        className={cn(
          'h-full p-5 sm:p-6',
          wide ? 'flex items-center gap-5 sm:gap-6' : 'flex flex-col gap-4',
        )}
      >
        {wide && <span className="featured-halo" aria-hidden="true" />}

        {/* Logo kendi karosunda: markanın renginden çok soluk bir zemin
            alıyor, böylece monokrom kartta renk noktası oluyor. */}
        {APP_ICONS.has(item.icon) ? (
          // Uygulama ikonu kendi karosuyla geliyor; ikinci bir çerçeve onu sıkıştırıyordu.
          <Logo
            name={item.icon}
            className={cn(
              'shrink-0 drop-shadow-sm transition-transform duration-500 group-hover:scale-105',
              wide ? 'h-14 w-14' : 'h-12 w-12',
            )}
          />
        ) : (
          <span
            className={cn(
              'grid shrink-0 place-items-center rounded-xl border transition-transform duration-500 group-hover:scale-105',
              wide ? 'h-14 w-14' : 'h-12 w-12',
            )}
            style={{
              background: 'color-mix(in srgb, var(--brand) 12%, transparent)',
              borderColor: 'color-mix(in srgb, var(--brand) 22%, transparent)',
            }}
          >
            <Logo
              name={item.icon}
              className={cn(wide ? 'h-8 w-8' : 'h-7 w-7', wide && 'pulse-glow')}
            />
          </span>
        )}

        <div className={cn('min-w-0', wide && 'flex-1')}>
          <div className="flex items-center gap-2">
            <span className={cn('font-semibold tracking-[-0.02em]', wide && 'text-lg')}>
              {item.name}
            </span>
            {wide && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.08em]"
                style={{
                  color: 'var(--brand)',
                  background: 'color-mix(in srgb, var(--brand) 14%, transparent)',
                }}
              >
                Öne çıkan
              </span>
            )}
          </div>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{item.desc}</p>
        </div>

        <ArrowUpRight
          className={cn(
            'h-4 w-4 shrink-0 text-dim transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground',
            !wide && 'absolute right-5 top-5 sm:right-6 sm:top-6',
          )}
        />
      </GlowCard>
    </a>
  )
}
