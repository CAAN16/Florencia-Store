'use client';

import { motion } from 'framer-motion';
import { Heart, Users, Award, Leaf } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';

function NosotrosContent() {
  const values = [
    {
      icon: Heart,
      title: 'Pasion por la moda',
      description: 'Cada prenda que creamos nace de nuestra pasion por vestir a mujeres de todas las edades con elegancia y estilo.'
    },
    {
      icon: Users,
      title: 'Comunidad',
      description: 'Construimos una comunidad de mujeres que celebran su individualidad a traves de la moda.'
    },
    {
      icon: Award,
      title: 'Calidad premium',
      description: 'Seleccionamos cuidadosamente los mejores materiales para garantizar durabilidad y confort.'
    },
    {
      icon: Leaf,
      title: 'Sostenibilidad',
      description: 'Comprometidos con practicas eticas y sostenibles en toda nuestra cadena de produccion.'
    }
  ];

  const team = [
    {
      name: 'Maria Fernandez',
      role: 'Fundadora & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop'
    },
    {
      name: 'Carolina Lopez',
      role: 'Directora Creativa',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop'
    },
    {
      name: 'Isabella Torres',
      role: 'Jefa de Diseno',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 lg:pt-32">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
                  Nuestra historia
                </p>
                <h1 className="font-serif text-4xl lg:text-5xl text-foreground mb-6 text-balance">
                  Vestimos suenos desde 2015
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  Florencia nacio de la vision de crear una marca que celebrara la feminidad 
                  en todas sus formas. Desde ninas hasta mujeres, cada pieza esta disenada 
                  para hacer sentir especial a quien la viste.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Hoy, con mas de 10 anos de experiencia, seguimos comprometidas con ofrecer 
                  moda de calidad que refleje la personalidad unica de cada mujer.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-muted">
                  <img
                    src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=800&h=1000&fit=crop"
                    alt="Tienda Florencia"
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
                Nuestros valores
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
                Lo que nos define
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-background border border-border flex items-center justify-center">
                    <value.icon className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-medium text-foreground mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
              {[
                { value: '10+', label: 'Anos de experiencia' },
                { value: '50K+', label: 'Clientas felices' },
                { value: '500+', label: 'Productos' },
                { value: '15', label: 'Tiendas fisicas' }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <p className="font-serif text-4xl lg:text-5xl text-foreground mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <p className="text-sm tracking-widest text-muted-foreground uppercase mb-4">
                Nuestro equipo
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground">
                Las mentes detras de Florencia
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-foreground">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-6">
                Se parte de nuestra historia
              </h2>
              <p className="text-muted-foreground mb-8">
                Descubre nuestra coleccion y encuentra las piezas perfectas para ti
              </p>
              <a
                href="/catalogo"
                className="inline-flex items-center justify-center px-8 py-4 bg-foreground text-background font-medium rounded-full hover:bg-foreground/90 transition-colors"
              >
                Explorar coleccion
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function NosotrosPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <NosotrosContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
