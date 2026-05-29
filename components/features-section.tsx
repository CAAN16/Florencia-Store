'use client';

import { motion } from 'framer-motion';
import { Leaf, Sparkles, Truck, RotateCcw } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Materiales Organicos',
    description: '100% ingredientes organicos'
  },
  {
    icon: Sparkles,
    title: 'Extractos Naturales',
    description: 'Formulas botanicas puras'
  },
  {
    icon: Truck,
    title: 'Envio Gratis',
    description: 'En compras mayores a $999'
  },
  {
    icon: RotateCcw,
    title: 'Devoluciones',
    description: '30 dias de garantia'
  }
];

export function FeaturesSection() {
  return (
    <section className="py-16 px-4 sm:px-6 border-y border-border bg-card">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="inline-flex items-center justify-center w-12 h-12 mb-4"
              >
                <feature.icon className="w-7 h-7 text-muted-foreground" strokeWidth={1.5} />
              </motion.div>
              <h3 className="font-medium text-foreground">{feature.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
