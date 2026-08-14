import { useState } from 'react'
import { Rocket, Send, CheckCircle2, Sparkles, GraduationCap, BookOpen, Star } from 'lucide-react'

export default function NewsletterCTA() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
    }
  }

  return (
    <section id="questionnaires" className="container-lewa py-14 lg:py-20">
      <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 right-1/3 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative grid items-center gap-10 lg:grid-cols-2">
          {/* Left content */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-300">
              <Sparkles className="h-4 w-4" />
              Stay in the loop
            </span>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
              Join the future of education
            </h2>
            <p className="mt-4 max-w-md text-emerald-100/80">
              Subscribe to get the latest school listings, ratings, and education insights delivered
              straight to your inbox.
            </p>

            {subscribed ? (
              <div className="mt-8 flex items-center gap-3 rounded-2xl bg-emerald-500/20 p-4 text-emerald-100">
                <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-300" />
                <p className="text-sm font-medium">
                  You're subscribed! Welcome to the LewaHub community.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full flex-1 rounded-xl border border-emerald-500/30 bg-white/10 px-4 py-3.5 text-sm text-white placeholder-emerald-200/60 outline-none backdrop-blur transition-colors focus:border-emerald-300 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30"
                >
                  <Send className="h-4 w-4" />
                  Subscribe Now
                </button>
              </form>
            )}
          </div>

          {/* Right graphic */}
          <div className="relative hidden items-center justify-center lg:flex">
            <div className="relative flex h-72 w-72 items-center justify-center">
              {/* Orbit rings */}
              <div className="absolute inset-0 rounded-full border border-emerald-400/30" />
              <div className="absolute inset-8 rounded-full border border-dashed border-emerald-400/40" />
              <div className="absolute inset-16 rounded-full border border-emerald-400/30" />

              {/* Orbiting nodes */}
              <span className="absolute left-1/2 top-0 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-400 text-brand shadow-lg">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="absolute right-0 top-1/2 flex h-10 w-10 translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-brand shadow-lg">
                <BookOpen className="h-5 w-5" />
              </span>
              <span className="absolute bottom-0 left-1/2 flex h-10 w-10 -translate-x-1/2 translate-y-1/2 items-center justify-center rounded-full bg-amber-400 text-brand shadow-lg">
                <Star className="h-5 w-5" />
              </span>
              <span className="absolute left-0 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-emerald-300 text-brand shadow-lg">
                <Sparkles className="h-5 w-5" />
              </span>

              {/* Center rocket */}
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-900/40">
                <Rocket className="h-14 w-14 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}