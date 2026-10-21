import { useEffect, useState } from 'react'

/* Discord varlık API sözleşmesi (bot sağlar, siteler tüketir).
   GET https://akts.tr/api/discord — ayrıntı ortak planda. */

export type DiscordDurum = 'online' | 'idle' | 'dnd' | 'offline'
export type AktiviteTuru = 'oynuyor' | 'dinliyor' | 'izliyor' | 'yayinda' | 'yarisiyor'

export type DiscordAktivite = {
  tur: AktiviteTuru
  ad: string
  detay?: string | null
  durum?: string | null
  buyukResim?: string | null
  kucukResim?: string | null
  baslangic?: number | null
  bitis?: number | null
}

export type DiscordVarlik = {
  ok: boolean
  guncellendi: string
  kullanici: {
    id: string
    kullaniciAdi: string
    gorunenAd: string
    avatar: string | null
    banner?: string | null
    bannerRengi?: string | null
    dekorasyon?: string | null
  }
  durum: DiscordDurum
  platform?: { masaustu: DiscordDurum | null; mobil: DiscordDurum | null; web: DiscordDurum | null }
  ozelDurum?: { metin: string | null; emoji: string | null } | null
  aktiviteler: DiscordAktivite[]
  spotify?: {
    sarki: string
    sanatci: string
    album: string
    kapak: string | null
    baslangic: number
    bitis: number
  } | null
  bio?: string | null
  sunucu?: { ad: string; davet: string | null; uyeSayisi: number; cevrimici: number } | null
}

export const DISCORD_ID = '1507392064206278919'
export const DISCORD_PROFIL = `https://discord.com/users/${DISCORD_ID}`
export const DURUM_RENGI: Record<DiscordDurum, string> = {
  online: '#23a55a',
  idle: '#f0b232',
  dnd: '#f23f43',
  offline: '#80848e',
}
export const DURUM_ADI: Record<DiscordDurum, string> = {
  online: 'Çevrimiçi',
  idle: 'Boşta',
  dnd: 'Rahatsız etmeyin',
  offline: 'Çevrimdışı',
}

const API = 'https://akts.tr/api/discord'
const ORNEK = '/discord-ornek.json'
const ARALIK = 30_000

function kaynak() {
  try {
    if (new URLSearchParams(location.search).get('discord') === 'ornek') return ORNEK
  } catch {
    /* yoksay */
  }
  return API
}

function gecerli(v: unknown): v is DiscordVarlik {
  const d = v as DiscordVarlik
  return !!d && d.ok === true && typeof d.durum === 'string' && !!d.kullanici && Array.isArray(d.aktiviteler)
}

/* Tek ortak yoklayıcı: navbar ve kişi kartı aynı veriyi paylaşır. */
let son: DiscordVarlik | null = null
const dinleyiciler = new Set<(v: DiscordVarlik | null) => void>()
let zamanlayici: number | undefined

async function yokla() {
  if (document.visibilityState === 'hidden') return
  try {
    const ctl = new AbortController()
    const t = setTimeout(() => ctl.abort(), 8000)
    const r = await fetch(kaynak(), { signal: ctl.signal, cache: 'no-store' })
    clearTimeout(t)
    if (!r.ok) throw new Error(String(r.status))
    const v: unknown = await r.json()
    if (!gecerli(v)) throw new Error('biçim')
    son = v
    dinleyiciler.forEach((f) => f(son))
  } catch {
    /* hata: son başarılı veri kalır; hiç yoksa kart statik */
  }
}

function basla() {
  if (zamanlayici !== undefined) return
  void yokla()
  zamanlayici = window.setInterval(yokla, ARALIK)
  document.addEventListener('visibilitychange', yokla)
}
function dur() {
  window.clearInterval(zamanlayici)
  zamanlayici = undefined
  document.removeEventListener('visibilitychange', yokla)
}

export function useDiscord(): DiscordVarlik | null {
  const [v, setV] = useState<DiscordVarlik | null>(son)
  useEffect(() => {
    dinleyiciler.add(setV)
    basla()
    return () => {
      dinleyiciler.delete(setV)
      if (dinleyiciler.size === 0) dur()
    }
  }, [])
  return v
}

/** "VS Code'da · 12:31" — başlangıçtan bu yana geçen süre (dk:sn ya da sa:dk). */
export function gecenSure(baslangic: number, simdi = Date.now()) {
  const s = Math.max(0, Math.floor((simdi - baslangic) / 1000))
  const sa = Math.floor(s / 3600)
  const dk = Math.floor((s % 3600) / 60)
  const sn = s % 60
  const p = (n: number) => String(n).padStart(2, '0')
  return sa > 0 ? `${sa}:${p(dk)}:${p(sn)}` : `${p(dk)}:${p(sn)}`
}

const EK: Record<AktiviteTuru, string> = {
  oynuyor: "'da",
  dinliyor: ' dinliyor',
  izliyor: ' izliyor',
  yayinda: ' yayında',
  yarisiyor: "'da yarışıyor",
}
const KISA: Record<string, string> = { 'Visual Studio Code': 'VS Code' }

export function aktiviteMetni(a: DiscordAktivite) {
  const ad = KISA[a.ad] ?? a.ad
  return a.tur === 'oynuyor' ? `${ad}'da` : `${ad}${EK[a.tur] ?? ''}`
}
