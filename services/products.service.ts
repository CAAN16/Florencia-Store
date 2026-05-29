import { apiFetch, ApiResponse, API_BASE_URL } from './api';
import { Product } from '@/lib/store';

export interface BackendProduct {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  precio_original: number | null;
  stock: number;
  audiencia: 'ninas' | 'jovenes' | 'mujeres';
  subcategoria: string;
  tallas: string[];
  colores: string[];
  imagen: string;
  is_new: boolean;
  is_featured: boolean;
  is_active: boolean;
  categoria: string;
  categoria_slug: 'ropa' | 'calzado' | 'accesorios';
}

/**
 * Convierte un producto del formato backend (snake_case, español) al formato frontend (camelCase, inglés).
 */
export function mapBackendProductToFrontend(p: BackendProduct): Product {
  // Si la imagen ya es una URL absoluta, usarla directamente, de lo contrario construirla con el servidor de la API
  let imageUrl = p.imagen || '';
  if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
    imageUrl = `${API_BASE_URL}/${imageUrl}`;
  }

  return {
    id: String(p.id),
    name: p.nombre,
    price: Number(p.precio),
    originalPrice: p.precio_original ? Number(p.precio_original) : undefined,
    category: p.categoria_slug,
    subcategory: p.subcategoria || '',
    audience: (p.audiencia === 'ninas' ? 'niñas' : p.audiencia) as 'niñas' | 'jovenes' | 'mujeres',
    image: imageUrl,
    description: p.descripcion || '',
    sizes: p.tallas || [],
    colors: p.colores || [],
    isNew: Boolean(p.is_new),
    isFeatured: Boolean(p.is_featured),
    stock: Number(p.stock),
  };
}

/**
 * Convierte un objeto parcial de producto del formato frontend al formato backend esperado.
 */
export function mapFrontendProductToBackend(p: Partial<Product>): Record<string, any> {
  const payload: Record<string, any> = {};

  if (p.name !== undefined) payload.nombre = p.name;
  if (p.price !== undefined) payload.precio = p.price;
  if (p.originalPrice !== undefined) payload.precio_original = p.originalPrice;
  
  if (p.category !== undefined) {
    // Map category string to category_id
    const catMap: Record<string, number> = { ropa: 1, calzado: 2, accesorios: 3 };
    payload.categoria_id = catMap[p.category] || 1;
  }
  
  if (p.subcategory !== undefined) payload.subcategoria = p.subcategory;
  
  if (p.audience !== undefined) {
    payload.audiencia = p.audience === 'niñas' ? 'ninas' : p.audience;
  }
  
  // Guardamos solo la parte relativa de la imagen si contiene la URL de la API
  if (p.image !== undefined) {
    let cleanImage = p.image;
    if (cleanImage.startsWith(API_BASE_URL)) {
      cleanImage = cleanImage.replace(`${API_BASE_URL}/`, '');
    }
    payload.imagen = cleanImage;
  }
  
  if (p.description !== undefined) payload.descripcion = p.description;
  if (p.sizes !== undefined) payload.tallas = p.sizes;
  if (p.colors !== undefined) payload.colores = p.colors;
  if (p.isNew !== undefined) payload.is_new = p.isNew ? 1 : 0;
  if (p.isFeatured !== undefined) payload.is_featured = p.isFeatured ? 1 : 0;
  if (p.stock !== undefined) payload.stock = p.stock;

  return payload;
}

export const productsService = {
  /**
   * Obtiene todos los productos con filtros opcionales
   */
  async getProducts(filters: {
    categoria?: string;
    audiencia?: string;
    busqueda?: string;
    soloActivos?: boolean;
  } = {}): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters.categoria) params.append('categoria', filters.categoria);
    
    if (filters.audiencia) {
      const dbAudience = filters.audiencia === 'niñas' ? 'ninas' : filters.audiencia;
      params.append('audiencia', dbAudience);
    }
    
    if (filters.busqueda) params.append('busqueda', filters.busqueda);
    if (filters.soloActivos !== undefined) params.append('soloActivos', String(filters.soloActivos));

    const queryString = params.toString();
    const endpoint = `/api/products/index.php${queryString ? `?${queryString}` : ''}`;
    
    const response = await apiFetch<ApiResponse<BackendProduct[]>>(endpoint);
    return (response.data || []).map(mapBackendProductToFrontend);
  },

  /**
   * Obtiene un producto por su ID
   */
  async getProduct(id: string | number): Promise<Product> {
    const response = await apiFetch<ApiResponse<BackendProduct>>(`/api/products/detail.php?id=${id}`);
    if (!response.data) {
      throw new Error('Producto no encontrado');
    }
    return mapBackendProductToFrontend(response.data);
  },

  /**
   * Crea un nuevo producto (requiere Admin)
   */
  async createProduct(product: Partial<Product>): Promise<Product> {
    const backendData = mapFrontendProductToBackend(product);
    const response = await apiFetch<ApiResponse<BackendProduct>>('/api/products/index.php', {
      method: 'POST',
      body: JSON.stringify(backendData),
    });
    if (!response.data) {
      throw new Error('Error al crear el producto');
    }
    return mapBackendProductToFrontend(response.data);
  },

  /**
   * Actualiza un producto existente (requiere Admin)
   */
  async updateProduct(id: string | number, product: Partial<Product>): Promise<Product> {
    const backendData = mapFrontendProductToBackend(product);
    const response = await apiFetch<ApiResponse<BackendProduct>>(`/api/products/detail.php?id=${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendData),
    });
    if (!response.data) {
      throw new Error('Error al actualizar el producto');
    }
    return mapBackendProductToFrontend(response.data);
  },

  /**
   * Elimina/Desactiva un producto (requiere Admin)
   */
  async deleteProduct(id: string | number): Promise<ApiResponse<null>> {
    return apiFetch<ApiResponse<null>>(`/api/products/detail.php?id=${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Sube una imagen de producto (requiere Admin)
   * Retorna la ruta relativa
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('imagen', file);

    const response = await apiFetch<ApiResponse<any>>('/api/products/upload-image.php', {
      method: 'POST',
      body: formData,
    });

    if (!response.success || !response.data?.imagen) {
      throw new Error(response.message || 'Error al subir la imagen');
    }

    return response.data.imagen;
  },
};
