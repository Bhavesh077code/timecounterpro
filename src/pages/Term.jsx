import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://timecounterpro.com";
const CONTACT_EMAIL = "timecounterpro@gmail.com";

function Term() {
  return (
    <>
      <Helmet>
        <title>Terms of Service | TimeCounterPro</title>
        <meta
          name="description"
          content="Read the TimeCounterPro Terms of Service covering acceptable use, website availability, intellectual property, advertising and limitations."
        />
        <link rel="canonical" href={`${SITE_URL}/terms`} />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <article className="mx-auto max-w-4xl">

          <header className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Legal Information
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Terms of Service
            </h1>

            <p className="mt-4 leading-7 text-slate-600">
              These Terms of Service explain the conditions for using
              TimeCounterPro and its browser-based timing tools.
            </p>

            <p className="mt-3 text-sm text-slate-500">
              Last updated: September 28, 2026
            </p>
          </header>

          <div className="space-y-6">

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                1. Acceptance of These Terms
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                By accessing or using TimeCounterPro, you agree to follow
                these Terms of Service. If you do not agree with these terms,
                please do not use the website.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                2. About the Service
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                TimeCounterPro provides browser-based timing utilities such as
                countdown timers, Pomodoro timers, stopwatches, world clocks,
                interval timers and other timing-related tools.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                The tools are provided for general informational,
                productivity, educational, entertainment and timing purposes.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                3. No Account Required
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Normal use of TimeCounterPro does not require registration,
                login or a user account.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                Some preferences or timer settings may be stored locally in
                your browser.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                4. Acceptable Use
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                You agree to use the website in a lawful and reasonable manner.
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-slate-600 leading-7">
                <li>Do not attempt to damage or disrupt the website.</li>
                <li>Do not attempt to gain unauthorized access to systems.</li>
                <li>Do not use automated methods to abuse the service.</li>
                <li>Do not interfere with website security.</li>
                <li>Do not use the website for unlawful activities.</li>
                <li>Do not intentionally generate fraudulent advertising activity.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                5. Timer Accuracy and Limitations
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                TimeCounterPro is a browser-based timing service. Timer
                behavior can be affected by browser performance, device
                performance, background tabs, operating-system restrictions,
                power-saving features and other technical conditions.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                Therefore, TimeCounterPro should not be treated as a certified
                precision timing instrument.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                For safety-critical, medical, laboratory, industrial,
                professional competition or legally regulated timing
                requirements, use equipment and procedures specifically
                designed and certified for that purpose.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                6. Health and Fitness Information
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Some tools may be useful for exercise intervals or fasting
                duration tracking. These tools are timing utilities only.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                TimeCounterPro does not provide medical diagnosis, treatment,
                medical supervision or individualized medical advice.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                Consult an appropriately qualified healthcare professional
                before making health-related decisions.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                7. Availability and Changes
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                We aim to keep TimeCounterPro available and useful, but we do
                not guarantee uninterrupted operation.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                We may modify, improve, remove or temporarily disable a tool,
                page or feature when necessary.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                8. Intellectual Property
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Unless otherwise stated, the TimeCounterPro website,
                original interface design, written content, branding and
                original application code are protected by applicable
                intellectual-property laws.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                You may use the website for normal personal or professional
                purposes, but you may not copy, reproduce, republish or
                redistribute substantial portions of the website without
                appropriate permission.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                9. Third-Party Services and Advertising
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                TimeCounterPro may use third-party services such as hosting,
                analytics, advertising and externally hosted resources.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                Third-party services operate according to their own terms and
                privacy policies. TimeCounterPro is not responsible for the
                independent practices of third-party providers.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                Advertising may be displayed through Google AdSense or other
                authorized advertising technology where applicable.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                10. External Links
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                TimeCounterPro may contain links to third-party websites.
                These links are provided for convenience or additional
                information.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                We do not control third-party websites and are not responsible
                for their content, availability, security or privacy practices.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                11. Disclaimer
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                TimeCounterPro is provided on an "as available" and
                "as is" basis to the extent permitted by applicable law.
              </p>

              <p className="mt-3 leading-7 text-slate-600">
                We make reasonable efforts to maintain accurate and useful
                tools, but we do not guarantee that every feature will always
                be error-free, uninterrupted or suitable for every purpose.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                12. Limitation of Liability
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                To the extent permitted by applicable law, TimeCounterPro and
                its operators shall not be responsible for losses arising from
                reliance on a browser-based timer, temporary website
                unavailability, device or browser problems, or third-party
                services.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                13. Changes to These Terms
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                These Terms may be updated when the service, features or legal
                requirements change. The latest version will always be
                published on this page.
              </p>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-2xl font-bold text-slate-900">
                14. Contact
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                Questions about these Terms can be sent to:
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 inline-block font-semibold text-indigo-600 hover:text-indigo-700"
              >
                {CONTACT_EMAIL}
              </a>
            </section>

          </div>
        </article>
      </main>
    </>
  );
}

export default Term;