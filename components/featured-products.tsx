'use client';

import { motion } from 'framer-motion';
import { products } from '@/lib/store';
import { ProductCard } from './product-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function FeaturedProducts() {
  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
        >
          <div>
            <span className="text-sm font-medium text-primary uppercase tracking-wider">
              Lo más destacado
            </span>
            <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-balance">
              Productos destacados
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl">
              Nuestra selección de piezas favoritas de la temporada
            </p>
          </div>
          <Button variant="outline" className="mt-4 md:mt-0" asChild>
            <Link href="/catalogo">
              Ver todo el catálogo
            </Link>
          </Button>
        </motion.div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
