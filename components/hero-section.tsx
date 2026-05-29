'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 lg:pt-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/30 to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 lg:py-24 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-center lg:text-left"
          >
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm tracking-[0.2em] text-muted-foreground uppercase mb-6"
            >
              Nueva Coleccion 2026
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.1] text-balance"
            >
              Elegancia natural
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="mt-6 text-lg text-muted-foreground max-w-md mx-auto lg:mx-0 leading-relaxed"
            >
              Descubre nuestra coleccion de ropa, calzado y accesorios 
              para ninas, jovenes y mujeres. Moda que refleja tu esencia.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link 
                href="/catalogo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-all group"
              >
                Explorar coleccion
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="/nosotros"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-border text-foreground font-medium rounded-full hover:bg-muted transition-all"
              >
                Conocenos
              </Link>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
              <img
                src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop"
                alt="Moda femenina elegante"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="absolute -left-6 bottom-12 bg-card border border-border rounded-2xl p-4 shadow-lg hidden lg:block"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop"
                    alt="Cliente"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Sofia M.</p>
                  <p className="text-xs text-muted-foreground">Cliente verificada</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground max-w-[180px]">
                &quot;La calidad y el estilo superaron mis expectativas&quot;
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Features bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 lg:mt-24 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12"
        >
          {[
            { icon: '🌿', title: 'Materiales sostenibles', desc: 'Cuidamos el planeta' },
            { icon: '✨', title: 'Disenos exclusivos', desc: 'Piezas unicas' },
            { icon: '🚚', title: 'Envio gratis', desc: 'En compras +$999' },
            { icon: '💝', title: 'Garantia de calidad', desc: '30 dias de devolucion' },
          ].map((feature, index) => (
            <div key={index} className="text-center lg:text-left">
              <span className="text-2xl mb-3 block">{feature.icon}</span>
              <h3 className="font-medium text-foreground text-sm">{feature.title}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
