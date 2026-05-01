import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ingredients")({
  component: IngredientsPage,
});

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Leaf, Shield, FlaskConical, AlertTriangle } from "lucide-react";

// Sample ingredients data - in production, this would come from Supabase
const ingredients = [
  {
    id: "1",
    name: "Hyaluronic Acid",
    slug: "hyaluronic-acid",
    description:
      "A powerful humectant that draws moisture into the skin, providing intense hydration and a plumping effect.",
    benefits: [
      "Intense hydration",
      "Plumping effect",
      "Reduces fine lines",
      "Suitable for all skin types",
    ],
    origin: "Synthetic/Plant-derived",
    safety: "Generally safe for all skin types",
    category: "Hydration",
  },
  {
    id: "2",
    name: "Vitamin C (Ascorbic Acid)",
    slug: "vitamin-c",
    description:
      "A powerful antioxidant that brightens the skin, evens tone, and protects against environmental damage.",
    benefits: ["Brightening", "Anti-aging", "Sun damage protection", "Collagen boost"],
    origin: "Synthetic",
    safety: "May cause irritation in high concentrations",
    category: "Antioxidant",
  },
  {
    id: "3",
    name: "Niacinamide",
    slug: "niacinamide",
    description:
      "Vitamin B3 that strengthens the skin barrier, regulates oil production, and evens skin tone.",
    benefits: ["Minimizes pores", "Regulates oil", "Evens tone", "Strengthens barrier"],
    origin: "Synthetic",
    safety: "Generally safe, well-tolerated",
    category: "Vitamin",
  },
  {
    id: "4",
    name: "Retinol",
    slug: "retinol",
    description:
      "A gold-standard anti-aging ingredient that increases cell turnover and stimulates collagen production.",
    benefits: ["Reduces fine lines", "Improves texture", "Fades dark spots", "Anti-aging"],
    origin: "Synthetic",
    safety: "May cause initial purging, use SPF",
    category: "Retinoid",
  },
  {
    id: "5",
    name: "Peptides",
    slug: "peptides",
    description:
      "Amino acid chains that signal the skin to produce more collagen, improving firmness and elasticity.",
    benefits: ["Firming", "Anti-aging", "Skin repair", "Reduces wrinkles"],
    origin: "Synthetic",
    safety: "Generally safe for all skin types",
    category: "Peptides",
  },
  {
    id: "6",
    name: "Ceramides",
    slug: "ceramides",
    description:
      "Skin-identical lipids that strengthen the moisture barrier and prevent water loss.",
    benefits: ["Moisture retention", "Barrier repair", "Soothes dry skin", "Anti-aging"],
    origin: "Synthetic/Plant-derived",
    safety: "Excellent safety profile",
    category: "Lipids",
  },
  {
    id: "7",
    name: "Salicylic Acid",
    slug: "salicylic-acid",
    description: "A beta-hydroxy acid that penetrates pores to exfoliate and clear congestion.",
    benefits: ["Unclogs pores", "Reduces breakouts", "Exfoliates", "Controls oil"],
    origin: "Synthetic/Willow bark",
    safety: "May dry out sensitive skin",
    category: "Exfoliant",
  },
  {
    id: "8",
    name: "Glycolic Acid",
    slug: "glycolic-acid",
    description:
      "An alpha-hydroxy acid that gently exfoliates the skin surface for a brighter, smoother complexion.",
    benefits: ["Brightening", "Texture improvement", "Evens tone", "Reduces scars"],
    origin: "Sugar cane",
    safety: "Use SPF, may cause sensitivity",
    category: "Exfoliant",
  },
  {
    id: "9",
    name: "Squalane",
    slug: "squalane",
    description:
      "A lightweight oil that mimics the skin's natural sebum, providing hydration without clogging pores.",
    benefits: ["Lightweight hydration", "Non-comedogenic", "Softens skin", "Antioxidant"],
    origin: "Plant-derived (olive/sugarcane)",
    safety: "Excellent safety profile",
    category: "Oil",
  },
  {
    id: "10",
    name: "Centella Asiatica",
    slug: "centella-asiatica",
    description:
      "Also known as Cica, this herb soothes irritation, reduces redness, and supports skin healing.",
    benefits: ["Soothes irritation", "Reduces redness", "Wound healing", "Anti-inflammatory"],
    origin: "Plant (Gotu Kola)",
    safety: "Very safe, suitable for sensitive skin",
    category: "Botanical",
  },
];

const categories = [
  "All",
  "Hydration",
  "Antioxidant",
  "Vitamin",
  "Retinoid",
  "Peptides",
  "Lipids",
  "Exfoliant",
  "Oil",
  "Botanical",
];

export function IngredientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIngredients = ingredients.filter((ingredient) => {
    const matchesSearch =
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ingredient.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || ingredient.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Hydration":
        return <Leaf className="h-5 w-5" />;
      case "Antioxidant":
        return <Shield className="h-5 w-5" />;
      case "Exfoliant":
        return <FlaskConical className="h-5 w-5" />;
      default:
        return <Leaf className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Our Ingredients
            </h1>
            <p className="text-lg text-muted">
              We believe in transparent labeling. Every ingredient is chosen for its efficacy and
              safety. Learn about the science behind our formulations.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-8 border-b border-border">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
              <Input
                placeholder="Search ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Ingredients Grid */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIngredients.map((ingredient) => (
              <Card key={ingredient.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getCategoryIcon(ingredient.category)}
                      </div>
                      <Badge variant="secondary">{ingredient.category}</Badge>
                    </div>
                  </div>
                  <CardTitle className="font-playfair text-xl mt-3">{ingredient.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted mb-4">{ingredient.description}</p>

                  {/* Benefits */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Benefits</h4>
                    <ul className="space-y-1">
                      {ingredient.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-muted flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-accent" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Origin & Safety */}
                  <div className="flex gap-4 text-xs text-muted">
                    <div className="flex items-center gap-1">
                      <Leaf className="h-3 w-3" />
                      {ingredient.origin}
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {ingredient.safety}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredIngredients.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted">No ingredients found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-playfair text-2xl font-semibold mb-4">
              Have Questions About Our Ingredients?
            </h2>
            <p className="text-muted mb-6">
              Our team of cosmetic chemists is here to help. Contact us for more information about
              any of our ingredients.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors"
            >
              Contact Our Team
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default IngredientsPage;
