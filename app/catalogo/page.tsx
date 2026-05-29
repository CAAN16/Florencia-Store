import { Suspense } from 'react';
import { CartProvider } from '@/contexts/cart-context';
import { Header } from '@/components/header';
import { CartDrawer } from '@/components/cart-drawer';
import { CatalogContent } from '@/components/catalog-content';
import { NewsletterSection } from '@/components/newsletter-section';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Catálogo | Florencia',
  description: 'Explora nuestra colección completa de ropa, calzado y accesorios para niñas, jóvenes y mujeres.',
};

export default function CatalogoPage() {
  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header />
        <CartDrawer />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Suspense fallback={
            <div className="py-20 text-center text-muted-foreground">
              Cargando catálogo...
            </div>
          }>
            <CatalogContent />
          </Suspense>
        </main>
        <NewsletterSection />
        <Footer />
      </div>
    </CartProvider>
  );
}
