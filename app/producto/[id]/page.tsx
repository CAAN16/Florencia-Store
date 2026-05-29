'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Heart,
  ArrowLeft,
  Star,
  Package,
  Shield,
  Truck,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartDrawer } from '@/components/cart-drawer';
import { CartProvider } from '@/contexts/cart-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { AuthProvider } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { productsService } from '@/services/products.service';
import { type Product } from '@/lib/store';

/** Mapa de color en español → valor CSS */
const COLOR_MAP: Record<string, string> = {
  rosa: '#f4a5c0',
  blanco: '#ffffff',
  negro: '#1a1a1a',
  beige: '#d4b896',
  azul: '#6b9ac4',
  verde: '#7cb08a',
  dorado: '#d4af37',
  plateado: '#c0c0c0',
  lila: '#c8a2c8',
  nude: '#e5cdb4',
  burdeos: '#800020',
  'oro rosa': '#e8b4b8',
};

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | undefined>();
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const id = params?.id as string;
    if (!id) {
      setError('ID de producto no válido.');
      setIsLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const data = await productsService.getProduct(id);
        setProduct(data);
        // Seleccionar primera talla y color por defecto
        if (data.sizes && data.sizes.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      } catch (err: any) {
        setError(err.message || 'No se pudo cargar el producto.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [params?.id]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity, selectedSize, selectedColor);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const discount = product?.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  // Imágenes: usar imagen principal + images[] si existen
  const images = product
    ? [product.image, ...(product.images?.filter(i => i !== product.image) || [])]
    : [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted-foreground text-sm">Cargando producto...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h1 className="text-2xl font-serif font-bold text-foreground mb-2">
            Producto no encontrado
          </h1>
          <p className="text-muted-foreground mb-6">
            {error || 'Este producto no existe o fue eliminado del catálogo.'}
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Ver catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <CartDrawer />

      <main className="pt-24 lg:pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Breadcrumb */}
          <nav aria-label="Navegación de migas" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-primary transition-colors">Inicio</Link></li>
              <li>/</li>
              <li><Link href="/catalogo" className="hover:text-primary transition-colors">Catálogo</Link></li>
              <li>/</li>
              <li className="text-foreground font-medium truncate max-w-[200px]">{product.name}</li>
            </ol>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

            {/* Galería de imágenes */}
            <div className="space-y-4">
              <motion.div
                key={currentImage}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary shadow-md"
              >
                <Image
                  src={images[currentImage] || product.image}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                      Nuevo
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full">
                      -{discount}%
                    </span>
                  )}
                </div>
              </motion.div>

              {/* Miniaturas */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImage === idx
                          ? 'border-primary shadow-md'
                          : 'border-border hover:border-primary/50'
                      }`}
                      aria-label={`Ver imagen ${idx + 1}`}
                    >
                      <Image src={img} alt={`${product.name} vista ${idx + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Información del producto */}
            <div className="flex flex-col gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                  {product.category} · {product.subcategory}
                </p>
                <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground leading-tight mb-4">
                  {product.name}
                </h1>

                {/* Precio */}
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-serif font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {discount > 0 && (
                    <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      Ahorras ${(product.originalPrice! - product.price).toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Rating simulado */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.8 · 124 reseñas)</span>
                </div>
              </motion.div>

              {/* Descripción */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground leading-relaxed"
              >
                {product.description}
              </motion.p>

              {/* Selector de color */}
              {product.colors && product.colors.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Color: <span className="font-normal text-muted-foreground">{selectedColor}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        title={color}
                        aria-label={`Seleccionar color ${color}`}
                        className={`w-8 h-8 rounded-full border-2 transition-all ${
                          selectedColor === color
                            ? 'border-primary ring-2 ring-primary ring-offset-2'
                            : 'border-border hover:border-primary/50'
                        }`}
                        style={{
                          backgroundColor: COLOR_MAP[color.toLowerCase()] || '#e5e5e5',
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Selector de talla */}
              {product.sizes && product.sizes.length > 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <p className="text-sm font-semibold text-foreground mb-3">
                    Talla: <span className="font-normal text-muted-foreground">{selectedSize}</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        aria-label={`Talla ${size}`}
                        aria-pressed={selectedSize === size}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          selectedSize === size
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-card text-foreground border-border hover:border-primary'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Cantidad */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-4"
              >
                <p className="text-sm font-semibold text-foreground">Cantidad:</p>
                <div className="flex items-center border border-border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    aria-label="Disminuir cantidad"
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="px-4 py-2 font-medium text-foreground min-w-[3rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    aria-label="Aumentar cantidad"
                    className="px-4 py-2 text-foreground hover:bg-muted transition-colors text-lg font-medium"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-muted-foreground">{product.stock} disponibles</span>
              </motion.div>

              {/* Botones de acción */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-3"
              >
                <button
                  id="btn-add-to-cart"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-semibold text-base transition-all shadow-md ${
                    addedToCart
                      ? 'bg-emerald-500 text-white'
                      : product.stock === 0
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {addedToCart ? '¡Agregado!' : product.stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
                </button>

                <button
                  onClick={() => setIsWishlisted(w => !w)}
                  aria-label={isWishlisted ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                  className={`p-4 rounded-full border-2 transition-all ${
                    isWishlisted
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-foreground hover:border-primary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-primary' : ''}`} />
                </button>
              </motion.div>

              {/* Garantías */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="grid grid-cols-3 gap-4 pt-4 border-t border-border"
              >
                {[
                  { icon: Truck, label: 'Envío gratis', sub: 'En compras +$500' },
                  { icon: Shield, label: 'Compra segura', sub: 'Pago protegido' },
                  { icon: Package, label: 'Devoluciones', sub: '30 días' },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex flex-col items-center text-center gap-1">
                    <Icon className="w-5 h-5 text-primary" />
                    <p className="text-xs font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-muted-foreground">{sub}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ProductDetailContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
