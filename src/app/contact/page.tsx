import { Mail, MapPin, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
          Contact
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mt-2">
          Get In Touch
        </h1>
        <p className="text-lg text-[var(--muted)] mt-4">
          Have a question, story tip, or feedback? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-[var(--border)] p-8">
            <h2 className="text-xl font-bold font-serif mb-6">
              Send us a Message
            </h2>
            <form className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="What is this about?"
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={6}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-[var(--accent)] text-white rounded-lg font-semibold hover:bg-[var(--accent-dark)] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-6">
          {[
            {
              icon: Mail,
              title: "Email",
              detail: "contact@veloranews.com",
              sub: "We reply within 24 hours",
            },
            {
              icon: MapPin,
              title: "Address",
              detail: "123 News Street",
              sub: "New York, NY 10001",
            },
            {
              icon: Phone,
              title: "Phone",
              detail: "+1 (555) 123-4567",
              sub: "Mon - Fri, 9am - 6pm",
            },
            {
              icon: Clock,
              title: "Working Hours",
              detail: "24/7 Newsroom",
              sub: "Always covering the news",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-start gap-4 p-5 rounded-xl border border-[var(--border)]"
            >
              <div className="p-3 bg-red-50 rounded-lg">
                <item.icon className="text-[var(--accent)]" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{item.title}</h3>
                <p className="text-[var(--foreground)] font-medium">
                  {item.detail}
                </p>
                <p className="text-xs text-[var(--muted)]">{item.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
