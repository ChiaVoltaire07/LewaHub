import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
    setFormData({ fullName: "", email: "", subject: "", message: "" });
    setTimeout(() => setShowSuccess(false), 4000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 sm:p-8">
      <h2 className="text-xl font-bold text-text-dark mb-6">
        {t("contact.form.subject")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-dark mb-1.5">
              {t("contact.form.name")}
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder={t("contact.form.name")}
              className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1.5">
              {t("contact.form.email")}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft"
            />
          </div>
        </div>

       
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-dark mb-1.5">
            {t("contact.form.subject")}
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder={t("contact.form.subject")}
            className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft"
          />
        </div>

        
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-1.5">
            {t("contact.form.message")}
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder={t("contact.form.message")}
            className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft resize-none"
          />
        </div>

        
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-primary text-white text-sm font-semibold rounded-lg hover:bg-teal-dark transition-colors"
        >
          {t("contact.form.submit")}
          <Send className="w-4 h-4" />
        </button>
      </form>

      
      {showSuccess && (
        <div
          role="status"
          className="contact-toast fixed bottom-6 right-6 left-6 sm:left-auto max-w-sm mx-auto sm:mx-0 bg-teal-primary text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50"
        >
          ✓ {t("contact.form.success")}
        </div>
      )}
    </div>
  );
}