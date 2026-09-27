import type { LogoName } from '@/data/site'

/**
 * Logolar eski index.html'deki <defs> bloğundan olduğu gibi taşındı.
 * <use> ile referans verildiği için her satırda SVG tekrar etmiyor.
 *
 * Aktaş Mail : kendi markamız (degrade karo + iki tonlu A)
 * OyunHub    : sitenin favicon'undaki şimşek (blur filtreleri atıldı)
 * n8n        : n8n'in düğüm-grafik markası, marka rengi #ea4b71
 * MehtApp, StudyTrack: uygulamaların kendi ikonları
 * kod/zarf   : tek renk glif — satırın accent rengini alır
 */
export function LogoDefs() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <defs>
        <linearGradient id="g-mail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b9bff" />
          <stop offset="1" stopColor="#1558d6" />
        </linearGradient>

        <g id="i-mail">
          <rect x="2" y="2" width="44" height="44" rx="12" fill="url(#g-mail)" />
          <path d="M24 13 L34 34" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M24 13 L14 34" stroke="#fff" strokeWidth="4.4" strokeLinecap="round" />
          <path d="M18.4 27.5 H29.6" stroke="#c2e7ff" strokeWidth="4.4" strokeLinecap="round" />
        </g>

        {/* OyunHub — sitenin kendi karosu: turuncu zemin, oyun kolu. */}
        <g id="i-oyun">
          <rect x="2" y="2" width="44" height="44" rx="12" fill="#ff4d1f" />
          <path transform="translate(9.2 9.2) scale(1.235)" d="M6 11h4 M8 9v4 M15 12h.01 M18 10h.01 M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z" fill="none" stroke="#140a05" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        <g id="i-n8n" stroke="#ea4b71" strokeWidth="3.6" strokeLinecap="round" fill="#ea4b71">
          <path d="M11 24 H22" fill="none" />
          <path d="M26 24 H32 L37 15" fill="none" />
          <path d="M26 24 H32 L37 33" fill="none" />
          <circle cx="8" cy="24" r="5" stroke="none" />
          <circle cx="24" cy="24" r="6.5" stroke="none" />
          <circle cx="40" cy="13" r="5" stroke="none" />
          <circle cx="40" cy="35" r="5" stroke="none" />
        </g>

        <g
          id="i-kod"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M17 16 L8 24 L17 32" />
          <path d="M31 16 L40 24 L31 32" />
        </g>

        {/* GitHub markası — tek yol, currentColor ile satırın rengini alır.
            48'lik viewBox'a otursun diye 16'lık orijinal yol 3x ölçeklendi. */}
        <g id="i-github" fill="currentColor">
          <path
            transform="scale(3)"
            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
          />
        </g>

        <g
          id="i-zarf"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="11" width="36" height="26" rx="4" />
          <path d="M7 14 L24 26 L41 14" />
        </g>

        {/* MehtApp — uygulamanın kendi ikonu: kubbe, hilâlli alem ve arkada
            silik ay. Yollar Android ikonundan (108'lik tuval) alındı. */}
        <g id="i-ezan">
          <rect x="2" y="2" width="44" height="44" rx="12" fill="#0b3b2e" />
          <g transform="translate(2 2) scale(.4074) translate(54 54) scale(1.08) translate(-54 -53)">
            <circle cx="72" cy="36" r="16" fill="#fff" fillOpacity=".08" /><path fill="#ecc862" d="M26,84 V70 A28,28 0 0,1 82,70 V84 Z" /><rect x="22" y="82" width="64" height="6" rx="3" fill="#ecc862" /><path d="M54,42 V30" stroke="#f0ce72" strokeWidth="3" strokeLinecap="round" /><path fill="#f0ce72" d="M60.61,26.30 A7,7 0 1,1 54.42,17.01 A5.60,5.60 0 0,0 60.61,26.30 Z" />
          </g>
        </g>

        {/* BlankReel — sitenin kendi işareti; karo koyu, çünkü beyaz
            karo açık temada kartın zeminine karışıyordu. */}
        <g id="i-blankreel">
          <rect x="2" y="2" width="44" height="44" rx="12" fill="#0a0a0a" />
          <path
            transform="translate(10.35 11.95) scale(.1096)"
            fill="#fff"
            fillRule="evenodd"
            d="M12 2 L21 2 L107 25 L109 27 L109 52 L111 54 L182 36 L231 21 L237 21 L243 24 L247 32 L247 205 L245 211 L236 217 L147 217 L144 215 L144 188 L140 183 L90 199 L27 216 L15 218 L5 213 L2 205 L2 15 L4 8 L11 3 Z M85 51 L92 53 L191 110 L196 113 L197 117 L94 180 L85 183 L83 181 L84 52 Z"
          />
        </g>

        {/* StudyTrack — uygulamanın kendi ikonu (açık kitap + onay), zemini
            ikonla aynı renk. */}
        <clipPath id="c-study">
          <rect x="2" y="2" width="44" height="44" rx="12" />
        </clipPath>
        <g id="i-study">
          <image href="/assets/studytrack.png" x="2" y="2" width="44" height="44" clipPath="url(#c-study)" />
        </g>
      </defs>
    </svg>
  )
}

export function Logo({ name, className }: { name: LogoName; className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  )
}
