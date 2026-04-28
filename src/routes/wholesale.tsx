import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

export const Route = createFileRoute("/wholesale")({
  head: () => ({
    meta: [
      { title: "Wholesale & Private Label — Full Solution" },
      {
        name: "description",
        content:
          "Open a wholesale account or commission a private-label beauty range with Full Solution.",
      },
      { property: "og:title", content: "Wholesale & Private Label — Full Solution" },
      {
        property: "og:description",
        content: "Margins, MOQs and turnkey private label for retail partners.",
      },
    ],
  }),
  component: WholesalePage,
});

function WholesalePage() {
  return (
    <>
      <section className="container-page py-20 md:py-28">
        <p className="eyebrow">For retail buyers</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl max-w-4xl leading-[1.02]">
          Wholesale & <span className="italic text-gold-gradient">private label</span>, built around
          your category.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Whether you're listing our existing range or briefing a new line under your own brand, we
          structure every partnership for predictable margin and on-time delivery.
        </p>
      </section>

      <section className="container-page pb-20 grid lg:grid-cols-3 gap-5">
        {[
          {
            t: "Stockist",
            d: "List the Full Solution range in your stores.",
            f: [
              "Trade catalogue & price list",
              "Standard MOQs from 144 units",
              "Marketing assets included",
            ],
          },
          {
            t: "Private Label",
            d: "Our formulas, your brand identity.",
            f: ["Custom packaging design", "MOQs from 1,000 units", "Regulatory dossier included"],
            featured: true,
          },
          {
            t: "Bespoke Development",
            d: "A formula designed exclusively for you.",
            f: ["Dedicated R&D team", "Clinical claim support", "Multi-year supply agreement"],
          },
        ].map((p) => (
          <article
            key={p.t}
            className={
              "relative rounded-3xl p-8 border " +
              (p.featured
                ? "bg-primary text-primary-foreground border-primary shadow-elegant"
                : "bg-card border-border")
            }
          >
            {p.featured && (
              <span className="absolute top-5 right-5 text-[10px] tracking-[0.2em] uppercase bg-gold text-gold-foreground px-2.5 py-1 rounded-full">
                Most popular
              </span>
            )}
            <h2 className="font-serif text-3xl">{p.t}</h2>
            <p
              className={
                "mt-2 text-sm " +
                (p.featured ? "text-primary-foreground/70" : "text-muted-foreground")
              }
            >
              {p.d}
            </p>
            <ul className="mt-7 space-y-3 text-sm">
              {p.f.map((line) => (
                <li key={line} className="flex items-start gap-2.5">
                  <Check className="size-4 mt-0.5 text-gold shrink-0" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="container-page pb-24">
        <div className="rounded-3xl border border-border bg-card p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <p className="eyebrow">Request the trade pack</p>
              <h2 className="mt-3 font-serif text-4xl">Let's talk listings.</h2>
              <p className="mt-4 text-muted-foreground">
                Tell us a little about your business and we'll send our trade catalogue, margins,
                and a sample kit within 48 hours.
              </p>
            </div>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                alert("Thank you — we'll be in touch shortly.");
              }}
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Full name"
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
                <input
                  required
                  placeholder="Company"
                  className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
                />
              </div>
              <input
                required
                type="email"
                placeholder="Work email"
                className="w-full rounded-full border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <textarea
                rows={4}
                placeholder="Tell us about your category"
                className="w-full rounded-3xl border border-border bg-background px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
              />
              <button
                type="submit"
                className="w-full sm:w-auto rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition"
              >
                Request trade pack
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
