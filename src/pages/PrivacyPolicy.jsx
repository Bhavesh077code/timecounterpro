import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://timecounterpro.com";
const CONTACT_EMAIL = "timecounterpro@gmail.com";

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | TimeCounterPro</title>
        <meta
          name="description"
          content="Read the TimeCounterPro Privacy Policy to understand browser storage, analytics, advertising, contact information and third-party services used by the website."
        />
        <link rel="canonical" href={`${SITE_URL}/privacy`} />
        <meta name="robots" content="index,follow" />
      </Helmet>

      <main className="min-h-screen bg-slate-50 px-3 py-8 sm:px-5 sm:py-10 lg:px-8">
        <article className="mx-auto w-full max-w-4xl">

          {/* Header Container */}
          <header className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 sm:mb-8 sm:p-6 lg:p-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600 sm:text-sm">
              Legal Information
            </p>

            <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">
              Privacy Policy
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600 sm:mt-4 sm:text-base sm:leading-7">
              This Privacy Policy explains how TimeCounterPro handles
              information when you visit and use our website and online
              timing tools.
            </p>

            <p className="mt-2 text-xs text-slate-500 sm:mt-3 sm:text-sm">
              Last updated: September 28, 2026
            </p>
          </header>

          <div className="space-y-4 sm:space-y-6">

            {/* 1. About */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                1. About TimeCounterPro
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro is a browser-based collection of online timing
                tools, including countdown timers, Pomodoro timers,
                stopwatches, world clocks and other activity-specific timing
                tools.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Most of the core timer functionality works directly in your
                web browser. You do not need to create an account or provide
                personal information to use the main timer features.
              </p>
            </section>

            {/* 2. Information You Provide */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                2. Information You Provide
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro does not require registration for normal use.
                We do not provide a user account system or a server-side
                database for storing timer accounts.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                If you contact us by email, you may voluntarily provide
                information such as your name, email address, subject and
                message. That information is sent through your email provider
                when you choose to contact us.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Please do not send passwords, payment information, government
                identification numbers or other highly sensitive information
                in a support message.
              </p>
            </section>

            {/* 3. Browser Storage */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                3. Browser Storage and Local Data
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Some TimeCounterPro tools use browser storage such as{" "}
                <strong>localStorage</strong> to remember certain settings,
                preferences, timer states or user-created configurations.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                This information is stored by your browser on your device.
                It is not the same as creating a TimeCounterPro account.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                You can normally remove browser-stored information through
                your browser's site data or storage settings. Removing this
                information may reset saved preferences or timer settings.
              </p>
            </section>

            {/* 4. Analytics */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                4. Website Analytics
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro currently uses Vercel Web Analytics to
                understand general website usage, such as page traffic and
                website performance.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Analytics helps us understand which pages are useful, identify
                technical problems and improve the website. Vercel describes
                its Web Analytics as privacy-focused and designed to avoid
                cross-site user tracking. Vercel's own privacy practices apply
                to the information processed by its service.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                For more information, please review Vercel's privacy notice.
              </p>

              <a
                href="https://vercel.com/legal/privacy-notice"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:text-base"
              >
                Vercel Privacy Notice →
              </a>
            </section>

            {/* 5. Advertising */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                5. Advertising and Google AdSense
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro may display advertisements through Google
                AdSense.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Google and its advertising partners may use cookies or similar
                technologies to serve, measure and improve advertisements.
                Depending on applicable settings, advertisements may be
                personalized based on information such as previous visits or
                browsing activity.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Google requires publishers using AdSense to explain the use of
                advertising cookies in their privacy policy. Google also
                provides users with controls for personalized advertising.
              </p>

              <div className="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-4">
                <p className="text-xs leading-5 text-indigo-900 sm:text-sm sm:leading-6">
                  You can review or change Google's advertising preferences
                  through Google Ads Settings.
                </p>

                <a
                  href="https://adssettings.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-sm font-semibold text-indigo-700 hover:text-indigo-900 sm:text-base"
                >
                  Google Ads Settings →
                </a>
              </div>

              <p className="mt-4 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                Google AdSense and its partners may process information
                according to their own privacy policies and applicable
                settings. We do not control the information practices of
                third-party advertising providers.
              </p>
            </section>

            {/* 6. Cookies */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                6. Cookies and Similar Technologies
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro itself does not require cookies for user
                registration because the website does not use an account
                system.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                However, third-party services such as advertising providers
                may use cookies or similar technologies when their services
                are loaded on the website.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                You can manage cookies through your browser settings. Blocking
                certain cookies may affect advertising or some website
                functionality.
              </p>
            </section>

            {/* 7. How Information Is Used */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                7. How Information Is Used
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 leading-6 sm:pl-6 sm:text-base sm:leading-7">
                <li>To provide and operate TimeCounterPro tools.</li>
                <li>To remember selected browser-based preferences.</li>
                <li>To understand general website traffic and performance.</li>
                <li>To identify and fix technical problems.</li>
                <li>To respond to messages sent to our contact email.</li>
                <li>To display and measure advertising where applicable.</li>
                <li>To improve the website and its content.</li>
              </ul>
            </section>

            {/* 8. Third-Party Services */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                8. Third-Party Services
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro may rely on third-party infrastructure and
                services to operate the website, including hosting, analytics,
                advertising and externally hosted web resources.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                These third parties may process technical information according
                to their own policies. Examples include Vercel for hosting and
                analytics and Google for advertising services.
              </p>
            </section>

            {/* 9. Data Security */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                9. Data Security
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                We take reasonable steps to maintain the security and
                reliability of the website. However, no website or internet
                transmission can be guaranteed to be completely secure.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Users are responsible for maintaining the security of their
                own devices, browsers and email accounts.
              </p>
            </section>

            {/* 10. Children's Privacy */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                10. Children's Privacy
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                TimeCounterPro is a general-purpose website and is not
                specifically directed at collecting personal information from
                children.
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                Because normal timer use does not require an account, users can
                use the core tools without submitting personal information.
              </p>
            </section>

            {/* 11. Your Choices */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                11. Your Choices
              </h2>

              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600 leading-6 sm:pl-6 sm:text-base sm:leading-7">
                <li>You can choose whether to use the website.</li>
                <li>You can clear browser storage through your browser.</li>
                <li>You can manage cookies through browser settings.</li>
                <li>You can manage Google's personalized advertising settings.</li>
                <li>You can contact us about privacy-related questions.</li>
              </ul>
            </section>

            {/* 12. Changes */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                12. Changes to This Privacy Policy
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                We may update this Privacy Policy when the website,
                technologies or legal requirements change. The updated version
                will be posted on this page with a revised update date.
              </p>
            </section>

            {/* 13. Contact */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl lg:text-2xl">
                13. Contact Us
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
                If you have a question about this Privacy Policy or the way
                TimeCounterPro handles information, contact us at:
              </p>

              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-3 inline-block break-all text-sm font-semibold text-indigo-600 hover:text-indigo-700 sm:text-base"
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

export default PrivacyPolicy;