import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Full Solution" },
      {
        name: "description",
        content:
          "Get in touch with Full Solution about wholesale, private label and contract manufacturing.",
      },
      { property: "og:title", content: "Contact — Full Solution" },
      { property: "og:description", content: "Speak with our wholesale team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <section className="container-page py-20 md:py-28 grid lg:grid-cols-2 gap-16">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 font-serif text-5xl md:text-6xl leading-[1.05]">
          Let's build the next <span className="italic text-gold-gradient">shelf hero</span>{" "}
          together.
        </h1>
        <p className="mt-6 text-muted-foreground leading-relaxed">
          Our wholesale team responds to every enquiry within one business day.
        </p>

        <div className="mt-10 space-y-5">
          {[
            { i: Mail, l: "Email", v: "robbie@fullsolution.vip" },
            { i: Phone, l: "Phone", v: "068 707 4080" },
            { i: Clock, l: "Business Hours", v: "Mon-Fri: 9AM-6PM SAST" },
            { i: MapPin, l: "Location", v: "Northridge Costal Estate, Cape Farms, 7441" },
          ].map(({ i: Icon, l, v }) => (
            <div key={l} className="flex items-start gap-4">
              <div className="size-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                <Icon className="size-4 text-gold" />
              </div>
              <div>
                <p className="eyebrow">{l}</p>
                <p className="mt-1">{v}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 p-6 rounded-2xl bg-secondary/50 border border-border">
          <p className="font-medium">Lead Contact</p>
          <p className="text-muted-foreground mt-1">Robbie Setton</p>
        </div>
      </div>

      <ContactForm />
    </section>
  );
}
