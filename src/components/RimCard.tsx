import { useCallback, useEffect, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  /** kartın rengi — CSS değeri, örn. "var(--c-oyun)"; --brand olarak yazılır */
  accent?: string
  style?: CSSProperties
}

/**
 * Kart sahnesi. Katmanlar (hepsi ayrı span):
 *   .rim   — alt-orta kenardan yayılan --brand ışıklı 1px çerçeve
 *   .arc   — imlecin açısını izleyen konik ark
 *   .glare — imleci izleyen iç ışık
 *   .sheen — hover'da bir kez geçen çapraz parıltı
 * İmleç verisi CSS değişkeni olarak yazılıyor (React state değil) ve
 * pointermove karede en fazla bir kez, rAF içinde işleniyor.
 */
export function RimCard({ children, className, accent, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const raf = useRef(0)
  const pos = useRef({ x: 0, y: 0 })

  const flush = useCallback(() => {
    raf.current = 0
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = pos.current.x - r.left
    const y = pos.current.y - r.top
    const angle = (Math.atan2(y - r.height / 2, x - r.width / 2) * 180) / Math.PI + 90
    el.style.setProperty('--mx', `${x}px`)
    el.style.setProperty('--my', `${y}px`)
    el.style.setProperty('--angle', `${angle}deg`)
  }, [])

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType !== 'mouse') return
      pos.current = { x: e.clientX, y: e.clientY }
      if (!raf.current) raf.current = requestAnimationFrame(flush)
    },
    [flush],
  )

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      className={cn('rim-card', className)}
      style={{ ...style, ...(accent ? ({ '--brand': accent } as CSSProperties) : null) }}
    >
      <span className="rim-card__rim" aria-hidden="true" />
      <span className="rim-card__arc" aria-hidden="true" />
      <span className="rim-card__glare" aria-hidden="true" />
      <span className="rim-card__sheen" aria-hidden="true" />
      {children}
    </div>
  )
}
