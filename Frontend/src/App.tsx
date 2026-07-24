import Navbar from "./components/Navbar";
import ContactForm from "./components/ContactForm";
import ContactInfo from "./components/ContactInfo";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-bg-soft">
      <Navbar />

      <main className="flex-1">
        {/* Header Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-teal-primary tracking-tight">
            Get in Touch
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-text-muted leading-relaxed">
            Have questions about choosing the right school for your child? Our
            team of education experts is here to guide you through the process.
          </p>
        </section>

        {/* Main Grid Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

            {/* Right Column - Info & Map */}
            <div className="lg:col-span-5">
              <ContactInfo />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;