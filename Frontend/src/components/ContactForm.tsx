import { Send } from "lucide-react";
import { useState, type FormEvent } from "react";

interface FormData {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
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
        Send us a message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name & Email row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-text-dark mb-1.5">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-dark mb-1.5">
              Email Address
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

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-text-dark mb-1.5">
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            placeholder="What can we help you with?"
            className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft"
          />
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-text-dark mb-1.5">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here..."
            className="w-full px-4 py-2.5 text-sm border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-primary/30 focus:border-teal-primary bg-bg-soft resize-none"
          />
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-primary text-white text-sm font-semibold rounded-lg hover:bg-teal-dark transition-colors"
        >
          Send Message
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Success toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium z-50 animate-slide-up">
          ✓ Message sent successfully! We'll get back to you soon.
        </div>
      )}
    </div>
  );
}