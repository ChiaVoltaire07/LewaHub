import { GraduationCap, Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Search', href: '#featured' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const legalLinks = [
  { label: 'Privacy Policy', href: '#privacy' },
  { label: 'Terms of Service', href: '#terms' },
  { label: 'Support', href: '#support' },
]

const socials = [
  { label: 'Facebook', icon: Facebook, href: '#facebook' },
  { label: 'Twitter', icon: Twitter, href: '#twitter' },
  { label: 'Instagram', icon: Instagram, href: '#instagram' },
  { label: 'LinkedIn', icon: Linkedin, href: '#linkedin' },
]

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-100 bg-white">
      <div className="container-lewa py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <a href="#home" className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white">
                <GraduationCap className="h-6 w-6" />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-brand">
                Lewa<span className="text-emerald-600">Hub</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-500">
              Empowering families to make the best educational choices for their children.
            </p>
            <div className="mt-6 space-y-2 text-sm text-slate-500">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Yaoundé, Cameroon
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                hello@lewahub.cm
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                +237 6 00 00 00 00
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-brand">Legal</h4>
            <ul className="mt-4 space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-slate-500 transition-colors hover:text-brand"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} LewaHub. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((social) => {
              const Icon = social.icon
              return (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-all hover:border-brand hover:bg-brand hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}