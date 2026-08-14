import { Star, MapPin, ArrowRight, BadgeCheck, Clock } from 'lucide-react'

const schools = [
  {
    name: 'Saint Benedict High School',
    tags: ['Primary', 'Featured'],
    rating: 4.8,
    location: 'Yaoundé, Centre Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Maritime Academy of Douala',
    tags: ['University'],
    rating: 4.2,
    location: 'Douala, Littoral Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Summit Excellence Academy',
    tags: ['Secondary'],
    rating: 5.0,
    location: 'Bamenda, North-West',
    status: 'Pending Review',
    image:
      'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Bafoussam Tech Hub',
    tags: ['Tech Institute'],
    rating: 4.5,
    location: 'Bafoussam, West Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Petit-Pas Primary Center',
    tags: ['Primary'],
    rating: 4.9,
    location: 'Kribi, South Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'North Star Science Academy',
    tags: ['Secondary'],
    rating: 4.0,
    location: 'Garoua, North Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  },
]

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < Math.round(rating) ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'}`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-slate-700">{rating.toFixed(1)}/5</span>
    </div>
  )
}

export default function FeaturedSchools() {
  return (
    <section id="featured" className="bg-slate-50/60 py-14 lg:py-20">
      <div className="container-lewa">
        {/* Heading */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">Top picks</span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">Featured Schools</h2>
          </div>
          <a
            href="#featured"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-emerald-600"
          >
            View all schools
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => {
            const isPending = school.status === 'Pending Review'
            return (
              <article
                key={school.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={school.image}
                    alt={school.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Status badge */}
                  <span
                    className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
                      isPending ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {isPending ? <Clock className="h-3 w-3" /> : <BadgeCheck className="h-3 w-3" />}
                    {school.status}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-brand">
                    {school.name}
                  </h3>

                  <div className="mt-2">
                    <RatingStars rating={school.rating} />
                  </div>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {school.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          tag === 'Featured'
                            ? 'bg-brand text-white'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Location */}
                  <div className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-4 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {school.location}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}