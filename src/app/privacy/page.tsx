export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
          Legal
        </span>
        <h1 className="text-4xl font-bold font-serif mt-2">Privacy Policy</h1>
        <p className="text-[var(--muted)] mt-2">Last updated: April 2026</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            1. Information We Collect
          </h2>
          <p>
            When you visit Velora News, we may collect certain information
            automatically, including your IP address, browser type, referring
            pages, and the date and time of your visit. If you subscribe to our
            newsletter, we collect your email address.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            2. How We Use Your Information
          </h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide and improve our news services</li>
            <li>Send you newsletter updates (if subscribed)</li>
            <li>Analyze usage patterns to improve user experience</li>
            <li>Ensure the security of our platform</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            3. Cookies
          </h2>
          <p>
            We use cookies and similar tracking technologies to enhance your
            browsing experience. You can control cookie settings through your
            browser preferences.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            4. Third-Party Services
          </h2>
          <p>
            We may use third-party analytics and advertising services. These
            services may collect information about your visits to our site.
            We recommend reviewing their respective privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            5. Data Security
          </h2>
          <p>
            We implement reasonable security measures to protect your
            information. However, no method of transmission over the internet
            is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            6. Contact Us
          </h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at{" "}
            <a
              href="/contact"
              className="text-[var(--accent)] hover:underline"
            >
              our contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
