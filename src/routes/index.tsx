import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  FlaskConical,
  Package,
  Globe2,
  ShieldCheck,
  Leaf,
} from "lucide-react";
import heroImage from "@/assets/hero-products.jpg";
import labImage from "@/assets/science-lab.jpg";
import rangeImage from "@/assets/product-range.jpg";
import { StockistMarquee } from "@/components/site/Marquee";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Full Solution — Beauty & Personal Care, Built for Retail" },
      {
        name: "description",
        content:
          "From dermatologist-led formulation to retail-ready packaging. Full Solution partners with leading retailers to deliver beauty products consumers trust.",
      },
      { property: "og:title", content: "Full Solution — Beauty & Personal Care, Built for Retail" },
      {
        property: "og:description",
        content:
          "Dermatologist-led formulation, local manufacturing, retail-ready packaging — under one roof.",
      },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-warm" aria-hidden />
        <div
          className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(circle_at_1px_1px,_var(--ink)_1px,_transparent_0)] [background-size:24px_24px]"
          aria-hidden
        />

        <div className="container-page relative grid lg:grid-cols-12 gap-10 lg:gap-16 pt-16 pb-20 lg:py-28 items-center">
          <div className="lg:col-span-6 animate-fade-up">
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="size-3 text-gold" /> Beauty · Personal Care · Wholesale
            </p>
            <h1 className="mt-5 font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.02]">
              Beauty, <span className="italic text-gold-gradient">scientifically</span> made for
              retail.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              We formulate, manufacture and package premium beauty products locally — guided by
              dermatologists, chemists and academics — and deliver them shelf-ready to retailers
              consumers trust.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                to="/wholesale"
                className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition"
              >
                Partner with us
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 backdrop-blur px-7 py-3.5 text-sm font-medium hover:bg-card transition"
              >
                Explore the range
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-md">
              {[
                { k: "150+", v: "SKUs in production" },
                { k: "12", v: "Retail partners" },
                { k: "100%", v: "Locally made" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-serif text-3xl text-gold-gradient">{s.k}</dt>
                  <dd className="mt-1 text-xs text-muted-foreground leading-snug">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative animate-float">
              <div
                className="absolute -inset-8 gradient-gold opacity-25 blur-3xl rounded-full"
                aria-hidden
              />
              <img
                src={heroImage}
                alt="Premium serum and cream from the Full Solution beauty range"
                width={1600}
                height={1200}
                className="relative rounded-3xl shadow-elegant w-full h-auto object-cover aspect-[4/3]"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden md:block bg-card border border-border rounded-2xl px-5 py-4 shadow-soft max-w-[220px]">
              <p className="eyebrow">Formulated by</p>
              <p className="mt-1 font-serif text-lg leading-tight">
                Dermatologists & cosmetic scientists
              </p>
            </div>
          </div>
        </div>
      </section>

      <StockistMarquee />

      {/* PILLARS */}
      <section className="container-page py-24 lg:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow">What we do</p>
          <h2 className="mt-4 font-serif text-4xl md:text-5xl">
            One partner, the entire pipeline.
          </h2>
          <p className="mt-5 text-muted-foreground leading-relaxed">
            We compress the distance between the lab bench and the retail shelf — so our partners
            can launch beauty lines faster, with fewer suppliers and no quality compromise.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              i: FlaskConical,
              t: "Formulate",
              d: "Skin-doctor-led R&D, evidence-based actives, stability-tested.",
            },
            {
              i: Leaf,
              t: "Source",
              d: "Locally and globally sourced ingredients with full traceability.",
            },
            {
              i: Package,
              t: "Manufacture",
              d: "ISO-aligned production lines for serums, creams, hair and body.",
            },
            {
              i: Globe2,
              t: "Deliver",
              d: "Retail-ready packaging shipped on time to every distribution centre.",
            },
          ].map(({ i: Icon, t, d }) => (
            <div
              key={t}
              className="group relative rounded-2xl border border-border bg-card p-7 hover:shadow-elegant transition-shadow"
            >
              <div className="size-11 rounded-xl gradient-gold flex items-center justify-center mb-5">
                <Icon className="size-5 text-gold-foreground" />
              </div>
              <h3 className="font-serif text-2xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SCIENCE STRIP */}
      <section className="bg-secondary/50 border-y border-border/60">
        <div className="container-page py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div>
            <img
              src={labImage}
              alt="Cosmetic chemist evaluating a serum sample in the Full Solution lab"
              width={1400}
              height={1000}
              loading="lazy"
              className="rounded-3xl w-full h-auto object-cover aspect-[4/3] shadow-elegant"
            />
          </div>
          <div>
            <p className="eyebrow">The science</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl leading-[1.05]">
              Backed by skin doctors, professors and cosmetic scientists.
            </h2>
            <p className="mt-6 text-muted-foreground leading-relaxed">
              Every Full Solution formula is built on peer-reviewed actives and validated in our
              in-house laboratory. We collaborate with dermatologists and university researchers to
              ensure each product is safe, effective, and ready to earn shelf-space at the world's
              most discerning retailers.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Clinical-grade actives at consumer-friendly price points",
                "Microbial, stability and patch-tested in-house",
                "Full INCI and regulatory documentation per market",
              ].map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <ShieldCheck className="size-4 mt-0.5 text-gold shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <Link
              to="/science"
              className="mt-9 inline-flex items-center gap-2 text-sm font-medium border-b border-foreground pb-1 hover:gap-3 transition-all"
            >
              Inside our laboratory <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-page py-24 lg:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-xl">
            <p className="eyebrow">The range</p>
            <h2 className="mt-4 font-serif text-4xl md:text-5xl">
              Categories built for the modern retail floor.
            </h2>
          </div>
          <Link
            to="/products"
            className="text-sm font-medium border-b border-foreground pb-1 self-start"
          >
            View all categories →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { t: "Skincare", d: "Serums, moisturisers, cleansers and treatments." },
            { t: "Haircare", d: "Shampoos, conditioners and scalp therapy." },
            { t: "Body & Bath", d: "Washes, lotions, scrubs and body oils." },
            { t: "Colour Cosmetics", d: "Lip, cheek and complexion essentials." },
            { t: "Men's Grooming", d: "Beard, shave and skin for him." },
            { t: "Private Label", d: "Your brand, our manufacturing expertise." },
          ].map((c, idx) => (
            <div
              key={c.t}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card aspect-[4/5] flex flex-col justify-end p-7"
            >
              <div
                className="absolute inset-0 gradient-warm opacity-90 group-hover:scale-105 transition-transform duration-700"
                aria-hidden
              />
              <div
                className="absolute inset-0 opacity-30 mix-blend-multiply group-hover:opacity-50 transition"
                style={{
                  background: idx % 2 ? `url(${rangeImage}) center/cover` : undefined,
                }}
                aria-hidden
              />
              <div className="relative">
                <p className="eyebrow">0{idx + 1}</p>
                <h3 className="mt-2 font-serif text-3xl">{c.t}</h3>
                <p className="mt-2 text-sm text-foreground/75 max-w-xs">{c.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="container-page pb-24 lg:pb-32">
        <figure className="relative rounded-3xl overflow-hidden border border-border bg-card p-10 md:p-16 text-center">
          <div className="absolute inset-0 gradient-gold opacity-10" aria-hidden />
          <div className="relative">
            <p className="eyebrow">Partner voices</p>
            <blockquote className="mt-6 font-serif text-2xl md:text-4xl leading-snug max-w-3xl mx-auto">
              "Full Solution has become the partner we measure others against — they own every stage
              from formulation to the pallet on our dock, and the quality never wavers."
            </blockquote>
            <figcaption className="mt-8 text-sm text-muted-foreground">
              — Buying Director, National Retail Group
            </figcaption>
          </div>
        </figure>
      </section>

      {/* CTA */}
      <section className="container-page pb-24 lg:pb-32">
        <div className="relative rounded-3xl overflow-hidden bg-primary text-primary-foreground p-10 md:p-16">
          <div
            className="absolute -top-40 -right-40 size-96 rounded-full gradient-gold opacity-30 blur-3xl"
            aria-hidden
          />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="eyebrow text-primary-foreground/60">Wholesale enquiries</p>
              <h2 className="mt-3 font-serif text-4xl md:text-5xl">
                Stock the next category-leading beauty line.
              </h2>
            </div>
            <div className="md:text-right">
              <p className="text-primary-foreground/75 max-w-md md:ml-auto">
                Request our trade catalogue with margins, MOQs, and ready-to-list product
                specifications.
              </p>
              <Link
                to="/wholesale"
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-gold text-gold-foreground px-7 py-3.5 text-sm font-medium hover:opacity-90 transition"
              >
                Open a wholesale account <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
