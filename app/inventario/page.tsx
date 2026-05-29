'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, ArrowUpDown, Eye, Edit2, Trash2, Filter, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { type Product } from '@/lib/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { productsService } from '@/services/products.service';

function InventarioContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  
  const [productList, setProductList] = useState<Product[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Cargar productos del backend
  const fetchProducts = async () => {
    setIsFetching(true);
    try {
      // El admin puede ver todos los productos (incluidos inactivos)
      const data = await productsService.getProducts({ soloActivos: false });
      setProductList(data);
    } catch (error: any) {
      console.error('Error al cargar inventario:', error);
      setAlert({ type: 'error', message: 'No se pudieron cargar los productos del inventario.' });
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.rol === 'admin') {
      fetchProducts();
    }
  }, [isLoading, isAuthenticated, user]);

  // Redireccionar si no está autenticado o no es administrador
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.rol !== 'admin') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Eliminar producto
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el producto "${name}"?`)) {
      return;
    }

    try {
      const response = await productsService.deleteProduct(id);
      if (response.success) {
        setAlert({ type: 'success', message: `Producto "${name}" eliminado correctamente.` });
        // Filtrar del estado local en lugar de recargar todo
        setProductList((prev) => prev.filter((p) => p.id !== id));
      } else {
        setAlert({ type: 'error', message: response.message || 'No se pudo eliminar el producto.' });
      }
    } catch (error: any) {
      setAlert({ type: 'error', message: error.message || 'Error de conexión al eliminar.' });
    }
  };

  // Filtrar y ordenar productos
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    // Filtro de búsqueda
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.audience.toLowerCase().includes(query)
      );
    }

    // Filtro por categoría
    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.category === categoryFilter);
    }

    // Ordenamiento
    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal === undefined || bVal === undefined) return 0;
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [productList, searchQuery, categoryFilter, sortConfig]);

  const handleSort = (key: keyof Product) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Si no es administrador, no mostrar nada mientras se redirecciona
  if (user?.rol !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 lg:pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Titulo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">
              Inventario de Productos
            </h1>
            <p className="text-muted-foreground">
              Gestiona y visualiza todos los productos de la tienda (Panel de Administrador)
            </p>
          </motion.div>

          {/* Alertas */}
          {alert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                alert.type === 'success'
                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                  : 'bg-destructive/10 text-destructive border border-destructive/20'
              }`}
            >
              {alert.type === 'success' ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm">{alert.message}</span>
            </motion.div>
          )}

          {/* Filtros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-6"
          >
            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Selector de Categoría */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="pl-12 pr-8 py-3 bg-muted border-0 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              >
                <option value="all">Todas las categorias</option>
                <option value="ropa">Ropa</option>
                <option value="calzado">Calzado</option>
                <option value="accesorios">Accesorios</option>
              </select>
            </div>

            {/* Boton Agregar */}
            <Link
              href="/admin/productos/nuevo"
              className="px-6 py-3 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2"
            >
              <Package className="w-5 h-5" />
              Agregar Producto
            </Link>
          </motion.div>

          {/* Estadisticas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Productos</p>
              <p className="text-2xl font-semibold text-foreground">{productList.length}</p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Ropa</p>
              <p className="text-2xl font-semibold text-foreground">
                {productList.filter((p) => p.category === 'ropa').length}
              </p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Calzado</p>
              <p className="text-2xl font-semibold text-foreground">
                {productList.filter((p) => p.category === 'calzado').length}
              </p>
            </div>
            <div className="p-4 bg-card border border-border rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Accesorios</p>
              <p className="text-2xl font-semibold text-foreground">
                {productList.filter((p) => p.category === 'accesorios').length}
              </p>
            </div>
          </motion.div>

          {/* Tabla de Productos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border border-border rounded-lg overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Producto
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('category')}
                    >
                      <span className="flex items-center gap-1">
                        Categoria
                        <ArrowUpDown className="w-4 h-4" />
                      </span>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('price')}
                    >
                      <span className="flex items-center gap-1">
                        Precio
                        <ArrowUpDown className="w-4 h-4" />
                      </span>
                    </th>
                    <th 
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground"
                      onClick={() => handleSort('stock')}
                    >
                      <span className="flex items-center gap-1">
                        Stock
                        <ArrowUpDown className="w-4 h-4" />
                      </span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Audiencia
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(index * 0.01, 0.2) }}
                      className="hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-muted rounded-md overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-foreground text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {product.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground capitalize">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-medium text-foreground">${product.price.toFixed(2)} MXN</p>
                          {product.originalPrice && (
                            <p className="text-xs text-muted-foreground line-through">
                              ${product.originalPrice.toFixed(2)} MXN
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          product.stock > 10
                            ? 'bg-success/10 text-success'
                            : product.stock > 0
                            ? 'bg-warning/20 text-warning-foreground'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {product.stock} unidades
                        </span>
                      </td>
                      <td className="px-4 py-4 capitalize text-sm text-muted-foreground">
                        {product.audience}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/catalogo?q=${encodeURIComponent(product.name)}`}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            aria-label="Ver producto en catálogo"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/productos/${product.id}/editar`}
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                            aria-label="Editar producto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDeleteProduct(product.id, product.name)}
                            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                            aria-label="Eliminar producto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center">
                <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No se encontraron productos en el inventario</p>
              </div>
            )}
          </motion.div>

          {/* Conteo de resultados */}
          <p className="mt-4 text-sm text-muted-foreground">
            Mostrando {filteredProducts.length} de {productList.length} productos
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function InventarioPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <InventarioContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
