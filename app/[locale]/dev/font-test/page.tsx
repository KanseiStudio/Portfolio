import { Container } from "@/components/atoms/Container"

export default function FontTestPage() {
  return (
    <main>
      <Container className="py-16">
        <h1 className="font-display text-4xl mb-12">Font test — N27</h1>

        <div className="space-y-16">
          {/* SEZIONE 1: N27 tutti i pesi */}
          <section>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
              N27 — Tutti i pesi (normal)
            </p>
            <div className="space-y-3">
              <p className="font-n27 font-thin text-2xl">100 Thin — Kansei Studio · The quick brown fox</p>
              <p className="font-n27 font-extralight text-2xl">200 ExtraLight — Kansei Studio · The quick brown fox</p>
              <p className="font-n27 font-light text-2xl">300 Light — Kansei Studio · The quick brown fox</p>
              <p className="font-n27 font-normal text-2xl">400 Regular — Kansei Studio · The quick brown fox</p>
              <p className="font-n27 font-medium text-2xl">500 Medium — Kansei Studio · The quick brown fox</p>
              <p className="font-n27 font-bold text-2xl">700 Bold — Kansei Studio · The quick brown fox</p>
            </div>
          </section>

          {/* SEZIONE 2: N27 italic */}
          <section>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
              N27 — Italic
            </p>
            <div className="space-y-3">
              <p className="font-n27 font-thin italic text-2xl">100 Thin Italic — Kansei Studio</p>
              <p className="font-n27 font-extralight italic text-2xl">200 ExtraLight Italic — Kansei Studio</p>
              <p className="font-n27 font-light italic text-2xl">300 Light Italic — Kansei Studio</p>
              <p className="font-n27 font-normal italic text-2xl">400 Regular Italic — Kansei Studio</p>
              <p className="font-n27 font-medium italic text-2xl">500 Medium Italic — Kansei Studio</p>
              <p className="font-n27 font-bold italic text-2xl">700 Bold Italic — Kansei Studio</p>
            </div>
          </section>

          {/* SEZIONE 3: N27 in size grandi (per title hero) */}
          <section>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
              N27 — Display sizes
            </p>
            <div className="space-y-6">
              <p className="font-n27 font-bold text-8xl leading-none">KANSEI STUDIO</p>
              <p className="font-n27 font-bold text-6xl leading-none">KANSEI STUDIO</p>
              <p className="font-n27 font-medium text-4xl leading-tight">Kansei Studio</p>
              <p className="font-n27 font-light text-3xl leading-tight">Kansei Studio</p>
            </div>
          </section>

          {/* SEZIONE 4: Confronto con altri font */}
          <section>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
              Confronto con altri font del progetto
            </p>
            <div className="space-y-4">
              <p className="font-display text-4xl">Fraunces — Kansei Studio</p>
              <p className="font-body text-4xl">Geist Sans — Kansei Studio</p>
              <p className="font-mono text-4xl">Geist Mono — Kansei Studio</p>
              <p className="font-n27 font-bold text-4xl">N27 Bold — KANSEI STUDIO</p>
            </div>
          </section>

          {/* SEZIONE 5: Body copy in N27 */}
          <section>
            <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-6">
              N27 — Body copy
            </p>
            <p className="font-n27 font-normal text-base leading-relaxed max-w-2xl">
              Kansei Studio crea sistemi digitali sensoriali che connettono la
              tecnologia con l&apos;emozione umana. Progettiamo interfacce immersive,
              esperienze intelligenti e installazioni interattive che rispondono,
              si adattano e risuonano.
            </p>
          </section>
        </div>
      </Container>
    </main>
  )
}
