import { createFileRoute } from "@tanstack/react-router";
import { Microscope, GraduationCap, FlaskConical, Beaker } from "lucide-react";
import labImg from "@/assets/science-lab.jpg";

export const Route = createFileRoute("/science")({
  head: () => ({
    meta: [
      { title: "Our Science — Full Solution" },
      {
        name: "description",
        content:
          "Dermatologists, cosmetic chemists and academic researchers formulate every Full Solution product.",
      },
      { property: "og:title", content: "Our Science — Full Solution" },
      {
        property: "og:description",
        content: "Inside the lab where Full Solution products are made.",
      },
      { property: "og:image", content: labImg },
      { name: "twitter:image", content: labImg },
    ],
  }),
  component: SciencePage,
});

function SciencePage() {
  return (
    <>
      <section className="container-page py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="eyebrow">The laboratory</p>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl leading-[1.05]">
            Where <span className="italic text-gold-gradient">dermatology</span> meets the retail
            shelf.
          </h1>
          <p className="mt-6 text-muted-foreground leading-relaxed">
            Full Solution operates a dedicated cosmetic R&D facility staffed by licensed
            dermatologists, university-trained cosmetic chemists and visiting academic researchers.
            Every brief — whether private label or in-house — is treated as a clinical project from
            concept to certificate of analysis.
          </p>
        </div>
        <img
          src={labImg}
          alt="Inside the Full Solution research and development laboratory"
          width={1400}
          height={1000}
          loading="lazy"
          className="rounded-3xl w-full h-auto aspect-[4/3] object-cover shadow-elegant"
        />
      </section>

      <section className="container-page py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              i: Microscope,
              t: "Clinical evaluation",
              d: "Patch testing, irritation profiling and consumer panels.",
            },
            {
              i: GraduationCap,
              t: "Academic partners",
              d: "Collaborations with leading university chemistry departments.",
            },
            {
              i: FlaskConical,
              t: "Active sourcing",
              d: "Pharmaceutical-grade raw materials, fully traceable.",
            },
            {
              i: Beaker,
              t: "Stability testing",
              d: "Accelerated and real-time stability across climate zones.",
            },
          ].map(({ i: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-7">
              <Icon className="size-5 text-gold mb-5" />
              <h3 className="font-serif text-xl">{t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-20">
        <h2 className="font-serif text-4xl md:text-5xl max-w-3xl">
          From brief to bottle in 90 days.
        </h2>
        <ol className="mt-12 grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { t: "Brief & benchmark", d: "Define target consumer, claim and price." },
            { t: "Formulate", d: "Bench prototypes by qualified cosmetic chemists." },
            { t: "Validate", d: "Stability, microbial, dermatological testing." },
            { t: "Pilot batch", d: "Scale-up production trial and QA sign-off." },
            { t: "Launch", d: "Filled, labelled and shipped to your DC." },
          ].map((s, i) => (
            <li key={s.t} className="relative rounded-2xl border border-border bg-card p-6">
              <span className="font-serif text-5xl text-gold-gradient">{i + 1}</span>
              <h3 className="mt-3 font-serif text-xl">{s.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
