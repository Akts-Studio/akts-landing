import { useCallback, useRef, type CSSProperties, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = {
  children: ReactNode
  className?: string
  /** kartın parıltı rengi — CSS değeri, örn. "var(--c-oyun)" */
  accent?: string
  style?: CSSProperties
}

/**
 * İmleci takip eden kenar parıltısı. Konum CSS değişkeni olarak
 * yazılıyor (React state DEĞİL) — her mousemove'da yeniden render
 * olsaydı üç kartlı bir sayfada bile gözle görülür takılma olurdu.
 * Görünürlüğü açan --glow, imleç dışarı çıkınca 0'a dönüyor.
 */
export function GlowCard({ children, className, accent, style }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
    el.style.setProperty('--glow', '1')
  }, [])

  const onLeave = useCallback(() => {
    ref.current?.style.setProperty('--glow', '0')
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn('glow-card', className)}
      style={{ ...style, ...(accent ? ({ '--brand': accent } as CSSProperties) : null) }}
    >
      {children}
    </div>
  )
}
