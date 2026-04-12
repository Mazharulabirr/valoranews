import { Users, Target, Award, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
          About Us
        </span>
        <h1 className="text-4xl md:text-5xl font-bold font-serif mt-2">
          About Velora News
        </h1>
        <p className="text-lg text-[var(--muted)] mt-4 max-w-2xl mx-auto">
          Your trusted source for breaking news, in-depth analysis, and
          comprehensive coverage from around the globe.
        </p>
      </div>

      {/* Mission Section */}
      <div className="prose prose-lg max-w-none mb-16">
        <div className="bg-red-50 border-l-4 border-[var(--accent)] p-6 rounded-r-xl mb-8">
          <h2 className="text-2xl font-bold font-serif text-[var(--foreground)] mt-0">
            Our Mission
          </h2>
          <p className="text-gray-700 mb-0">
            At Velora News, we believe in the power of informed citizens. Our
            mission is to deliver accurate, timely, and unbiased news to readers
            worldwide. We are committed to journalistic integrity and the
            pursuit of truth in every story we publish.
          </p>
        </div>

        <p className="text-gray-700 leading-relaxed">
          Founded with a vision to reimagine digital journalism, Velora News
          brings together experienced journalists, data analysts, and
          technology experts to create a news platform that meets the demands
          of the modern reader. We cover stories across politics, business,
          technology, sports, health, science, and more.
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {[
          {
            icon: Target,
            title: "Accuracy First",
            description:
              "Every story is fact-checked and verified before publication. We prioritize getting it right over getting it first.",
          },
          {
            icon: Globe,
            title: "Global Perspective",
            description:
              "We cover news from every corner of the world, ensuring our readers have a comprehensive understanding of global events.",
          },
          {
            icon: Users,
            title: "Reader Focused",
            description:
              "Our platform is designed around your needs — clean, fast, and easy to navigate so you can focus on what matters.",
          },
          {
            icon: Award,
            title: "Editorial Excellence",
            description:
              "Our editorial team upholds the highest standards of journalism, bringing you thoughtful analysis alongside breaking news.",
          },
        ].map((value) => (
          <div
            key={value.title}
            className="p-6 rounded-xl border border-[var(--border)] hover:shadow-md transition-shadow"
          >
            <value.icon className="text-[var(--accent)] mb-3" size={28} />
            <h3 className="font-bold text-lg mb-2">{value.title}</h3>
            <p className="text-[var(--muted)] text-sm leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-[var(--dark-bg)] text-white rounded-2xl p-10">
        <h2 className="text-2xl font-bold font-serif mb-3">Get In Touch</h2>
        <p className="text-gray-400 mb-6">
          Have a story tip, feedback, or want to collaborate? We&apos;d love to hear
          from you.
        </p>
        <a
          href="/contact"
          className="inline-block bg-[var(--accent)] text-white px-8 py-3 rounded-full font-semibold hover:bg-[var(--accent-dark)] transition-colors"
        >
          Contact Us
        </a>
      </div>
    </div>
  );
}
