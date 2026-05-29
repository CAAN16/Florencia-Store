'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, RefreshCw } from 'lucide-react';
import { categories, audiences } from '@/lib/store';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useSearchParams, useRouter } from 'next/navigation';
import { productsService } from '@/services/products.service';
import { type Product } from '@/lib/store';

type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || null;
  const audienceParam = searchParams.get('audience') || null;

  const [productList, setProductList] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [selectedAudience, setSelectedAudience] = useState<string | null>(audienceParam);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 300]); // Subimos a 300 por si hay productos más caros

  // Sincronizar filtros locales cuando cambian los parámetros de la URL
  useEffect(() => {
    setSelectedCategory(searchParams.get('category'));
    setSelectedAudience(searchParams.get('audience'));
  }, [searchParams]);

  // Cargar productos desde la API al cambiar filtros o búsqueda
  useEffect(() => {
    const loadProducts = async () => {
      setIsFetching(true);
      try {
        const data = await productsService.getProducts({
          categoria: selectedCategory || undefined,
          audiencia: selectedAudience || undefined,
          busqueda: queryParam || undefined,
          soloActivos: true
        });
        setProductList(data);
      } catch (error) {
        console.error('Error al cargar productos del catálogo:', error);
      } finally {
        setIsFetching(false);
      }
    };

    loadProducts();
  }, [selectedCategory, selectedAudience, queryParam]);

  const filteredProducts = useMemo(() => {
    let filtered = [...productList];

    // Filtrar localmente por rango de precio
    filtered = filtered.filter(
      p => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    // Ordenar localmente
    switch (sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      default:
        filtered.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return filtered;
  }, [productList, sortBy, priceRange]);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedAudience(null);
    setPriceRange([0, 300]);
    // Limpiar también query param si existe
    if (queryParam) {
      router.push('/catalogo');
    }
  };

  const removeSearchQuery = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('q');
    router.push(`/catalogo?${params.toString()}`);
  };

  const hasActiveFilters = selectedCategory || selectedAudience || queryParam || priceRange[0] > 0 || priceRange[1] < 300;

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground">Catálogo</h1>
          <p className="text-muted-foreground mt-1">
            {isFetching ? 'Cargando productos...' : `${filteredProducts.length} productos encontrados`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile filter toggle */}
          <Button
            variant="outline"
            className="md:hidden"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={18} className="mr-2" />
            Filtros
          </Button>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none pl-4 pr-10 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer text-foreground"
            >
              <option value="featured">Destacados</option>
              <option value="newest">Más nuevos</option>
              <option value="price-asc">Precio: menor a mayor</option>
              <option value="price-desc">Precio: mayor a menor</option>
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground" />
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Categorías</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(
                      selectedCategory === cat.id ? null : cat.id
                    )}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Audiences */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Para quién</h3>
              <div className="space-y-2">
                {audiences.map((aud) => (
                  <button
                    key={aud.id}
                    onClick={() => setSelectedAudience(
                      selectedAudience === aud.id ? null : aud.id
                    )}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                      selectedAudience === aud.id
                        ? 'bg-primary text-primary-foreground font-medium'
                        : 'hover:bg-secondary text-foreground'
                    }`}
                  >
                    <span>{aud.name}</span>
                    <span className="text-xs opacity-75">{aud.description}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price range */}
            <div>
              <h3 className="font-semibold mb-3 text-foreground">Precio máximo</h3>
              <div className="space-y-4 px-2">
                <input
                  type="range"
                  min="0"
                  max="300"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>${priceRange[0]} MXN</span>
                  <span>${priceRange[1]} MXN</span>
                </div>
              </div>
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <Button
                variant="outline"
                className="w-full text-foreground border-border hover:bg-muted"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </aside>

        {/* Mobile Filters Drawer */}
        <AnimatePresence>
          {showFilters && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowFilters(false)}
                className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="fixed left-0 top-0 h-full w-80 max-w-[85vw] bg-card shadow-xl z-50 p-6 overflow-y-auto md:hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-foreground">Filtros</h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-full hover:bg-secondary text-foreground"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Categorías</h3>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(selectedCategory === cat.id ? null : cat.id);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                            selectedCategory === cat.id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Para quién</h3>
                    <div className="space-y-2">
                      {audiences.map((aud) => (
                        <button
                          key={aud.id}
                          onClick={() => {
                            setSelectedAudience(selectedAudience === aud.id ? null : aud.id);
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-colors ${
                            selectedAudience === aud.id
                              ? 'bg-primary text-primary-foreground font-medium'
                              : 'bg-secondary text-foreground'
                          }`}
                        >
                          {aud.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-foreground">Precio máximo</h3>
                    <input
                      type="range"
                      min="0"
                      max="300"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                      className="w-full accent-primary"
                    />
                    <p className="text-center text-sm mt-2 text-muted-foreground">Hasta ${priceRange[1]} MXN</p>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() => setShowFilters(false)}
                  >
                    Ver {filteredProducts.length} productos
                  </Button>

                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      className="w-full text-foreground border-border"
                      onClick={clearFilters}
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Active filters pills */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategory && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setSelectedCategory(null)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  Categoría: {categories.find(c => c.id === selectedCategory)?.name}
                  <X size={14} />
                </motion.button>
              )}
              {selectedAudience && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setSelectedAudience(null)}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  Para: {audiences.find(a => a.id === selectedAudience)?.name}
                  <X size={14} />
                </motion.button>
              )}
              {queryParam && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={removeSearchQuery}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  Búsqueda: &ldquo;{queryParam}&rdquo;
                  <X size={14} />
                </motion.button>
              )}
              {priceRange[1] < 300 && (
                <motion.button
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setPriceRange([0, 300])}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm hover:bg-primary/20 transition-colors"
                >
                  Precio: &le; ${priceRange[1]} MXN
                  <X size={14} />
                </motion.button>
              )}
            </div>
          )}

          {isFetching ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <RefreshCw className="w-8 h-8 text-primary animate-spin" />
              <p className="text-muted-foreground text-sm">Cargando productos del catálogo...</p>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <p className="text-xl font-medium text-muted-foreground">
                No se encontraron productos
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Intenta ajustar los filtros de búsqueda o el rango de precio.
              </p>
              <Button
                variant="outline"
                className="mt-4 text-foreground border-border hover:bg-muted"
                onClick={clearFilters}
              >
                Limpiar filtros
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
