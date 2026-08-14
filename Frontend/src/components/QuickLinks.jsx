import { Search, Users, Mail, ArrowRight } from 'lucide-react'

const cards = [
  {
    title: 'Search school',
    description: 'Browse and compare verified schools across all regions of Cameroon.',
    link: 'Get started',
    href: '#featured',
    icon: Search,
    variant: 'dark',
  },
  {
    title: 'About us',
    description: 'Learn about our mission to empower families through education.',
    link: 'Our story',
    href: '#about',
    icon: Users,
    variant: 'light',
  },
  {
    title: 'Contact us',
    description: 'Have questions? Our team is here to help you every step of the way.',
    link: 'Reach out',
    href: '#contact',
    icon: Mail,
    variant: 'indigo',
  },
]

export default function QuickLinks() {
  return (
    <section id="about" className="container-lewa py-14 lg:py-20">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon
          const styles =
            card.variant === 'dark'
              ? 'bg-brand text-white'
              : card.variant === 'indigo'
                ? 'bg-indigo-50 text-slate-800'
                : 'bg-white text-slate-800 border border-slate-200'

          const iconBg =
            card.variant === 'dark'
              ? 'bg-emerald-500/20 text-emerald-300'
              : card.variant === 'indigo'
                ? 'bg-indigo-100 text-indigo-600'
                : 'bg-emerald-100 text-emerald-600'

          const linkColor =
            card.variant === 'dark' ? 'text-emerald-300 hover:text-white' : 'text-brand hover:text-emerald-600'

          return (
            <div
              key={card.title}
              className={`group flex flex-col rounded-2xl p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${styles}`}
            >
              <span className={`flex h-14 w-14 items-center justify-center rounded-2xl ${iconBg}`}>
                <Icon className="h-7 w-7" />
              </span>
              <h3 className="mt-6 text-xl font-bold">{card.title}</h3>
              <p className={`mt-2 flex-1 text-sm leading-relaxed ${card.variant === 'dark' ? 'text-emerald-100/80' : 'text-slate-500'}`}>
                {card.description}
              </p>
              <a
                href={card.href}
                className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold transition-colors ${linkColor}`}
              >
                {card.link}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}