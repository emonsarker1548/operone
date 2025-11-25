import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
      <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
          The Modern Stack for <br className="hidden sm:inline" />
          <span className="text-primary">Rapid Development</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Build faster with our pre-configured monorepo. Includes Next.js,
          Tailwind CSS, TypeScript, and authentication out of the box.
        </p>
        <div className="space-x-4">
          <Link href="/login">
            <Button size="lg" className="h-11 px-8">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="https://github.com" target="_blank" rel="noreferrer">
            <Button variant="outline" size="lg" className="h-11 px-8">
              GitHub
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
