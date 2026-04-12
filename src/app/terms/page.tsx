export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="mb-10">
        <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
          Legal
        </span>
        <h1 className="text-4xl font-bold font-serif mt-2">
          Terms of Service
        </h1>
        <p className="text-[var(--muted)] mt-2">Last updated: April 2026</p>
      </div>

      <div className="space-y-8 text-gray-700 leading-relaxed">
        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using Velora News, you agree to be bound by these
            Terms of Service. If you do not agree with any part of these terms,
            you may not access the service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            2. Use of Service
          </h2>
          <p>You agree to use Velora News only for lawful purposes. You may not:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Reproduce or redistribute our content without permission</li>
            <li>Use automated systems to scrape or collect data</li>
            <li>Interfere with the proper functioning of the service</li>
            <li>Attempt to gain unauthorized access to our systems</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            3. Intellectual Property
          </h2>
          <p>
            All content on Velora News, including articles, images, graphics,
            and design elements, is protected by copyright and intellectual
            property laws. Content aggregated from third-party sources remains
            the property of their respective owners.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            4. Disclaimer
          </h2>
          <p>
            Velora News provides news content for informational purposes only.
            We make every effort to ensure accuracy but cannot guarantee that
            all information is complete or up-to-date. News content from
            external sources reflects the views of their original publishers.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            5. Limitation of Liability
          </h2>
          <p>
            Velora News shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of our service. Our
            total liability shall not exceed the amount you have paid us in
            the past twelve months.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            6. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of Velora News after changes constitutes acceptance of the
            updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold font-serif text-[var(--foreground)] mb-3">
            7. Contact
          </h2>
          <p>
            For questions about these Terms, please visit our{" "}
            <a
              href="/contact"
              className="text-[var(--accent)] hover:underline"
            >
              contact page
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
