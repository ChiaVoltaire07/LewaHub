import { useTranslation } from "react-i18next";
import "../../styles/contact.css";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";

export default function ContactPage() {
  const { t } = useTranslation();

  return (
    <div className="contact-page min-h-screen flex flex-col bg-bg-soft">
      <main className="flex-1">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 sm:pt-12 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-primary tracking-tight">
            {t("contact.title")}
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed">
            {t("contact.subtitle")}
          </p>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            <div className="lg:col-span-5">
              <ContactInfo />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}