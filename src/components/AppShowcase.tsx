import type { CSSProperties } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { Logo } from '@/components/Logos'
import type { App } from '@/data/site'

/* Üç telefon yan yana dümdüz durunca katalog gibi görünüyordu.
   Kenardakiler hafifçe dışa, ortadaki düz: birlikte bir yelpaze.
   Hover'da hepsi düzelip yukarı kalkıyor. */
const TILT = ['-5deg', '0deg', '5deg']

/** Uygulama vitrini: üstte uygulamanın kendi renginde panel ve alttan taşan telefon, altta künye. */
export function AppShowcase({ app, delay, index }: { app: App; delay: number; index: number }) {
  return (
    <a
      href={app.href}
      className="anim group flex h-full flex-col overflow-hidden rounded-[var(--radius)] border bg-card shadow-[inset_0_1px_#ffffff0d] transition-[border-color,transform] duration-500 [transition-timing-function:cubic-bezier(.22,1,.36,1)] hover:-translate-y-1.5 hover:border-foreground/20"
      style={{ '--d': `${delay}s`, '--tilt': TILT[index % 3] } as CSSProperties}
    >
      <div className="relative h-60 overflow-hidden" style={{ background: app.tint }}>
        {/* Panelin altına doğru erime: telefon kesik değil, içeri gömülü görünsün. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/35 to-transparent"
        />
        <div className="absolute left-1/2 top-8 w-[150px] -translate-x-1/2 rotate-[var(--tilt)] rounded-[28px] bg-[linear-gradient(90deg,#8d9591,#eef2ef_6%,#b9c1bd_12%,#6f7773_50%,#b9c1bd_88%,#eef2ef_94%,#8d9591)] p-[3px] shadow-[0_30px_60px_-18px_rgba(0,0,0,.65)] transition-transform duration-700 [transition-timing-function:cubic-bezier(.34,1.32,.44,1)] group-hover:-translate-y-3 group-hover:rotate-0 motion-reduce:transition-none">
          <div className="relative rounded-[25px] bg-[#050807] p-[5px]">
            <img
              src={app.shot}
              alt={`${app.name} ekranı`}
              loading="lazy"
              className="block w-full rounded-[20px]"
            />
            <span className="absolute left-1/2 top-[12px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-black ring-2 ring-[#0d1110]" />
          </div>
        </div>
        <span className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-transform duration-500 group-hover:rotate-45">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>

      <div className="flex flex-1 flex-col border-t p-5">
        <div className="flex items-center gap-3">
          <Logo name={app.icon} className="h-10 w-10 shrink-0" />
          <div className="min-w-0">
            <span className="block text-[17px] font-semibold leading-tight tracking-[-0.02em]">{app.name}</span>
            <span className="block truncate text-[13px] text-muted-foreground">{app.tagline}</span>
          </div>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-foreground/80">{app.desc}</p>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {app.tags.map((t) => (
            <span key={t} className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
