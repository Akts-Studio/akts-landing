import { useEffect, useState, type CSSProperties } from 'react'
import { RimCard } from '@/components/RimCard'
import { LinkRow } from '@/components/LinkRow'
import type { Person } from '@/data/site'
import {
  aktiviteMetni,
  DURUM_ADI,
  DURUM_RENGI,
  gecenSure,
  useDiscord,
  type DiscordVarlik,
} from '@/lib/discord'

/** Saniyede bir tıklayan saat — yalnız aktivite süresi varken. */
function useSimdi(acik: boolean) {
  const [t, setT] = useState(() => Date.now())
  useEffect(() => {
    if (!acik) return
    const id = window.setInterval(() => setT(Date.now()), 1000)
    return () => window.clearInterval(id)
  }, [acik])
  return t
}

/** Kişi kartındaki canlı Discord satırı. Veri yoksa hiç görünmez. */
function Presence({ v }: { v: DiscordVarlik }) {
  const a = v.aktiviteler.find((x) => x.tur !== 'dinliyor')
  const simdi = useSimdi(!!a?.baslangic)
  const ozel = v.ozelDurum?.metin ? `${v.ozelDurum.emoji ? v.ozelDurum.emoji + ' ' : ''}${v.ozelDurum.metin}` : null
  const satir = a
    ? `${aktiviteMetni(a)}${a.baslangic ? ` · ${gecenSure(a.baslangic, simdi)}` : ''}`
    : ozel ?? DURUM_ADI[v.durum]
  const sp = v.spotify
  return (
    <div className="mt-1 min-w-0 space-y-0.5 text-xs text-muted-foreground" aria-live="polite">
      <p className="truncate" title={a?.detay ?? undefined}>{satir}</p>
      {sp?.sarki && (
        <p className="flex min-w-0 items-center gap-1.5">
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" aria-hidden="true">
            <circle cx="12" cy="12" r="12" fill="#1db954" />
            <path d="M6.5 9.5c3.6-1 7.6-.6 11 1.2M7 12.6c3-.8 6.2-.4 9 1M7.6 15.5c2.4-.6 4.8-.3 7 .8" stroke="#000" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          </svg>
          <span className="truncate">{sp.sarki} · {sp.sanatci}</span>
        </p>
      )}
    </div>
  )
}

/** Fotoğraf yoksa ya da yüklenemezse baş harflere düşer. */
function Avatar({ person, v }: { person: Person; v: DiscordVarlik | null }) {
  const [broken, setBroken] = useState(false)
  const showImage = person.avatar && !broken

  return (
    <span
      className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full p-[2px] shadow-[0_6px_20px_rgba(0,0,0,.35)] transition-transform duration-500 group-hover/head:-rotate-6 group-hover/head:scale-105"
      style={{ background: 'linear-gradient(135deg,var(--brand-accent),color-mix(in srgb,var(--brand-accent) 15%,transparent))' }}
    >
      {showImage ? (
        <img
          src={person.avatar}
          alt={person.name}
          width={56}
          height={56}
          decoding="async"
          onError={() => setBroken(true)}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span className="grid h-full w-full place-items-center rounded-full bg-secondary text-sm font-bold tracking-[-0.04em]">
          {person.initials}
        </span>
      )}
      {v && (
        <span
          className="presence-dot"
          style={{ background: DURUM_RENGI[v.durum] }}
          role="img"
          aria-label={`Discord: ${DURUM_ADI[v.durum]}`}
          title={`Discord: ${DURUM_ADI[v.durum]}`}
        />
      )}
    </span>
  )
}

export function PersonSection({ person, delay }: { person: Person; delay: number }) {
  const canli = useDiscord()
  const v = person.discord && canli?.kullanici.id === person.discord ? canli : null
  return (
    <RimCard
      accent="var(--brand-accent)"
      deal
      watermark
      className="mt-4 overflow-hidden p-5 sm:p-6"
      style={{ '--d': `${delay}s` } as CSSProperties}
    >
      {/* Geniş ekranda başlık solda sabit, bağlantılar sağda esner.
          Dar ekranda alt alta düşer — tek kişi varken kartın yarısı
          boş kalmasın diye kart hep tam genişlikte. */}
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
        <div className="group/head flex items-center gap-4 md:w-64 md:shrink-0">
          <Avatar person={person} v={v} />
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-[-0.03em]">{person.name}</h3>
            {person.aka && <p className="text-xs font-medium text-muted-foreground">aka {person.aka}</p>}
            <p className="text-sm leading-snug text-muted-foreground">{person.role}</p>
            {v && <Presence v={v} />}
          </div>
        </div>
        <ul className="min-w-0 flex-1 border-t pt-1 md:border-l md:border-t-0 md:pl-8 md:pt-0"
            style={{ borderColor: 'hsl(var(--hairline))' }}>
          {person.links.map((link, i) => (
            <LinkRow key={link.href} item={{ ...link, accent: 'var(--brand-accent)' }} delay={delay + 0.06 * (i + 1)} />
          ))}
        </ul>
      </div>
    </RimCard>
  )
}
