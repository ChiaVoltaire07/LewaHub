import { useState } from 'react';
import { Rocket, Send, CheckCircle2 } from 'lucide-react';

export default function CTA() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section id="questionnaires" className="bg-white py-16 lg:py-24">
      <div className="container-lewa">
        <div className="relative overflow-hidden rounded-3xl bg-brand px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          {/* Decorative circles */}
          <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-white/5" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative grid items-center gap-10 lg:grid-cols-2">
            {/* Left: copy + form */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                <Rocket className="h-3.5 w-3.5" />
                Newsletter
              </span>

              <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
                Join the future of education
              </h2>
              <p className="mt-4 max-w-md text-emerald-100/80">
                Subscribe to get the latest school reviews, rankings, and
                education tips delivered straight to your inbox.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-emerald-100/60 outline-none transition-colors focus:border-emerald-400 focus:bg-white/15"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/30 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/30"
                >
                  {subscribed ? (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Subscribed!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Subscribe Now
                    </>
                  )}
                </button>
              </form>

              {subscribed && (
                <p className="mt-3 text-sm font-medium text-emerald-300">
                  Thank you for subscribing! Check your inbox to confirm.
                </p>
              )}
            </div>

            {/* Right: rocket graphic */}
            <div className="relative hidden lg:flex items-center justify-center">
              <div className="relative flex h-64 w-64 items-center justify-center">
                {/* Orbit ring */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40" />
                <div className="absolute inset-8 rounded-full border border-white/10" />

                {/* Orbiting nodes */}
                <span className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
                <span className="absolute bottom-0 left-1/2 h-3 w-3 -translate-x-1/2 translate-y-1/2 rounded-full bg-amber-400 shadow-lg shadow-amber-400/50" />
                <span className="absolute left-0 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-400 shadow-lg shadow-sky-400/50" />
                <span className="absolute right-0 top-1/2 h-3 w-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 shadow-lg shadow-rose-400/50" />

                {/* Center rocket */}
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-2xl shadow-emerald-900/40">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}