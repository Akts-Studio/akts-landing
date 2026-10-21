import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  /** kartın rengi — CSS değeri, örn. "var(--c-oyun)"; --brand olarak yazılır */
  accent?: string
  style?: CSSProperties
  /** kartın içinde büyük, soluk filigran logo */
  watermark?: boolean
  /** dağıtılma girişi (kart masaya atılır gibi) + rim ateşleme */
  deal?: boolean
}

/**
 * Kart sahnesi. Katmanlar (hepsi ayrı span — ::before/::after'a
 * güvenmiyoruz, çakışma geçmişi var):
 *   .rim   — alt-orta kenardan yayılan --brand ışıklı 1px çerçeve
 *   .arc   — imlecin açısını izleyen konik ark (eski kenar parıltısının yerine)
 *   .glare — imleci izleyen iç ışık (screen)
 *   .sheen — hover'da bir kez geçen çapraz parıltı
 * İmleç verisi CSS değişkeni olarak yazılıyor (React state değil).
 */
export function RimCard({ children, className, accent, style, watermark, deal }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    const angle = (Math.atan2(y - r.height / 2, x - r.width / 2) * 180) / Math.PI + 90
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.setProperty('--angle', `${angle}deg`)
  }, [])

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn('rim-card', deal && 'deal', className)}
      style={{ ...style, ...(accent ? ({ '--brand': accent } as CSSProperties) : null) }}
    >
      <span className="rim-card__rim" aria-hidden="true" />
      <span className="rim-card__arc" aria-hidden="true" />
      <span className="rim-card__glare" aria-hidden="true" />
      <span className="rim-card__sheen" aria-hidden="true" />
      {watermark && (
        <img className="rim-card__mark" src="/brand/akts-studio-isaret.svg" alt="" aria-hidden="true" />
      )}
      {children}
    </div>
  )
}
