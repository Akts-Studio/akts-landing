import { useEffect, useState } from 'react'

/** Yükleme ekranı kapanınca (index.html'deki #boot) bir kez true olur; ağır efektler o zaman, boşta başlar. */
export function useReady(): boolean {
  const [ready, setReady] = useState(() => !document.getElementById('boot'))
  useEffect(() => {
    if (ready) return
    const go = () => {
      const run = () => setReady(true)
      if ('requestIdleCallback' in window) window.requestIdleCallback(run, { timeout: 600 })
      else setTimeout(run, 50)
    }
    document.addEventListener('akts-boot-done', go, { once: true })
    return () => document.removeEventListener('akts-boot-done', go)
  }, [ready])
  return ready
}
