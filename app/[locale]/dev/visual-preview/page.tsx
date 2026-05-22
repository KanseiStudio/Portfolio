import { Container } from "@/components/atoms/Container"
import { HairlineDivider } from "@/components/atoms/HairlineDivider"
import { TopNav } from "@/components/molecules/TopNav"
import { TreeVisualDemo } from "@/components/visuals-demo/TreeVisualDemo"
import { ShellVisualDemo } from "@/components/visuals-demo/ShellVisualDemo"
import { WaveVisualDemo } from "@/components/visuals-demo/WaveVisualDemo"

export default function VisualPreviewPage() {
  return (
    <main>
      <TopNav />
      <HairlineDivider />

      <Container className="py-16 lg:py-24">
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60">
          Visual preview · /dev
        </p>
        <h1 className="mt-4 font-display text-5xl lg:text-6xl leading-tight">
          Generative visual demo.
        </h1>
        <p className="mt-6 text-base opacity-80 max-w-xl leading-relaxed">
          Esempi di SVG animati in stile plotter / Aaron Penne / Tyler Hobbs.
          Stile target: monocromo, line-art, particle field, animazioni lente e
          quasi impercettibili.
        </p>
      </Container>

      <HairlineDivider />

      <Container className="py-16 lg:py-24">
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-8">
          01 — Tree (concept: tree-home, tree-about)
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl aspect-square text-ks-fg">
            <TreeVisualDemo />
          </div>
        </div>
        <p className="mt-8 text-small opacity-70 max-w-xl">
          Albero generativo a 6 livelli di ricorsione. Particelle ai nodi che
          pulsano con durate sfalsate. Rotazione lenta dell&apos;intero sistema
          (180s per giro). Seed deterministico = 42.
        </p>
      </Container>

      <HairlineDivider />

      <Container className="py-16 lg:py-24">
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-8">
          02 — Shell (concept: shell-contact)
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl aspect-square text-ks-fg">
            <ShellVisualDemo />
          </div>
        </div>
        <p className="mt-8 text-small opacity-70 max-w-xl">
          Spirale logaritmica (nautilus) con 300 punti distribuiti. Opacity che
          varia in funzione della posizione angolare durante la rotazione,
          creando un effetto &quot;respiro&quot;.
        </p>
      </Container>

      <HairlineDivider />

      <Container className="py-16 lg:py-24">
        <p className="text-eyebrow font-mono uppercase tracking-widest opacity-60 mb-8">
          03 — Wave (concept: wave-project — poster video case study)
        </p>
        <div className="flex justify-center">
          <div className="w-full max-w-2xl aspect-square bg-ks-dark-bg p-10">
            <div className="w-full h-full text-ks-dark-fg">
              <WaveVisualDemo />
            </div>
          </div>
        </div>
        <p className="mt-8 text-small opacity-70 max-w-xl">
          5 onde sinusoidali sovrapposte con phase shift continuo. 80 particelle
          luminose con pulse sfalsato. Su sfondo dark per simulare poster del
          video di un case study.
        </p>
      </Container>

      <HairlineDivider />
    </main>
  )
}
