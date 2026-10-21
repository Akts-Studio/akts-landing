/**
 * React Bits'in Aurora'sının WebGL sürümü (ogl + simplex noise shader).
 *
 * Aurora.tsx (CSS sürümü) SİLİNMEDİ — burası ona düşüyor:
 *   - kullanıcı `prefers-reduced-motion: reduce` diyorsa
 *   - WebGL bağlamı alınamıyorsa (eski cihaz, GPU engellenmiş)
 *   - sekme arka plandayken döngü tamamen duruyor (pil)
 *
 * Sebep [[akts-landing]]'de yazılı: sunucu statik dosya servis ediyor ve
 * sayfa telefonda da ilk saniyede açılmalı. WebGL bunu tek başına
 * bozmuyor ama sürekli çalışan bir rAF döngüsü pil yiyor; fallback şart.
 *
 * Orijinalden farklar:
 *  1. Renkler sabit değil, temanın servis renklerinden okunuyor
 *     (--c-portfolyo / --c-oyun / --c-mailapp) ve tema değişince
 *     yeniden okunuyor. Sabit mor/pembe akts.tr'nin monokrom dilini
 *     bozardı.
 *  2. `useEffect` bağımlılığı orijinalde yalnızca [amplitude]; renk
 *     dizisi değişince yeniden kurulmuyor — biz temayı izliyoruz.
 *  3. Sekme gizliyken rAF iptal ediliyor.
 *  4. `dpr` 2 ile sınırlandı: retina telefonda 3x yüzey ısıtıyor.
 */
import { useEffect, useRef, useState } from 'react'
import { Color, Mesh, Program, Renderer, Triangle } from 'ogl'
import { Aurora as AuroraCSS } from '@/components/Aurora'

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;

out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v){
  const vec4 C = vec4(
      0.211324865405187, 0.366025403784439,
      -0.577350269189626, 0.024390243902439
  );
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);

  vec3 p = permute(
      permute(i.y + vec3(0.0, i1.y, 1.0))
    + i.x + vec3(0.0, i1.x, 1.0)
  );

  vec3 m = max(
      0.5 - vec3(
          dot(x0, x0),
          dot(x12.xy, x12.xy),
          dot(x12.zw, x12.zw)
      ),
      0.0
  );
  m = m * m;
  m = m * m;

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);

  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop {
  vec3 color;
  float position;
};

#define COLOR_RAMP(colors, factor, finalColor) {              \
  int index = 0;                                            \
  for (int i = 0; i < 2; i++) {                               \
     ColorStop currentColor = colors[i];                    \
     bool isInBetween = currentColor.position <= factor;    \
     index = int(mix(float(index), float(i), float(isInBetween))); \
  }                                                         \
  ColorStop currentColor = colors[index];                   \
  ColorStop nextColor = colors[index + 1];                  \
  float range = nextColor.position - currentColor.position; \
  float lerpFactor = (factor - currentColor.position) / range; \
  finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);

  vec3 rampColor;
  COLOR_RAMP(colors, uv.x, rampColor);

  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * 2.0 - height + 0.2);
  float intensity = 0.6 * height;

  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);

  vec3 auroraColor = intensity * rampColor;

  fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
}
`

type Props = {
  amplitude?: number
  blend?: number
  speed?: number
}

/** Temanın servis renklerini CSS'ten okur — sabit renk yazmıyoruz. */
function readStops(): string[] {
  const s = getComputedStyle(document.documentElement)
  const pick = (name: string, fallback: string) =>
    s.getPropertyValue(name).trim() || fallback
  return [
    pick('--aurora-1', '#ff5b4a'),
    pick('--aurora-2', '#ff8a3d'),
    pick('--aurora-3', '#c8281c'),
  ]
}

export function AuroraGL({ amplitude = 1.0, blend = 0.5, speed = 0.4 }: Props) {
  const ctnDom = useRef<HTMLDivElement>(null)
  const propsRef = useRef({ amplitude, blend, speed })
  propsRef.current = { amplitude, blend, speed }

  // Kurulum başarısız olursa CSS sürümüne düşüyoruz.
  const [failed, setFailed] = useState(false)

  // Tema değişince renkleri yeniden okumak için sayaç.
  const [themeTick, setThemeTick] = useState(0)

  const reduced =
    typeof matchMedia === 'function' &&
    matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (reduced) return
    const target = document.documentElement
    const mo = new MutationObserver(() => setThemeTick((t) => t + 1))
    mo.observe(target, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [reduced])

  useEffect(() => {
    if (reduced || failed) return
    const ctn = ctnDom.current
    if (!ctn) return

    let renderer: Renderer
    try {
      renderer = new Renderer({
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        dpr: 1,
      })
    } catch {
      setFailed(true)
      return
    }

    const gl = renderer.gl
    if (!gl) {
      setFailed(true)
      return
    }

    gl.clearColor(0, 0, 0, 0)
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.canvas.style.backgroundColor = 'transparent'
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    gl.canvas.style.display = 'block'

    const geometry = new Triangle(gl)
    // Triangle'ın uv'si bu shader'da kullanılmıyor; bırakılırsa
    // gereksiz attribute uyarısı üretiyor.
    if (geometry.attributes.uv) delete geometry.attributes.uv

    const toRGB = (hex: string) => {
      const c = new Color(hex)
      return [c.r, c.g, c.b]
    }

    const program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: readStops().map(toRGB) },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
      },
    })

    const mesh = new Mesh(gl, { geometry, program })
    ctn.appendChild(gl.canvas)

    function resize() {
      if (!ctn) return
      renderer.setSize(ctn.offsetWidth, ctn.offsetHeight)
      program.uniforms.uResolution.value = [ctn.offsetWidth, ctn.offsetHeight]
    }
    // Orijinal yalnızca window resize dinliyor; kutu telefonda adres
    // çubuğu gizlenince de boyut değiştiriyor, ResizeObserver bunu yakalar.
    const ro = new ResizeObserver(resize)
    ro.observe(ctn)
    resize()

    let raf = 0
    let son = 0
    const update = (t: number) => {
      raf = requestAnimationFrame(update)
      // Yumuşak degrade: 30 kare/sn yeter, GPU/CPU yarıya iner.
      if (t - son < 30) return
      son = t
      const p = propsRef.current
      program.uniforms.uTime.value = t * 0.001 * p.speed
      program.uniforms.uAmplitude.value = p.amplitude
      program.uniforms.uBlend.value = p.blend
      renderer.render({ scene: mesh })
    }

    // Sekme gizliyken çizmenin anlamı yok — pil.
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf)
        raf = 0
      } else if (!raf) {
        raf = requestAnimationFrame(update)
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    raf = requestAnimationFrame(update)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVisibility)
      ro.disconnect()
      if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }, [reduced, failed, amplitude, blend, themeTick])

  if (reduced || failed) return <AuroraCSS />

  return (
    <div
      ref={ctnDom}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[62vh] opacity-[var(--aurora-strength)] [mask-image:linear-gradient(to_bottom,#000_30%,transparent_100%)]"
    />
  )
}
