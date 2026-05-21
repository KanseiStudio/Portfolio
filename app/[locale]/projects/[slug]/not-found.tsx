import { ArrowLeft } from "lucide-react"
import { Link } from "@/i18n/routing"
import { Container } from "@/components/atoms/Container"
import { TopNav } from "@/components/molecules/TopNav"

export default function ProjectNotFound() {
  return (
    <>
      <TopNav />
      <main>
        <Container as="section" className="py-32 lg:py-48">
          <div className="max-w-2xl">
            <p className="text-eyebrow font-mono uppercase tracking-widest text-ks-fg opacity-60">
              404
            </p>
            <h1 className="mt-6 font-display text-ks-h1 leading-[0.95] tracking-tight text-ks-fg">
              Project not found.
            </h1>
            <p className="mt-6 text-base font-body leading-relaxed text-ks-fg opacity-90">
              The project you&apos;re looking for doesn&apos;t exist or has been removed.
            </p>
            <Link
              href={"/projects" as never}
              className="mt-12 inline-flex items-center gap-3 text-small font-medium text-ks-fg group focus-visible:outline focus-visible:outline-1 focus-visible:outline-ks-fg focus-visible:outline-offset-4"
            >
              <ArrowLeft
                size={16}
                strokeWidth={1.5}
                className="transition-transform duration-600 ease-kansei group-hover:-translate-x-1"
              />
              <span className="group-hover:underline underline-offset-4">
                Back to archive
              </span>
            </Link>
          </div>
        </Container>
      </main>
    </>
  )
}
