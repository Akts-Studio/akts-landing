/**
 * Gizlilik sayfası. akts.tr alan adının KANONİK gizlilik metni —
 * eymen.akts.tr buraya bağlanıyor.
 *
 * İçeriğin tamamı src/data/legal.ts'ten geliyor; burada yalnızca
 * biçim var. Metni değiştirmek için bu dosyaya değil legal.ts'e bak.
 */
import type { CSSProperties } from 'react'
import { legal, privacySections, siteNotes } from '@/data/legal'
import { PageShell } from '@/components/PageShell'

/** 2026-08-27 → "27 Ağustos 2026" */
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function Gizlilik() {
  return (
    <PageShell>
      <article className="pb-10 pt-6 sm:pt-10">
        <header>
          <h1
            className="anim text-[clamp(2rem,6vw,3rem)] font-semibold leading-[1.06] tracking-[-0.04em]"
            style={{ '--d': '.02s' } as CSSProperties}
          >
            Gizlilik
          </h1>
          <p
            className="anim mt-4 max-w-[52ch] text-[15px] leading-relaxed text-muted-foreground"
            style={{ '--d': '.08s' } as CSSProperties}
          >
            {legal.controller.scope} için geçerlidir. Son güncelleme{' '}
            <time dateTime={legal.updated}>{formatDate(legal.updated)}</time>.
          </p>
        </header>

        <div className="mt-12 space-y-11">
          {privacySections.map((section, i) => (
            <section
              key={section.heading}
              className="anim scroll-mt-24"
              style={{ '--d': `${0.14 + i * 0.03}s` } as CSSProperties}
            >
              <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-dim">
                {section.heading}
              </h2>

              {section.callout && (
                <p
                  className="mt-4 rounded-[var(--radius)] border p-5 text-[15px] leading-relaxed"
                  style={{ borderColor: 'hsl(var(--hairline-hi))' }}
                >
                  {section.callout}
                </p>
              )}

              {section.body?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-4 max-w-[64ch] text-[15px] leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-4 max-w-[64ch] space-y-2.5">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 40)}
                      className="flex gap-3 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-[0.65em] h-1 w-1 shrink-0 rounded-full"
                        style={{ background: 'hsl(var(--dim))' }}
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          {/* Site başına ne saklandığı — bu tablo kodun kendisinden
              (localStorage anahtarları) çıkarıldı, tahminle değil. */}
          <section className="anim" style={{ '--d': '.5s' } as CSSProperties}>
            <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-dim">
              Site site ne saklanıyor
            </h2>
            <div className="mt-5 space-y-4">
              {siteNotes.map((note) => (
                <div
                  key={note.host}
                  className="rounded-[var(--radius)] border p-5"
                  style={{ borderColor: 'hsl(var(--hairline))' }}
                >
                  <h3 className="text-[15px] font-medium">{note.site}</h3>
                  <p className="mt-0.5 text-[13px] text-dim">{note.host}</p>
                  <dl className="mt-4 space-y-2">
                    {note.items.map((item) => (
                      <div key={item.key} className="flex flex-wrap gap-x-3 gap-y-1">
                        <dt className="font-mono text-[13px] text-foreground">{item.key}</dt>
                        <dd className="text-[13px] text-muted-foreground">{item.what}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        </div>
      </article>
    </PageShell>
  )
}
