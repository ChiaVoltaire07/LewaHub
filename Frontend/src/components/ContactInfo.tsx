import { Mail, Phone, MapPin, Globe, Users, Megaphone, ExternalLink } from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-6">
      {/* Contact Information Card */}
      <div className="bg-lavender/60 rounded-2xl p-6 sm:p-8">
        <h2 className="text-xl font-bold text-text-dark mb-6">
          Contact Information
        </h2>

        <div className="space-y-5">
          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-primary/10 flex items-center justify-center">
              <Mail className="h-5 w-5 text-teal-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Email Us
              </p>
              <a
                href="mailto:support@LewaHub.cm"
                className="text-sm font-medium text-teal-primary hover:text-teal-dark transition-colors"
              >
                support@LewaHub.cm
              </a>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-primary/10 flex items-center justify-center">
              <Phone className="h-5 w-5 text-teal-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Call Us
              </p>
              <a
                href="tel:+237600000000"
                className="text-sm font-medium text-teal-primary hover:text-teal-dark transition-colors"
              >
                +237 600 000 000
              </a>
              <p className="text-xs text-text-muted mt-0.5">
                Mon - Fri, 8am - 5pm
              </p>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-teal-primary/10 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-teal-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider">
                Visit Us
              </p>
              <p className="text-sm font-medium text-text-dark">
                123 Education Way, Bastos, Yaoundé, Cameroon
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Map Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-border-light overflow-hidden">
        <div className="relative">
          {/* Static map image fallback with embedded map */}
          <div className="w-full h-56 bg-gray-200 relative overflow-hidden">
            <iframe
              title="Yaoundé Cameroon Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15928.256608197556!2d11.502118!3d3.866667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x108bc0b2e2c3e2e3%3A0x5e3e5c5d5a5f5b5a!2sYaound%C3%A9%2C+Cameroon!5e0!3m2!1sen!2sus!4v1"
              className="absolute inset-0 w-full h-full"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Overlay button */}
          <a
            href="https://maps.google.com/maps?q=Yaound%C3%A9+Cameroon"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 px-4 bg-white border-t border-border-light text-sm font-medium text-teal-primary hover:text-teal-dark hover:bg-gray-50 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Maps
          </a>
        </div>
      </div>

      {/* Social / Action Icons Row */}
      <div className="flex items-center justify-center gap-8 py-4">
        {/* Globe Icon */}
        <a
          href="#"
          className="w-14 h-14 rounded-full bg-white shadow-sm border border-border-light flex items-center justify-center text-text-muted hover:text-teal-primary hover:border-teal-primary/30 hover:shadow-md transition-all duration-200 group"
          aria-label="Website"
        >
          <Globe className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </a>

        {/* Users Icon */}
        <a
          href="#"
          className="w-14 h-14 rounded-full bg-white shadow-sm border border-border-light flex items-center justify-center text-text-muted hover:text-teal-primary hover:border-teal-primary/30 hover:shadow-md transition-all duration-200 group"
          aria-label="Community"
        >
          <Users className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </a>

        {/* Megaphone Icon */}
        <a
          href="#"
          className="w-14 h-14 rounded-full bg-white shadow-sm border border-border-light flex items-center justify-center text-text-muted hover:text-teal-primary hover:border-teal-primary/30 hover:shadow-md transition-all duration-200 group"
          aria-label="Announcements"
        >
          <Megaphone className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </div>
  );
}