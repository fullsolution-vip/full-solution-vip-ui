import { createFileRoute } from "@tanstack/react-router";
import mfgImg from "@/assets/manufacturing.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Full Solution" },
      {
        name: "description",
        content:
          "Full Solution is a South African beauty and personal-care manufacturer building products for the world's leading retailers.",
      },
      { property: "og:title", content: "About — Full Solution" },
      {
        property: "og:description",
        content: "Our story, our people, and our manufacturing capability.",
      },
      { property: "og:image", content: mfgImg },
      { name: "twitter:image", content: mfgImg },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <section className="container-page py-20 md:py-28">
        <p className="eyebrow">About Full Solution</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl max-w-4xl leading-[1.02]">
          A new generation of African beauty,{" "}
          <span className="italic text-gold-gradient">made for the world</span>.
        </h1>
        <p className="mt-8 max-w-3xl text-lg text-muted-foreground leading-relaxed">
          Full Solution was founded with a simple conviction: the next great beauty brands would not
          come from licensing other people's formulas — they would come from owning the science, the
          supply chain and the shelf experience end to end. Today we partner with national
          retailers, boutique chains and challenger brands to bring that conviction to life.
        </p>
      </section>

      <section className="container-page pb-20">
        <img
          src={mfgImg}
          alt="Inside the Full Solution manufacturing and packaging facility"
          width={1400}
          height={1000}
          loading="lazy"
          className="rounded-3xl w-full h-auto aspect-[16/9] object-cover shadow-elegant"
        />
      </section>

      <section className="container-page py-20 grid lg:grid-cols-3 gap-10">
        {[
          {
            t: "Locally rooted",
            d: "Designed, formulated and manufactured in South Africa, employing scientists, technicians and packaging specialists.",
          },
          {
            t: "Globally minded",
            d: "Built to international cosmetic GMP standards, with documentation ready for export markets across Africa and beyond.",
          },
          {
            t: "Retailer obsessed",
            d: "Every decision — formula, packaging, palletisation — is designed to make life easier for the buyers we serve.",
          },
        ].map((v) => (
          <div key={v.t}>
            <h3 className="font-serif text-3xl">{v.t}</h3>
            <p className="mt-3 text-muted-foreground leading-relaxed">{v.d}</p>
          </div>
        ))}
      </section>

      <section className="container-page py-20">
        <div className="rounded-3xl bg-secondary/50 border border-border p-10 md:p-16 grid md:grid-cols-3 gap-10 text-center">
          {[
            { k: "10+ yrs", v: "Combined R&D experience" },
            { k: "ISO 22716", v: "Cosmetic GMP aligned" },
            { k: "B-BBEE", v: "Level-compliant supplier" },
          ].map((s) => (
            <div key={s.v}>
              <p className="font-serif text-5xl text-gold-gradient">{s.k}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
