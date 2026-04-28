import { createFileRoute } from "@tanstack/react-router";
import productImg from "@/assets/product-range.jpg";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products — Full Solution Beauty Range" },
      {
        name: "description",
        content:
          "Skincare, haircare, body, cosmetics and grooming products formulated and manufactured for retail partners.",
      },
      { property: "og:title", content: "Products — Full Solution Beauty Range" },
      {
        property: "og:description",
        content: "Explore the Full Solution beauty range, ready for retail.",
      },
      { property: "og:image", content: productImg },
      { name: "twitter:image", content: productImg },
    ],
  }),
  component: ProductsPage,
});

const categories = [
  {
    name: "Advanced Skincare",
    items: [
      { n: "Vitamin C Brightening Serum", a: "10% L-Ascorbic Acid", t: "30ml" },
      { n: "Hyaluronic Hydration Drops", a: "Triple-weight HA", t: "30ml" },
      { n: "Retinol Renewal Night Cream", a: "0.3% Encapsulated Retinol", t: "50ml" },
      { n: "Niacinamide Pore Refiner", a: "10% Niacinamide", t: "30ml" },
      { n: "Ceramide Barrier Moisturiser", a: "Ceramide complex", t: "50ml" },
      { n: "Gentle Foaming Cleanser", a: "pH 5.5", t: "150ml" },
    ],
  },
  {
    name: "Haircare",
    items: [
      { n: "Keratin Repair Shampoo", a: "Hydrolysed keratin", t: "300ml" },
      { n: "Argan Smoothing Conditioner", a: "Cold-pressed argan", t: "300ml" },
      { n: "Scalp Detox Treatment", a: "Salicylic + tea tree", t: "200ml" },
      { n: "Heat-Defence Hair Oil", a: "Up to 230°C", t: "100ml" },
    ],
  },
  {
    name: "Body & Bath",
    items: [
      { n: "Shea Body Butter", a: "Unrefined shea", t: "200ml" },
      { n: "Salt Glow Body Polish", a: "Himalayan salt", t: "250ml" },
      { n: "Marula Body Oil", a: "Cold-pressed marula", t: "100ml" },
      { n: "Hydrating Body Wash", a: "Sulphate-free", t: "400ml" },
    ],
  },
  {
    name: "Colour Cosmetics",
    items: [
      { n: "Velvet Matte Lipstick", a: "12 shades", t: "3.5g" },
      { n: "Glow Liquid Highlighter", a: "4 shades", t: "15ml" },
      { n: "Skin Tint SPF 30", a: "10 shades", t: "30ml" },
    ],
  },
  {
    name: "Men's Grooming",
    items: [
      { n: "Beard Conditioning Oil", a: "Jojoba blend", t: "30ml" },
      { n: "Cooling Aftershave Balm", a: "Menthol + aloe", t: "100ml" },
      { n: "Charcoal Face Wash", a: "Activated charcoal", t: "150ml" },
    ],
  },
];

function ProductsPage() {
  return (
    <>
      <section className="container-page py-20 md:py-28">
        <p className="eyebrow">The catalogue</p>
        <h1 className="mt-4 font-serif text-5xl md:text-7xl max-w-4xl leading-[1.02]">
          A complete beauty portfolio,{" "}
          <span className="italic text-gold-gradient">retail-ready</span>.
        </h1>
        <p className="mt-6 max-w-2xl text-muted-foreground leading-relaxed">
          Every product below is formulated in our laboratory, manufactured on our lines, and
          packaged for direct delivery to your distribution centre. Custom MOQs, private label and
          contract manufacturing available.
        </p>
      </section>

      <section className="container-page space-y-20 pb-24">
        {categories.map((cat) => (
          <div key={cat.name}>
            <div className="flex items-end justify-between border-b border-border pb-4 mb-8">
              <h2 className="font-serif text-3xl md:text-4xl">{cat.name}</h2>
              <span className="eyebrow">{cat.items.length} SKUs</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.items.map((p, i) => (
                <article
                  key={p.n}
                  className="group rounded-2xl border border-border bg-card p-6 hover:shadow-soft transition"
                >
                  <div className="aspect-square rounded-xl gradient-warm relative overflow-hidden mb-5">
                    <div
                      className="absolute inset-0 opacity-60 group-hover:scale-105 transition-transform duration-700"
                      style={{ background: `url(${productImg}) center/cover` }}
                      aria-hidden
                    />
                    <span className="absolute top-3 left-3 text-[10px] tracking-[0.2em] uppercase bg-card/80 backdrop-blur px-2.5 py-1 rounded-full">
                      0{i + 1}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl leading-tight">{p.n}</h3>
                  <p className="mt-1.5 text-xs text-muted-foreground">{p.a}</p>
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{p.t}</span>
                    <span className="text-gold font-medium">Wholesale →</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
