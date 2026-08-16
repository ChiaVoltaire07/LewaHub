import { GraduationCap, Twitter, Instagram, Linkedin } from 'lucide-react';

const legalLinks = ['Privacy Policy', 'Terms of Service', 'Support'];

const socials = [
  { label: 'Twitter', icon: Twitter, href: '#' },
  { label: 'Instagram', icon: Instagram, href: '#' },
  { label: 'LinkedIn', icon: Linkedin, href: '#' },
];

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-800 bg-black">
      <div className="container-lewa py-12">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          {/* Brand */}
          <div className="max-w-sm">
            <a href="#home" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-brand">
                Lewa<span className="text-emerald-600">Hub</span>
              </span>
            </a>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Empowering families to make the best educational choices for their
              children.
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-8 gap-y-3">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="text-sm font-medium text-slate-400 transition-colors hover:text-emerald-400"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Socials */}
          <div className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 text-slate-400 ring-1 ring-slate-700 transition-all hover:bg-emerald-600 hover:text-white hover:ring-emerald-600"
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800 pt-6 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} LewaHub. All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Made with <span className="text-emerald-500">♥</span> in Cameroon
          </p>
        </div>
      </div>
    </footer>
  );
}