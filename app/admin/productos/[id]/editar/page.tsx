'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  Package, 
  DollarSign, 
  Layers, 
  Users, 
  FileText,
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { productsService } from '@/services/products.service';

interface ProductForm {
  nombre: string;
  descripcion: string;
  precio: string;
  precioOriginal: string;
  stock: string;
  categoria: string;
  audiencia: string;
  tallas: string; // Comma separated
  colores: string; // Comma separated
  isNew: boolean;
  isFeatured: boolean;
}

function EditarProductoContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [formData, setFormData] = useState<ProductForm>({
    nombre: '',
    descripcion: '',
    precio: '',
    precioOriginal: '',
    stock: '',
    categoria: '',
    audiencia: '',
    tallas: '',
    colores: '',
    isNew: false,
    isFeatured: false
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageUrlInput, setImageUrlInput] = useState<string>('');
  const [useUpload, setUseUpload] = useState<boolean>(true);

  const [errors, setErrors] = useState<Partial<ProductForm>>({});
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  // Redireccionar si no es administrador
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.rol !== 'admin') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  // Cargar datos del producto
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!productId) return;
      setIsFetching(true);
      try {
        const product = await productsService.getProduct(productId);
        setFormData({
          nombre: product.name,
          descripcion: product.description,
          precio: String(product.price),
          precioOriginal: product.originalPrice ? String(product.originalPrice) : '',
          stock: String(product.stock),
          categoria: product.category,
          audiencia: product.audience === 'niñas' ? 'ninas' : product.audience,
          tallas: (product.sizes || []).join(', '),
          colores: (product.colors || []).join(', '),
          isNew: !!product.isNew,
          isFeatured: !!product.isFeatured
        });
        setImagePreview(product.image);
        if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
          setImageUrlInput(product.image);
          setUseUpload(false);
        } else {
          setUseUpload(true);
        }
      } catch (error: any) {
        console.error('Error al cargar producto:', error);
        setAlert({ type: 'error', message: 'No se pudo cargar la información del producto.' });
      } finally {
        setIsFetching(false);
      }
    };

    if (!isLoading && isAuthenticated && user?.rol === 'admin') {
      fetchProductDetails();
    }
  }, [productId, isLoading, isAuthenticated, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAlert(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<ProductForm> = {};

    if (!formData.nombre || formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.descripcion || formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }

    const precio = parseFloat(formData.precio);
    if (!formData.precio || isNaN(precio) || precio <= 0) {
      newErrors.precio = 'El precio debe ser un número positivo';
    }

    if (formData.precioOriginal) {
      const original = parseFloat(formData.precioOriginal);
      if (isNaN(original) || original <= 0 || original <= precio) {
        newErrors.precioOriginal = 'El precio original debe ser mayor al precio de venta';
      }
    }

    const stock = parseInt(formData.stock);
    if (!formData.stock || isNaN(stock) || stock < 0) {
      newErrors.stock = 'El stock debe ser un número no negativo';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }

    if (!formData.audiencia) {
      newErrors.audiencia = 'Selecciona una audiencia';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlert(null);

    if (!validateForm()) {
      setAlert({ type: 'error', message: 'Por favor corrige los errores del formulario' });
      return;
    }

    setIsSubmitting(true);

    try {
      let finalImagePath = imagePreview; // Mantener la previa por defecto

      // Subir archivo nuevo solo si se seleccionó uno
      if (useUpload && imageFile) {
        finalImagePath = await productsService.uploadImage(imageFile);
      } else if (!useUpload) {
        if (!imageUrlInput) {
          setAlert({ type: 'error', message: 'Por favor ingresa la URL de la imagen' });
          setIsSubmitting(false);
          return;
        }
        finalImagePath = imageUrlInput;
      }

      // Procesar tallas y colores de texto a array
      const sizesArray = formData.tallas
        ? formData.tallas.split(',').map((s) => s.trim()).filter((s) => s !== '')
        : [];
      const colorsArray = formData.colores
        ? formData.colores.split(',').map((c) => c.trim()).filter((c) => c !== '')
        : [];

      // Actualizar el producto usando el productsService
      await productsService.updateProduct(productId, {
        name: formData.nombre,
        description: formData.descripcion,
        price: parseFloat(formData.precio),
        originalPrice: formData.precioOriginal ? parseFloat(formData.precioOriginal) : undefined,
        stock: parseInt(formData.stock),
        category: formData.categoria as 'ropa' | 'calzado' | 'accesorios',
        audience: (formData.audiencia === 'ninas' ? 'niñas' : formData.audiencia) as 'niñas' | 'jovenes' | 'mujeres',
        image: finalImagePath,
        sizes: sizesArray,
        colors: colorsArray,
        isNew: formData.isNew,
        isFeatured: formData.isFeatured
      });

      setAlert({ type: 'success', message: 'Producto actualizado correctamente. Redirigiendo...' });

      setTimeout(() => {
        router.push('/inventario');
      }, 1500);

    } catch (error: any) {
      console.error(error);
      setAlert({ type: 'error', message: error.message || 'Ocurrió un error al actualizar el producto.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.rol !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 lg:pt-32 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back button */}
          <Link
            href="/inventario"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inventario
          </Link>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-serif text-3xl lg:text-4xl text-foreground mb-2">
              Editar Producto: {formData.nombre}
            </h1>
            <p className="text-muted-foreground">
              Modifica los detalles del producto seleccionado
            </p>
          </motion.div>

          {/* Alert */}
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

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Product name */}
            <div>
              <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                Nombre del producto *
              </label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="Ej: Vestido Floral Elegante"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className={`w-full pl-12 pr-4 py-3.5 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                    errors.nombre ? 'border-destructive' : 'border-transparent'
                  }`}
                  required
                />
              </div>
              {errors.nombre && <p className="mt-1.5 text-sm text-destructive">{errors.nombre}</p>}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="descripcion" className="block text-sm font-medium text-foreground mb-2">
                Descripción *
              </label>
              <div className="relative">
                <FileText className="absolute left-4 top-4 w-5 h-5 text-muted-foreground" />
                <textarea
                  id="descripcion"
                  name="descripcion"
                  placeholder="Describe el producto en detalle..."
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={4}
                  className={`w-full pl-12 pr-4 py-3.5 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none ${
                    errors.descripcion ? 'border-destructive' : 'border-transparent'
                  }`}
                  required
                />
              </div>
              {errors.descripcion && <p className="mt-1.5 text-sm text-destructive">{errors.descripcion}</p>}
            </div>

            {/* Price and Stock */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="precio" className="block text-sm font-medium text-foreground mb-2">
                  Precio Venta *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    id="precio"
                    name="precio"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.precio}
                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.precio ? 'border-destructive' : 'border-transparent'
                    }`}
                    required
                  />
                </div>
                {errors.precio && <p className="mt-1.5 text-sm text-destructive">{errors.precio}</p>}
              </div>

              <div>
                <label htmlFor="precioOriginal" className="block text-sm font-medium text-foreground mb-2">
                  Precio Original (Descuento)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    id="precioOriginal"
                    name="precioOriginal"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    value={formData.precioOriginal}
                    onChange={(e) => setFormData({ ...formData, precioOriginal: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.precioOriginal ? 'border-destructive' : 'border-transparent'
                    }`}
                  />
                </div>
                {errors.precioOriginal && <p className="mt-1.5 text-sm text-destructive">{errors.precioOriginal}</p>}
              </div>

              <div>
                <label htmlFor="stock" className="block text-sm font-medium text-foreground mb-2">
                  Stock *
                </label>
                <div className="relative">
                  <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    placeholder="0"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 bg-muted border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all ${
                      errors.stock ? 'border-destructive' : 'border-transparent'
                    }`}
                    required
                  />
                </div>
                {errors.stock && <p className="mt-1.5 text-sm text-destructive">{errors.stock}</p>}
              </div>
            </div>

            {/* Category and Audience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="categoria" className="block text-sm font-medium text-foreground mb-2">
                  Categoría *
                </label>
                <select
                  id="categoria"
                  name="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  className={`w-full px-4 py-3.5 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer ${
                    errors.categoria ? 'border-destructive' : 'border-transparent'
                  }`}
                  required
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="ropa">Ropa</option>
                  <option value="calzado">Calzado</option>
                  <option value="accesorios">Accesorios</option>
                </select>
                {errors.categoria && <p className="mt-1.5 text-sm text-destructive">{errors.categoria}</p>}
              </div>

              <div>
                <label htmlFor="audiencia" className="block text-sm font-medium text-foreground mb-2">
                  Audiencia *
                </label>
                <div className="relative">
                  <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                  <select
                    id="audiencia"
                    name="audiencia"
                    value={formData.audiencia}
                    onChange={(e) => setFormData({ ...formData, audiencia: e.target.value })}
                    className={`w-full pl-12 pr-4 py-3.5 bg-muted border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all appearance-none cursor-pointer ${
                      errors.audiencia ? 'border-destructive' : 'border-transparent'
                    }`}
                    required
                  >
                    <option value="">Seleccionar audiencia</option>
                    <option value="ninas">Niñas</option>
                    <option value="jovenes">Jóvenes</option>
                    <option value="mujeres">Mujeres</option>
                  </select>
                </div>
                {errors.audiencia && <p className="mt-1.5 text-sm text-destructive">{errors.audiencia}</p>}
              </div>
            </div>

            {/* Sizes and Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="tallas" className="block text-sm font-medium text-foreground mb-2">
                  Tallas disponibles
                </label>
                <input
                  type="text"
                  id="tallas"
                  name="tallas"
                  placeholder="Separadas por comas. Ej: XS, S, M, L, XL"
                  value={formData.tallas}
                  onChange={(e) => setFormData({ ...formData, tallas: e.target.value })}
                  className="w-full px-4 py-3.5 bg-muted border border-transparent rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Ingresa las tallas separadas por comas. Si es calzado, usa números.
                </p>
              </div>

              <div>
                <label htmlFor="colores" className="block text-sm font-medium text-foreground mb-2">
                  Colores disponibles
                </label>
                <input
                  type="text"
                  id="colores"
                  name="colores"
                  placeholder="Separados por comas. Ej: Rosa, Azul, Negro"
                  value={formData.colores}
                  onChange={(e) => setFormData({ ...formData, colores: e.target.value })}
                  className="w-full px-4 py-3.5 bg-muted border border-transparent rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                />
                <p className="mt-1.5 text-xs text-muted-foreground">
                  Ingresa los nombres de los colores separados por comas.
                </p>
              </div>
            </div>

            {/* Badges / Flags */}
            <div className="flex flex-wrap gap-6 p-4 bg-muted/40 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={formData.isNew}
                  onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                  className="w-4.5 h-4.5 accent-primary rounded cursor-pointer"
                />
                ¿Es producto nuevo?
              </label>

              <label className="flex items-center gap-3 cursor-pointer text-sm font-medium text-foreground">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4.5 h-4.5 accent-primary rounded cursor-pointer"
                />
                ¿Destacar en portada?
              </label>
            </div>

            {/* Product Image */}
            <div className="border border-border rounded-lg p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-foreground">Imagen del Producto</h3>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setUseUpload(true)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all font-medium ${
                      useUpload 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    Subir Archivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setUseUpload(false)}
                    className={`px-3 py-1.5 text-xs rounded-full transition-all font-medium ${
                      !useUpload 
                        ? 'bg-foreground text-background' 
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    URL Externa
                  </button>
                </div>
              </div>

              {useUpload ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer bg-muted/40 hover:bg-muted/70 hover:border-foreground/20 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 text-muted-foreground mb-3" />
                        <p className="mb-1 text-sm text-foreground font-medium">
                          Haz clic para seleccionar o arrastra una nueva imagen
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Formatos aceptados: PNG, JPG o WebP (Max. 2MB)
                        </p>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative">
                    <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imageUrlInput}
                      onChange={(e) => {
                        setImageUrlInput(e.target.value);
                        setImagePreview(e.target.value);
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-muted border border-transparent rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    Pega el enlace de una imagen almacenada en la nube.
                  </p>
                </div>
              )}

              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-4 flex flex-col items-center bg-muted/20 p-4 rounded-lg border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Vista previa de la imagen actual:</p>
                  <div className="w-32 h-40 rounded-lg overflow-hidden border border-border bg-muted relative">
                    <img 
                      src={imagePreview} 
                      alt="Vista previa" 
                      className="w-full h-full object-cover" 
                      onError={() => {
                        if (!useUpload) setAlert({ type: 'error', message: 'La URL provista no es una imagen válida' });
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/inventario"
                className="flex-1 py-3.5 text-center border border-border text-foreground font-medium rounded-lg hover:bg-muted transition-colors"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3.5 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <>
                    <Package className="w-5 h-5" />
                    Actualizar Producto
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function EditarProductoPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <EditarProductoContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
