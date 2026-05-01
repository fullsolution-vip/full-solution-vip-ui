import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  component: CategoriesPage,
});

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";

// Sample categories data - in production, this would come from Supabase
const categories = [
  {
    id: "1",
    name: "Skincare",
    slug: "skincare",
    description: "Cleansers, moisturizers, serums, and treatments for every skin type",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&q=80",
    productCount: 24,
    featured: true,
  },
  {
    id: "2",
    name: "Haircare",
    slug: "haircare",
    description: "Shampoos, conditioners, treatments, and styling products",
    image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=800&q=80",
    productCount: 18,
    featured: true,
  },
  {
    id: "3",
    name: "Body Care",
    slug: "body-care",
    description: "Body lotions, creams, oils, and scrubs for total body care",
    image: "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&q=80",
    productCount: 15,
    featured: false,
  },
  {
    id: "4",
    name: "Sun Care",
    slug: "sun-care",
    description: "Sunscreens and after-sun products for UV protection",
    image: "https://images.unsplash.com/photo-1571875257727-256c39da42af?w=800&q=80",
    productCount: 8,
    featured: false,
  },
  {
    id: "5",
    name: "Anti-Aging",
    slug: "anti-aging",
    description: "Premium formulations targeting fine lines and wrinkles",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&q=80",
    productCount: 12,
    featured: true,
  },
  {
    id: "6",
    name: "Sensitive Skin",
    slug: "sensitive-skin",
    description: "Gentle, hypoallergenic products for reactive skin",
    image: "https://images.unsplash.com/photo-1512291313931-d4291048e7b6?w=800&q=80",
    productCount: 10,
    featured: false,
  },
  {
    id: "7",
    name: "Men's Grooming",
    slug: "mens-grooming",
    description: "Skincare and grooming products specifically for men",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
    productCount: 14,
    featured: false,
  },
  {
    id: "8",
    name: "Beauty Sets",
    slug: "beauty-sets",
    description: "Gift sets and value bundles for every occasion",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    productCount: 6,
    featured: false,
  },
];

export function CategoriesPage() {
  const featuredCategories = categories.filter((c) => c.featured);
  const regularCategories = categories.filter((c) => !c.featured);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-primary/5">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
              Product Categories
            </h1>
            <p className="text-lg text-muted">
              Explore our complete range of beauty and personal care products. From skincare to
              haircare, find everything you need for your beauty routine.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container px-4">
          <h2 className="font-playfair text-2xl font-semibold mb-6">Featured Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCategories.map((category) => (
              <a key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-playfair text-xl font-semibold">{category.name}</h3>
                      <p className="text-sm text-white/80">{category.productCount} products</p>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted">{category.description}</p>
                    <div className="flex items-center gap-1 mt-3 text-primary text-sm font-medium group-hover:underline">
                      Shop now <ArrowRight className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="container px-4">
          <h2 className="font-playfair text-2xl font-semibold mb-6">All Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <a key={category.id} href={`/products?category=${category.slug}`}>
                <Card className="group hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-medium group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted">{category.productCount} products</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Category Stats */}
      <section className="py-12">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-primary mb-1">
                {categories.length}
              </div>
              <div className="text-sm text-muted">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-primary mb-1">
                {categories.reduce((acc, c) => acc + c.productCount, 0)}
              </div>
              <div className="text-sm text-muted">Products</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-primary mb-1">100%</div>
              <div className="text-sm text-muted">Cruelty-Free</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-playfair font-bold text-primary mb-1">SA</div>
              <div className="text-sm text-muted">Made in South Africa</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-playfair text-2xl font-semibold mb-4">
              Can't Find What You're Looking For?
            </h2>
            <p className="text-white/80 mb-6">
              Our team is here to help. Contact us for personalized recommendations.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-primary rounded-md font-medium hover:bg-white/90 transition-colors"
              >
                Contact Us
              </Link>
              <Link
                to="/wholesale"
                className="inline-flex items-center justify-center px-6 py-3 border border-white text-white rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                Wholesale Inquiries
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CategoriesPage;
