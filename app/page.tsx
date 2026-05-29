import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { Header } from '@/components/header';
import { CartDrawer } from '@/components/cart-drawer';
import { HeroSection } from '@/components/hero-section';
import { CategoriesSection } from '@/components/categories-section';
import { FeaturedProducts } from '@/components/featured-products';
import { AudienceSection } from '@/components/audience-section';
import { NewArrivals } from '@/components/new-arrivals';
import { FeaturesSection } from '@/components/features-section';
import { PromoSection } from '@/components/promo-section';
import { NewsletterSection } from '@/components/newsletter-section';
import { Footer } from '@/components/footer';

export default function HomePage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <CartDrawer />
            <main>
              <HeroSection />
              <FeaturesSection />
              <CategoriesSection />
              <FeaturedProducts />
              <AudienceSection />
              <PromoSection />
              <NewArrivals />
              <NewsletterSection />
            </main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
