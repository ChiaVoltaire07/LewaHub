import { useState } from 'react';
import { MapPin, Search, ChevronDown, Sparkles } from 'lucide-react';

const locations = [
  'All Locations',
  'Yaoundé, Centre Region',
  'Douala, Littoral Region',
  'Bamenda, North-West',
  'Bafoussam, West Region',
  'Kribi, South Region',
  'Garoua, North Region',
];

function CameroonFlag({ className = '' }) {
  return (
    <svg viewBox="0 0 90 60" className={className} aria-label="Cameroon flag">
      <rect width="30" height="60" fill="#007A5E" />
      <rect x="30" width="30" height="60" fill="#CE1126" />
      <rect x="60" width="30" height="60" fill="#FCD116" />
      <path
        d="M45 12 L48.5 20.5 L57.5 20.9 L50.3 26.6 L52.8 35.3 L45 30.4 L37.2 35.3 L39.7 26.6 L32.5 20.9 L41.5 20.5 Z"
        fill="#FCD116"
      />
    </svg>
  );
}

export default function Hero() {
  const [location, setLocation] = useState('All Locations');
  const [open, setOpen] = useState(false);

  return (
    <section id="home" className="relative overflow-hidden bg-slate-50">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-16 top-40 h-80 w-80 rounded-full bg-emerald-200/40 blur-3xl" />

      <div className="container-lewa relative grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            <Sparkles className="h-3.5 w-3.5" />
            Education Excellence in Cameroon
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-brand sm:text-5xl lg:text-6xl">
            Find the best school for your{' '}
            <span className="relative whitespace-nowrap text-emerald-600">
              future
              <svg
                className="absolute -bottom-2 left-0 w-full"
                viewBox="0 0 200 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M2 9C60 3 140 3 198 9"
                  stroke="#10B981"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg text-slate-600">
            Explore verified schools across Cameroon, compare ratings, and make
            confident decisions for your child's education journey.
          </p>

          <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/60 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-emerald-600" />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-left text-sm font-medium text-slate-700 transition-colors hover:border-emerald-300"
                aria-haspopup="listbox"
                aria-expanded={open}
              >
                {location}
                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform ${
                    open ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {open && (
                <ul
                  role="listbox"
                  className="absolute left-0 right-0 top-full z-20 mt-2 max-h-60 overflow-auto rounded-xl border border-slate-200 bg-white py-1 shadow-xl"
                >
                  {locations.map((loc) => (
                    <li key={loc}>
                      <button
                        type="button"
                        onClick={() => {
                          setLocation(loc);
                          setOpen(false);
                        }}
                        className={`flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors hover:bg-emerald-50 ${
                          loc === location
                            ? 'font-semibold text-emerald-700'
                            : 'text-slate-700'
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

            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-dark hover:shadow-md"
            >
              <Search className="h-4 w-4" />
              Explore Schools
            </button>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
            <div>
              <p className="text-2xl font-extrabold text-brand">120+</p>
              <p className="text-sm text-slate-500">Verified schools</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-extrabold text-brand">10</p>
              <p className="text-sm text-slate-500">Regions covered</p>
            </div>
            <div className="h-10 w-px bg-slate-200" />
            <div>
              <p className="text-2xl font-extrabold text-brand">4.8</p>
              <p className="text-sm text-slate-500">Average rating</p>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-300/50">
              <div className="relative h-80 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                  alt="Black Cameroonian students studying together on campus"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}