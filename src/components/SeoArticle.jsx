
/*
// src/components/SeoArticle.jsx
//
// Written guide + FAQ + related tools, rendered under every traffic page.
// Content lives in src/data/seoContent.js. This is real page content: it is
// visible to visitors and is also in the prerendered HTML for crawlers.
import React from "react";
import { Link } from "react-router-dom";
import AdSlot from "./AdSlot";
import { AD_SLOTS } from "../config/ads";
import { getRoute } from "../data/siteRoutes";
import { seoContent } from "../data/seoContent";

export default function SeoArticle({ path }) {
  const content = seoContent[path];
  const route = getRoute(path);
  if (!content || !route) return null;

  const related = (route.related || []).map(getRoute).filter(Boolean);

  return (
    <section className="bg-white border-t border-slate-200 text-slate-800">
      <article className="mx-auto max-w-3xl px-5 sm:px-6 py-12 sm:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-950">
          {content.heading}
        </h2>

        {content.sections.map((sec, i) => (
          <React.Fragment key={sec.h}>
            <div className="mt-8">
              <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{sec.h}</h3>
              {sec.p?.map((para, j) => (
                <p key={j} className="mt-3 text-[15px] sm:text-base leading-7 sm:leading-8 text-slate-600">
                  {para}
                </p>
              ))}
              {sec.list && (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-[15px] sm:text-base leading-7 text-slate-600">
                  {sec.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
            {i === 1 && <AdSlot slot={AD_SLOTS.inArticle} />}
          </React.Fragment>
        ))}

        <div className="mt-12">
          <h2 className="text-2xl font-bold tracking-tight text-slate-950">
            Frequently asked questions
          </h2>
          <dl className="mt-4 divide-y divide-slate-200">
            {content.faq.map((f) => (
              <div key={f.q} className="py-4">
                <dt className="font-semibold text-slate-900">{f.q}</dt>
                <dd className="mt-1.5 text-[15px] sm:text-base leading-7 text-slate-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        <AdSlot slot={AD_SLOTS.bottom} />

        {related.length > 0 && (
          <nav aria-label="Related timers" className="mt-12">
            <h2 className="text-xl font-bold text-slate-950">More free timers</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((r) => (
                <li key={r.path}>
                  <Link
                    to={r.path}
                    className="block rounded-lg border border-slate-200 p-4 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
                  >
                    <span className="font-semibold text-slate-900">{r.name}</span>
                    <span className="mt-1 block text-sm text-slate-500">
                      {r.description.split(". ")[0].replace(/\.$/, "")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </section>
  );
}

*/

