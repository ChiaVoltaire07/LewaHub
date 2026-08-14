import { useState } from 'react'
import { MapPin, Search, ChevronDown, Award, Star } from 'lucide-react'

const locations = [
  'All Locations',
  'Yaoundé, Centre Region',
  'Douala, Littoral Region',
  'Bamenda, North-West',
  'Bafoussam, West Region',
  'Kribi, South Region',
  'Garoua, North Region',
]

export default function Hero() {
  const [location, setLocation] = useState('All Locations')
  const [open, setOpen] = useState(false)

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 to-white">
      <div className="container-lewa grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        {/* Left content */}
        <div className="max-w-xl">
          {/* Badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand shadow-sm">
            <Award className="h-4 w-4 text-emerald-600" />
            Education Excellence in Cameroon
          </span>

          {/* Headline */}
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-brand sm:text-5xl lg:text-6xl">
            Find the best school for your{' '}
            <span className="relative whitespace-nowrap text-emerald-600">
              future
              <svg
                className="absolute -bottom-2 left-0 h-3 w-full text-emerald-300"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path d="M2 9C60 3 140 3 198 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600">
            Explore verified schools across Cameroon, compare ratings, and make confident
            decisions for your child's education journey.
          </p>

          {/* Search widget */}
          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-emerald-900/5 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300"
              >
                <span className="truncate">{location}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
              </button>
              {open && (
                <ul className="absolute left-0 right-0 top-full z-20 mt-2 max-h-64 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl">
                  {locations.map((loc) => (
                    <li key={loc}>
                      <button
                        type="button"
                        onClick={() => {
                          setLocation(loc)
                          setOpen(false)
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-emerald-50 ${
                          loc === location ? 'font-semibold text-brand' : 'text-slate-600'
                        }`}
                      >
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        {loc}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <a
              href="#featured"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md"
            >
              <Search className="h-4 w-4" />
              Explore Schools
            </a>
          </div>

          {/* Trust stats */}
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="text-2xl font-extrabold text-brand">1,200+</p>
              <p className="text-sm text-slate-500">Verified schools</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-extrabold text-brand">10 Regions</p>
              <p className="text-sm text-slate-500">Covered nationwide</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-500">Trusted by parents</p>
            </div>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative hidden lg:block">
          <div className="relative overflow-hidden rounded-3xl border border-emerald-100 shadow-2xl shadow-emerald-900/10">
            <img
              src="https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=1200&q=80"
              alt="African school students in a classroom"
              className="h-[480px] w-full object-cover"
            />
            {/* Cameroon flag element */}
            <div className="absolute right-5 top-5 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 shadow-md backdrop-blur">
              <img src="/cameroon-flag.svg" alt="Cameroon flag" className="h-5 w-8 rounded-sm object-cover" />
              <span className="text-xs font-semibold text-brand">Cameroon</span>
            </div>
            {/* Floating card */}
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                  <Award className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-bold text-brand">Top Rated</p>
                  <p className="text-xs text-slate-500">Summit Excellence Academy · 5.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}