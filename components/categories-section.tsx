'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const categories = [
  {
    id: 'ropa',
    name: 'Ropa',
    description: 'Vestidos, blusas, faldas y más',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop',
    count: 150
  },
  {
    id: 'calzado',
    name: 'Calzado',
    description: 'Tacones, flats, deportivas',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&h=800&fit=crop',
    count: 80
  },
  {
    id: 'accesorios',
    name: 'Accesorios',
    description: 'Bolsos, joyería, complementos',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=800&fit=crop',
    count: 120
  }
];

export function CategoriesSection() {
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
            Explora
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-balance">
            Nuestras categorías
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Encuentra todo lo que necesitas para expresar tu estilo único
          </p>
        </motion.div>

        {/* Categories grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
            >
              <Link href={`/catalogo?categoria=${category.id}`}>
                <div className="group relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden cursor-pointer">
                  {/* Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end">
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.2 }}
                    >
                      <span className="text-sm text-background/80">
                        {category.count} productos
                      </span>
                      <h3 className="text-2xl md:text-3xl font-serif font-bold text-background mt-1">
                        {category.name}
                      </h3>
                      <p className="text-background/80 mt-2">
                        {category.description}
                      </p>
                      <div className="mt-4 flex items-center gap-2 text-background group-hover:gap-4 transition-all">
                        <span className="font-medium">Explorar</span>
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
