import { Star, MapPin, ArrowRight, BadgeCheck, Clock } from 'lucide-react';

const schools = [
  {
    name: 'Saint Benedict High School',
    tags: ['Primary', 'Featured'],
    rating: 4.8,
    location: 'Yaoundé, Centre Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?q=80&w=800&auto=format&fit=crop',
    alt: 'African students in a classroom at Saint Benedict High School',
  },
  {
    name: 'Maritime Academy of Douala',
    tags: ['University'],
    rating: 4.2,
    location: 'Douala, Littoral Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800&auto=format&fit=crop',
    alt: 'University students studying at Maritime Academy of Douala',
  },
  {
    name: 'Summit Excellence Academy',
    tags: ['Secondary'],
    rating: 5.0,
    location: 'Bamenda, North-West',
    status: 'Pending Review',
    image:
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
    alt: 'Students learning in a classroom at Summit Excellence Academy',
  },
  {
    name: 'Bafoussam Tech Hub',
    tags: ['Tech Institute'],
    rating: 4.5,
    location: 'Bafoussam, West Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
    alt: 'Students working with computers at Bafoussam Tech Hub',
  },
  {
    name: 'Petit-Pas Primary Center',
    tags: ['Primary'],
    rating: 4.9,
    location: 'Kribi, South Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=800&auto=format&fit=crop',
    alt: 'Young African children in a classroom at Petit-Pas Primary Center',
  },
  {
    name: 'North Star Science Academy',
    tags: ['Secondary'],
    rating: 4.0,
    location: 'Garoua, North Region',
    status: 'Evaluated',
    image:
      'https://images.unsplash.com/photo-1567168544813-cc03465b4fa9?q=80&w=800&auto=format&fit=crop',
    alt: 'Science students conducting experiments at North Star Science Academy',
  },
];

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i <= Math.round(rating)
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="ml-1 text-sm font-semibold text-slate-700">{rating}/5</span>
    </div>
  );
}

export default function FeaturedSchools() {
  return (
    <section id="schools" className="bg-slate-50 py-16 lg:py-24">
      <div className="container-lewa">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              Discover
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-brand sm:text-4xl">
              Featured Schools
            </h2>
          </div>
          <a
            href="#search"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
          >
            View all schools
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => {
            const isPending = school.status === 'Pending Review';
            return (
              <article
                key={school.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={school.image}
                    alt={school.alt}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" />
                    {school.status}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex flex-wrap gap-2">
                    {school.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          tag === 'Featured'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="mt-3 text-lg font-bold text-brand transition-colors group-hover:text-emerald-700">
                    {school.name}
                  </h3>

                  <div className="mt-2">
                    <Stars rating={school.rating} />
                  </div>

                  <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-slate-500">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {school.location}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                        isPending
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {isPending ? (
                        <Clock className="h-3.5 w-3.5" />
                      ) : (
                        <BadgeCheck className="h-3.5 w-3.5" />
                      )}
                      {school.status}
                    </span>
                    <a
                      href="#search"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-900"
                    >
                      View
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}