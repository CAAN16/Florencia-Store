'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function PromoSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden bg-secondary">
          <div className="grid lg:grid-cols-2 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 lg:p-16"
            >
              <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                Oferta especial
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight text-balance">
                Hasta 40% de descuento
              </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-md">
                En toda la colección de temporada. Renueva tu guardarropa con las mejores prendas al mejor precio.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Button size="lg" className="group" asChild>
                  <Link href="/ofertas">
                    Comprar ahora
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Countdown mock */}
              <div className="mt-8 flex gap-4">
                {[
                  { value: '03', label: 'Días' },
                  { value: '12', label: 'Horas' },
                  { value: '45', label: 'Min' },
                  { value: '22', label: 'Seg' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-14 h-14 bg-card rounded-xl flex items-center justify-center shadow-sm">
                      <span className="text-xl font-bold font-serif">{item.value}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-1 block">{item.label}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative h-80 lg:h-full lg:absolute lg:right-0 lg:w-1/2"
            >
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=600&fit=crop"
                alt="Oferta especial"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-secondary via-transparent to-transparent lg:from-secondary lg:via-secondary/50 lg:to-transparent" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
