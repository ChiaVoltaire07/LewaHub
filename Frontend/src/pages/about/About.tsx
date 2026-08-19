import { useTranslation } from "react-i18next";
import { CheckCircle2, FileText, MapPin, Star } from "lucide-react";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-background text-on-surface">
      <main className="pt-xl overflow-hidden">
    
        <section className="relative py-lg md:py-xl px-margin-mobile md:px-xl max-w-container-max mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-center">
            <div className="md:col-span-7 space-y-sm">
              <span className="inline-block px-sm py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm uppercase tracking-wider">
                {t("about.badge")}
              </span>
              <h1 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl text-on-surface text-forward-shadow leading-tight">
                {t("about.title")} <span className="text-primary">{t("about.titleHighlight")}</span>
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                {t("about.description")}
              </p>
            </div>
            <div className="md:col-span-5 relative">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-sm border border-outline-variant bg-surface-container">
                <img 
                  className="w-full h-full object-cover" 
                  alt="A clean, professional photograph of a bright, modern classroom in Cameroon with warm sunlight filtering through windows."
                  src="https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  onError={(event) => {
                    const target = event.currentTarget as HTMLImageElement;
                    target.onerror = null;
                    target.src = 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-lg md:py-xl bg-surface-container-low border-y border-outline-variant">
          <div className="px-margin-mobile md:px-xl max-w-container-max mx-auto">
            <div className="flex flex-col md:flex-row gap-lg">
              <div className="md:w-1/3">
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">{t("about.mission.title")}</h2>
                <div className="w-12 h-1 bg-primary rounded-full"></div>
              </div>
              <div className="md:w-2/3">
                <p className="font-body-md text-body-md text-on-surface-variant mb-sm leading-relaxed">
                  {t("about.mission.desc")}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-md mt-md">
                  <div className="flex items-start gap-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" fill="currentColor" />
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface">{t("about.mission.accessibility")}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{t("about.mission.accessibilityDesc")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-sm">
                    <CheckCircle2 className="w-6 h-6 text-primary" fill="currentColor" />
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface">{t("about.mission.transparency")}</h4>
                      <p className="font-body-md text-body-md text-on-surface-variant">{t("about.mission.transparencyDesc")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-lg md:py-xl px-margin-mobile md:px-xl max-w-container-max mx-auto">
          <div className="text-center mb-lg">
            <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">{t("about.verification.title")}</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">
              {t("about.verification.desc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="p-md rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-sm">
                <span className="text-primary"><FileText className="w-6 h-6" /></span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{t("about.verification.document.title")}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("about.verification.document.desc")}
              </p>
            </div>
           
            <div className="p-md rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-sm">
                <span className="text-primary"><MapPin className="w-6 h-6" /></span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{t("about.verification.onsite.title")}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("about.verification.onsite.desc")}
              </p>
            </div>
           
            <div className="p-md rounded-2xl bg-surface border border-outline-variant shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-xl flex items-center justify-center mb-sm">
                <span className="text-primary"><Star className="w-6 h-6" /></span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-xs">{t("about.verification.feedback.title")}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {t("about.verification.feedback.desc")}
              </p>
            </div>
          </div>
        </section>

        <section className="py-lg md:py-xl px-margin-mobile md:px-xl max-w-container-max mx-auto mb-lg">
          <div className="relative rounded-3xl overflow-hidden bg-on-surface text-on-primary p-lg md:p-xl">
            <div className="absolute inset-0 opacity-20"></div>
            <div className="relative z-10 max-w-3xl">
              <h2 className="font-headline-xl-mobile md:font-headline-xl text-headline-xl-mobile md:text-headline-xl mb-sm">{t("about.vision.title")}</h2>
              <p className="font-body-lg text-body-lg text-surface-variant mb-md leading-relaxed">
                {t("about.vision.desc")}
              </p>
              <div className="flex flex-wrap gap-sm">
                <div className="bg-primary/20 backdrop-blur-md px-sm py-xs rounded-lg border border-primary/30">
                  <span className="font-headline-md text-headline-md text-primary-fixed block">200+</span>
                  <span className="font-label-sm text-label-sm">{t("about.vision.schoolsVerified")}</span>
                </div>
                <div className="bg-primary/20 backdrop-blur-md px-sm py-xs rounded-lg border border-primary/30">
                  <span className="font-headline-md text-headline-md text-primary-fixed block">5k+</span>
                  <span className="font-label-sm text-label-sm">{t("about.vision.monthlyUsers")}</span>
                </div>
                <div className="bg-primary/20 backdrop-blur-md px-sm py-xs rounded-lg border border-primary/30">
                  <span className="font-headline-md text-headline-md text-primary-fixed block">10</span>
                  <span className="font-label-sm text-label-sm">{t("about.vision.regionsCovered")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;