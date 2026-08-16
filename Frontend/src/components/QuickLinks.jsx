import { Search, Users, Mail, ArrowRight } from 'lucide-react';

const cards = [
  {
    title: 'Search school',
    description:
      'Browse and compare verified schools across all regions of Cameroon.',
    link: 'Get started',
    href: '#search',
    icon: Search,
    theme: 'dark',
  },
  {
    title: 'About us',
    description:
      'Learn about our mission to empower families through education.',
    link: 'Our story',
    href: '#about',
    icon: Users,
    theme: 'light',
  },
  {
    title: 'Contact us',
    description:
      'Have questions? Our team is ready to help you find the right fit.',
    link: 'Reach out',
    href: '#contact',
    icon: Mail,
    theme: 'indigo',
  },
];

export default function QuickLinks() {
  return (
    <section id="search" className="container-lewa -mt-10 relative z-10 pb-16 lg:pb-20">
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          const isDark = card.theme === 'dark';
          const isIndigo = card.theme === 'indigo';

          return (
            <a
              key={card.title}
              href={card.href}
              className={`group flex flex-col rounded-2xl p-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                isDark
                  ? 'bg-brand text-white'
                  : isIndigo
                  ? 'bg-indigo-50 text-slate-800 ring-1 ring-indigo-100'
                  : 'bg-white text-slate-800 ring-1 ring-slate-200'
              }`}
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                  isDark
                    ? 'bg-white/15 text-white'
                    : isIndigo
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                <Icon className="h-6 w-6" />
              </span>

              <h3
                className={`mt-5 text-xl font-bold ${
                  isDark ? 'text-white' : 'text-brand'
                }`}
              >
                {card.title}
              </h3>
              <p
                className={`mt-2 text-sm leading-relaxed ${
                  isDark ? 'text-emerald-100/80' : 'text-slate-500'
                }`}
              >
                {card.description}
              </p>

              <span
                className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold transition-colors ${
                  isDark
                    ? 'text-emerald-300 group-hover:text-white'
                    : isIndigo
                    ? 'text-indigo-600 group-hover:text-indigo-800'
                    : 'text-emerald-700 group-hover:text-emerald-900'
                }`}
              >
                {card.link}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}