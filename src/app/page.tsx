import Link from "next/link"
import { Phone, Shield, Zap, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link className="flex items-center justify-center" href="/">
          <Phone className="h-6 w-6" />
          <span className="ml-2 text-lg font-bold">AI Phone System</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="#pricing">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:underline underline-offset-4" href="/auth">
            Sign In
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Your Phone System with AI
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Intelligent call handling, automated responses, and seamless human handoff. The future of customer
                  service is here.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/auth">
                  <Button>
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Zap className="h-8 w-8" />
                <h3 className="text-xl font-bold">AI-Powered Responses</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Intelligent responses to common queries, powered by advanced AI technology.
                </p>
              </div>
              <div className="space-y-2">
                <Phone className="h-8 w-8" />
                <h3 className="text-xl font-bold">Smart Call Routing</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Automatically route calls to the right department or human agent when needed.
                </p>
              </div>
              <div className="space-y-2">
                <Shield className="h-8 w-8" />
                <h3 className="text-xl font-bold">Secure & Reliable</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Enterprise-grade security with 99.9% uptime guarantee.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
              <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-gray-850">
                <h3 className="text-2xl font-bold">Starter</h3>
                <div className="mt-4 text-4xl font-bold">
                  $99<span className="text-lg font-normal">/mo</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Up to 500 minutes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Basic AI responses
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Email support
                  </li>
                </ul>
                <Link href="/auth" className="mt-6">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-gray-850 border-2 border-primary">
                <h3 className="text-2xl font-bold">Professional</h3>
                <div className="mt-4 text-4xl font-bold">
                  $199<span className="text-lg font-normal">/mo</span>
                </div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Up to 2000 minutes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Advanced AI customization
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Priority support
                  </li>
                </ul>
                <Link href="/auth" className="mt-6">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
              <div className="flex flex-col p-6 bg-white shadow-lg rounded-lg dark:bg-gray-850">
                <h3 className="text-2xl font-bold">Enterprise</h3>
                <div className="mt-4 text-4xl font-bold">Custom</div>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Unlimited minutes
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    Custom AI training
                  </li>
                  <li className="flex items-center">
                    <span className="mr-2">✓</span>
                    24/7 support
                  </li>
                </ul>
                <Link href="/auth" className="mt-6">
                  <Button className="w-full">Contact Sales</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500 dark:text-gray-400">© 2024 AI Phone System. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

