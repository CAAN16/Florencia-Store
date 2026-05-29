'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const audiences = [
  {
    id: 'niñas',
    name: 'Niñas',
    age: '2-12 años',
    description: 'Ropa adorable y cómoda para las pequeñas princesas de la casa',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=400&fit=crop',
    color: 'from-pink-200/50'
  },
  {
    id: 'jovenes',
    name: 'Jóvenes',
    age: '13-25 años',
    description: 'Tendencias actuales y estilos únicos para expresar tu personalidad',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=400&fit=crop',
    color: 'from-rose-200/50'
  },
  {
    id: 'mujeres',
    name: 'Mujeres',
    age: '26+ años',
    description: 'Elegancia sofisticada para la mujer moderna y empoderada',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=400&fit=crop',
    color: 'from-amber-200/50'
  }
];

export function AudienceSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Para todas
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-balance">
            Moda para cada edad
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Colecciones diseñadas especialmente para cada etapa de la vida
          </p>
        </motion.div>

        {/* Audience cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <motion.div
              key={audience.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="group"
            >
              <div className="relative bg-card rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={audience.image}
                    alt={audience.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${audience.color} to-transparent`} />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-2xl font-serif font-bold">{audience.name}</h3>
                    <span className="px-2 py-1 text-xs font-medium bg-secondary rounded-full">
                      {audience.age}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {audience.description}
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 p-0 h-auto font-medium group/btn"
                    asChild
                  >
                    <Link href={`/${audience.id}`}>
                      Explorar colección
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
