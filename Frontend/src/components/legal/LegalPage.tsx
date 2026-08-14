import { useEffect } from "react";
import { useTranslation } from "react-i18next";

interface LegalContent {
  title: string;
  updated: string;
  intro: string;
  disclaimer: string;
  sections: { h: string; p: string }[];
}

interface LegalPageProps {
  page: "privacy" | "terms";
}

export default function LegalPage({ page }: LegalPageProps) {
  const { t } = useTranslation();
  const content = t(`legal.${page}`, { returnObjects: true }) as unknown as LegalContent;

  useEffect(() => {
    document.title = `${content.title} | LewaHub`;
  }, [content.title]);

  return (
    <div className="bg-background text-on-surface">
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <span className="inline-block px-4 py-1 bg-secondary-container text-on-secondary-container rounded-full font-label-sm text-label-sm uppercase tracking-wider mb-4">
          LewaHub
        </span>
        <h1 className="font-headline-lg text-headline-lg md:font-headline-xl md:text-headline-xl text-on-surface leading-tight">
          {content.title}
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">{content.updated}</p>

        <p className="mt-6 font-body-md text-body-md text-on-surface-variant leading-relaxed">
          {content.intro}
        </p>

        <div className="mt-6 rounded-xl border border-primary/20 bg-primary-50 p-5">
          <p className="font-body-md text-body-md text-primary-800 leading-relaxed">
            {content.disclaimer}
          </p>
        </div>

        <ol className="mt-10 space-y-8">
          {content.sections.map((section, index) => (
            <li key={index}>
              <h2 className="font-headline-md text-headline-md text-on-surface">
                <span className="text-primary">{index + 1}.</span> {section.h}
              </h2>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant leading-relaxed">
                {section.p}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
