'use client';

import { motion } from 'framer-motion';
import { products } from '@/lib/store';
import { ProductCard } from './product-card';

export function NewArrivals() {
  const newProducts = products.filter(p => p.isNew).slice(0, 4);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Recién llegados
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-balance">
            Lo más nuevo
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Las últimas tendencias que acaban de llegar a nuestra tienda
          </p>
        </motion.div>

        {/* Products grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {newProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
