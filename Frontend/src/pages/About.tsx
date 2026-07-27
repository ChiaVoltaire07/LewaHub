import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="bg-background text-on-surface">
      <Navbar />
      
      <main className="pt-xl overflow-hidden">
    
        <section className="relative py-lg md:py-xl px-margin-mobile md:px-xl max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
            <div className="md:col-span-7 space-y-sm">
              <span className="inline-block px-sm py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                Education First
              </span>
              <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface text-forward-shadow leading-tight">
                Empowering Parents and Students Through <span className="text-primary">Verified Knowledge.</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                At LewaHub, we believe every child deserves access to a quality education. We bridge the information gap by providing a comprehensive, transparent, and verified directory of schools across Cameroon.
              </p>
            </div>
            <div className="md:col-span-5 relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container">
                <img 
                  className="w-full h-full object-cover" 
                  alt="A clean, professional photograph of a bright, modern classroom in Cameroon with warm sunlight filtering through windows. The scene captures the essence of hope and quality education, featuring organized wooden desks and a chalkboard in a minimalist setting. The color palette is dominated by soft whites and natural tones with subtle teal accents, reflecting the CameroonEdu brand identity."
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCrIccq-M-EdaxKhskSZX86Y80NkiCbJKiCIHA61aC1Q3mya7zWgxDi8nyvZG1QKX6OB6Oh2WtaQQibKWUYY0Qw94-0HQ6cRsAe0eAbz4U5Pnb8TesdAVHdrzciVb24qwkblKAzBvHPhXWjNxVRt1vPl0FomW2nvDE6gnE0Hxyuy9cIj3xAc--WYOC5_UxDFh6DY7aEjmVyvKEnR9z6rgDaEobmK8q-qkh-nNIQAtFQ7_8bSrMVReTx4A"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="py-lg md:py-xl bg-surface-container-low border-y border-outline-variant">
          <div className="px-margin-mobile md:px-xl max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row gap-lg">
              <div className="md:w-1/3">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Our Mission</h2>
                <div className="w-12 h-1 bg-primary rounded-full"></div>
              </div>
              <div className="md:w-2/3">
                <p className="font-body-md text-body-md text-on-surface-variant mb-sm leading-relaxed">
                  Our primary mission is to simplify the school selection process for families in Cameroon. We understand that choosing the right institution is one of the most critical decisions a parent can make. By centralizing data on fees, curriculum, facilities, and location, we remove the stress and uncertainty from the process.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-md">
                  <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>task_alt</span>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface">Accessibility</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Making school data free and easy to access for everyone.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-sm">
                    <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>task_alt</span>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface">Transparency</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">Ensuring tuition and facility details are clear and honest.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How We Verify Schools */}
        <section className="py-lg md:py-xl px-margin-mobile md:px-xl max-w-container-max mx-auto">
          <div className="text-center mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">How We Verify Schools</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
              Trust is the foundation of our platform. Every school listed on LewaHub undergoes a multi-step verification process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            {/* Step 1 */}
            <div className="p-md rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined">description</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Document Review</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We collect and review official registration documents from the Ministry of Secondary Education (MINESEC) or Basic Education (MINEDUB).
              </p>
            </div>
            {/* Step 2 */}
            <div className="p-md rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">On-Site Confirmation</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Our field agents conduct periodic visits to verify the existence of physical facilities and the accuracy of provided photos.
              </p>
            </div>
            {/* Step 3 */}
            <div className="p-md rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-sm">
                <span className="material-symbols-outlined">reviews</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">Community Feedback</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                We moderate parent and student reviews to ensure that qualitative feedback reflects the real-world experience at the institution.
              </p>
            </div>
          </div>
        </section>

        {/* The Goal Section */}
        <section className="py-lg md:py-xl px-margin-mobile md:px-xl max-w-container-max mx-auto mb-lg">
          <div className="relative rounded-3xl overflow-hidden bg-on-surface text-on-primary p-lg md:p-xl">
            <div className="absolute inset-0 opacity-20"></div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl mb-sm">LewaHub</h2>
              <p className="font-body-lg text-body-lg text-surface-variant mb-md leading-relaxed">
                By the year 2030, our goal is to have every legally registered primary and secondary school in Cameroon accessible via our platform. We aim to become the standard benchmark for educational transparency in Central Africa, fostering a healthy competition among schools to improve their facilities and educational outcomes.
              </p>
              <div className="flex flex-wrap gap-sm">
                <div className="bg-primary/20 backdrop-blur-md px-sm py-xs rounded-lg border border-primary/30">
                  <span className="font-headline-md text-headline-md text-primary-fixed block">200+</span>
                  <span className="font-label-sm text-label-sm">Schools Verified</span>
                </div>
                <div className="bg-primary/20 backdrop-blur-md px-sm py-xs rounded-lg border border-primary/30">
                  <span className="font-headline-md text-headline-md text-primary-fixed block">5k+</span>
                  <span className="font-label-sm text-label-sm">Monthly Users</span>
                </div>
                <div className="bg-primary/20 backdrop-blur-md px-sm py-xs rounded-lg border border-primary/30">
                  <span className="font-headline-md text-headline-md text-primary-fixed block">10</span>
                  <span className="font-label-sm text-label-sm">Regions Covered</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="py-lg bg-surface border-t border-outline-variant">
          <div className="px-margin-mobile md:px-xl max-w-container-max mx-auto text-center">
            <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">Trusted by Educational Partners</h3>
            <div className="flex flex-wrap justify-center gap-xl grayscale opacity-60">
              <div className="flex items-center gap-xs font-bold text-headline-md">LOGO A</div>
              <div className="flex items-center gap-xs font-bold text-headline-md">LOGO B</div>
              <div className="flex items-center gap-xs font-bold text-headline-md">LOGO C</div>
              <div className="flex items-center gap-xs font-bold text-headline-md">LOGO D</div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;