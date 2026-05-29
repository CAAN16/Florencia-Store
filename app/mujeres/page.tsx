'use client';

import { useState, useEffect } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { Header } from '@/components/header';
import { CartDrawer } from '@/components/cart-drawer';
import { NewsletterSection } from '@/components/newsletter-section';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { motion } from 'framer-motion';
import { productsService } from '@/services/products.service';
import { type Product } from '@/lib/store';
import { Loader2 } from 'lucide-react';

function MujeresContent() {
  const [mujeresProducts, setMujeresProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await productsService.getProducts({ audiencia: 'mujeres' });
        setMujeresProducts(data);
      } catch (error) {
        console.error('Error al cargar productos para mujeres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />
      <main>
        {/* Hero */}
        <section className="relative py-20 px-4 bg-gradient-to-b from-amber-50 to-background">
          <div className="max-w-7xl mx-auto text-center">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-block px-4 py-2 bg-amber-100 text-amber-700 text-sm font-medium rounded-full mb-4"
            >
              Elegancia sofisticada
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground"
            >
              Moda para Mujeres
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-muted-foreground max-w-2xl mx-auto text-lg text-balance"
            >
              Colección exclusiva para la mujer moderna y empoderada. Elegancia en cada detalle.
            </motion.p>
          </div>
        </section>

        {/* Products */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                <p className="text-muted-foreground text-sm">Cargando productos...</p>
              </div>
            ) : mujeresProducts.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {mujeresProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                Próximamente más productos en esta categoría.
              </p>
            )}
          </div>
        </section>
      </main>
      <NewsletterSection />
      <Footer />
    </div>
  );
}

export default function MujeresPage() {
  return (
    <CartProvider>
      <MujeresContent />
    </CartProvider>
  );
}
