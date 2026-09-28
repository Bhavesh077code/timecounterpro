import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

const SITE_URL = "https://timecounterpro.com";
const CONTACT_EMAIL = "timecounterpro@gmail.com";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const subject = encodeURIComponent(
      formData.subject || "TimeCounterPro Contact"
    );

    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`
    );

    window.location.href =
      `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    setSubmitted(true);
  };

  return (
    <>
      <Helmet>
        <title>Contact TimeCounterPro | Support & Feedback</title>

        <meta
          name="description"
          content="Contact TimeCounterPro for questions, feedback, bug reports, feature suggestions or website-related concerns."
        />

        <link
          rel="canonical"
          href={`${SITE_URL}/contact`}
        />

        <meta name="robots" content="index,follow" />
      </Helmet>

      <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <header className="mb-10 text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              Support & Feedback
            </p>

            <h1 className="mt-2 text-4xl font-bold text-slate-900">
              Contact TimeCounterPro
            </h1>

            <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-600">
              Have a question, found a bug, or have an idea for improving
              TimeCounterPro? Send us a message and we will review it.
            </p>
          </header>

          <div className="grid gap-6 md:grid-cols-5">

            <section className="md:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-xl font-bold text-slate-900">
                  Get in touch
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  The easiest way to contact TimeCounterPro is by email.
                </p>

                <div className="mt-6 rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email
                  </p>

                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="mt-2 block break-all font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold text-slate-900">
                    What you can contact us about
                  </h3>

                  <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600">
                    <li>Bug reports</li>
                    <li>Feature suggestions</li>
                    <li>Problems with a timer</li>
                    <li>Questions about the website</li>
                    <li>Privacy questions</li>
                    <li>Content or technical corrections</li>
                  </ul>
                </div>

              </div>
            </section>

            <section className="md:col-span-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-xl font-bold text-slate-900">
                  Send a message
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Submitting this form opens your default email application.
                  The website does not send this form to a separate server.
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-6 space-y-5"
                >

                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Your name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      autoComplete="name"
                      placeholder="Your name"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Your email
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Subject
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Message
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={7}
                      placeholder="Tell us what happened or what you would like to suggest..."
                      className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  >
                    Open Email
                  </button>

                  {submitted && (
                    <p className="rounded-xl bg-emerald-50 p-3 text-sm leading-6 text-emerald-700">
                      Your email application should open with the message
                      prepared for TimeCounterPro.
                    </p>
                  )}

                </form>

              </div>
            </section>

          </div>
        </div>
      </main>
    </>
  );
}

export default Contact;