import { CartProvider } from '@/contexts/cart-context';
import { Header } from '@/components/header';
import { CartDrawer } from '@/components/cart-drawer';
import { NewsletterSection } from '@/components/newsletter-section';
import { Footer } from '@/components/footer';
import { products } from '@/lib/store';
import { ProductCard } from '@/components/product-card';

export const metadata = {
  title: 'Ofertas | Florencia',
  description: 'Descubre las mejores ofertas en ropa, calzado y accesorios. Hasta 40% de descuento.',
};

export default function OfertasPage() {
  const discountedProducts = products.filter(p => p.originalPrice);

  return (
    <CartProvider>
      <div className="min-h-screen">
        <Header />
        <CartDrawer />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Hero */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
              Hasta 40% de descuento
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold">
              Ofertas Especiales
            </h1>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Las mejores prendas al mejor precio. No te pierdas estas oportunidades únicas.
            </p>
          </div>

          {/* Products */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {discountedProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </main>
        <NewsletterSection />
        <Footer />
      </div>
    </CartProvider>
  );
}
