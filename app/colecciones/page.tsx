'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { AuthProvider } from '@/contexts/auth-context';

const coleccionesList = [
  {
    id: 'primavera',
    nombre: 'Colección Primavera',
    descripcion: 'Vestidos florales, tonos pastel y texturas frescas para recibir la temporada.',
    imagen: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop',
    link: '/catalogo?q=Primavera',
    color: 'from-pink-500/20 to-rose-500/20'
  },
  {
    id: 'deportiva',
    nombre: 'Colección Deportiva',
    descripcion: 'Calzado y prendas diseñadas para darte la mayor comodidad sin perder el estilo.',
    imagen: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=1000&fit=crop',
    link: '/catalogo?category=calzado',
    color: 'from-blue-500/20 to-indigo-500/20'
  },
  {
    id: 'accesorios-gala',
    nombre: 'Accesorios & Joyería',
    descripcion: 'El toque final perfecto. Aretes, collares y bolsos de mano de diseño exclusivo.',
    imagen: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=1000&fit=crop',
    link: '/catalogo?category=accesorios',
    color: 'from-amber-500/20 to-yellow-500/20'
  }
];

function ColeccionesContent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Hero */}
          <div className="text-center py-16 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ediciones Limitadas
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6"
            >
              Nuestras Colecciones
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground text-balance"
            >
              Diseños curados con pasión y materiales premium para adaptarnos a cada faceta de tu vida. Explora nuestras selecciones temáticas de temporada.
            </motion.p>
          </div>

          {/* Colecciones Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {coleccionesList.map((col, index) => (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.2 }}
                className="group relative flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-500"
              >
                {/* Imagen con overlay gradiente */}
                <div className="relative aspect-[3/4] overflow-hidden bg-muted">
                  <img
                    src={col.imagen}
                    alt={col.nombre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${col.color} mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
                </div>

                {/* Contenido */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {col.nombre}
                    </h2>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {col.descripcion}
                    </p>
                  </div>

                  <div className="pt-6">
                    <Link
                      href={col.link}
                      className="inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors group/link"
                    >
                      Explorar Colección
                      <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Banner de Calidad */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-24 p-8 sm:p-12 rounded-2xl bg-muted/40 border border-border flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 text-primary font-semibold">
                <ShieldCheck className="w-5 h-5" />
                <span>Garantía Florencia</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground">
                Calidad y diseño sin compromisos
              </h3>
              <p className="text-muted-foreground text-sm">
                Cada prenda es seleccionada bajo estrictos estándares de durabilidad, comodidad y elegancia. Queremos asegurar que te sientas segura y radiante en cualquier ocasión.
              </p>
            </div>
            
            <Link
              href="/catalogo"
              className="px-8 py-4 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-all shrink-0 flex items-center gap-2 group"
            >
              <Heart className="w-4 h-4 fill-background group-hover:scale-110 transition-transform" />
              Ver Todo el Catálogo
            </Link>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ColeccionesPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ColeccionesContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
