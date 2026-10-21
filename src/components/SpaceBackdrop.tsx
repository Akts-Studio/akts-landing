import { useEffect } from 'react'

/**
 * Uzay zemini: iki katman SVG yıldız dokusu (300px uzak / 480px yakın,
 * kaydırmada farklı hızla akar) + feTurbulence grain. Dokular burada
 * tohumlu rastgeleyle üretiliyor — dosya yok, istek yok.
 * Paralaks yalnızca --scroll değişkeni; reduced-motion'da CSS kapatıyor.
 */
function stars(size: number, count: number, seed: number, maxR: number) {
  let s = seed
  const rnd = () => ((s = (s * 16807) % 2147483647) / 2147483647)
  let c = ''
  for (let i = 0; i < count; i++) {
    const r = (0.3 + rnd() * maxR).toFixed(2)
    const o = (0.35 + rnd() * 0.65).toFixed(2)
    c += `<circle cx='${(rnd() * size).toFixed(1)}' cy='${(rnd() * size).toFixed(1)}' r='${r}' fill='%23fff' fill-opacity='${o}'/>`
  }
  return `url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${c}</svg>")`
}

const FAR = stars(300, 46, 7, 0.6)
const NEAR = stars(480, 22, 131, 1.1)
const GRAIN =
  "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

export function SpaceBackdrop() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const root = document.documentElement
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        root.style.setProperty('--scroll', String(Math.round(window.scrollY)))
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div aria-hidden="true" className="space-layer space-far" style={{ backgroundImage: FAR }} />
      <div aria-hidden="true" className="space-layer space-near" style={{ backgroundImage: NEAR }} />
      <div aria-hidden="true" className="space-grain" style={{ backgroundImage: GRAIN }} />
    </>
  )
}
