import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * 3D yuvaları. Prosedürel WebGL modülü (`akts-3d.js`) ayrı yazılıyor;
 * API: mountCube(canvas, opts) / mountMoon(canvas, opts) → { destroy() }.
 * Modül gelene kadar CSS yedeği (cam kare / gri disk) görünür, yer ve
 * boyut sabit — modül bağlanınca CLS olmaz.
 *
 * Modül src/lib/akts-3d.js'e kopyalandı ve bağlı (AKTS3D-BAGLA). Ayrı
 * parça olarak tembel yükleniyor; ilk boyamayı geciktirmiyor.
 * Reduced-motion'u modül kendisi yönetiyor (tek kare çizip duruyor).
 */
// AKTS3D-BAGLA (açık)
const loadModule = () => import('@/lib/akts-3d.js')

type Mounted = { destroy(): void }
type Akts3D = {
  mountCube?: (c: HTMLCanvasElement, o?: Record<string, unknown>) => Mounted
  mountMoon?: (c: HTMLCanvasElement, o?: Record<string, unknown>) => Mounted
}

async function load(): Promise<Akts3D | null> {
  return (await loadModule()) as Akts3D
}

function use3D(kind: 'kup' | 'ay', opts?: Record<string, unknown>) {
  const ref = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    let mounted: Mounted | null = null
    let dead = false
    load()
      .then((m) => {
        if (dead || !m) return
        const fn = kind === 'kup' ? m.mountCube : m.mountMoon
        if (!fn) return
        mounted = fn(canvas, opts)
        setReady(!canvas.hasAttribute('data-akts3d-fallback'))
      })
      .catch(() => {
        /* modül yoksa CSS yedeği kalır */
      })
    return () => {
      dead = true
      mounted?.destroy()
    }
    // opts bilerek bağımlılık değil: yuva bir kez kurulur
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind])

  return { ref, ready }
}

/** Hero'daki sürüklenebilir cam küp yuvası. */
export function Hero3D({ className }: { className?: string }) {
  const { ref, ready } = use3D('kup', { glyph: 'A' })
  return (
    <div className={cn('akts3d-slot', className)} data-ready={ready} aria-hidden="true">
      <div className="akts3d-fallback">
        <span className="cube-css" />
      </div>
      <canvas ref={ref} data-akts3d="kup" />
    </div>
  )
}

function Moon({ corner }: { corner: 'tl' | 'br' }) {
  const { ref, ready } = use3D('ay', { seed: corner === 'tl' ? 3 : 11 })
  return (
    <div className={`akts3d-slot moon-corner moon-corner--${corner}`} data-ready={ready} aria-hidden="true">
      <div className="akts3d-fallback" />
      <canvas ref={ref} data-akts3d="ay" />
    </div>
  )
}

/** Köşelerdeki ay kayaları (maskeyle kenarlarına doğru solar). */
export function MoonCorners() {
  return (
    <>
      <Moon corner="tl" />
      <Moon corner="br" />
    </>
  )
}
