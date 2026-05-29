export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: 'ropa' | 'calzado' | 'accesorios';
  subcategory: string;
  audience: 'niñas' | 'jovenes' | 'mujeres';
  image: string;
  images?: string[];
  description: string;
  sizes?: string[];
  colors?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
  stock: number;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Vestido Floral Primavera',
    price: 89.99,
    originalPrice: 119.99,
    category: 'ropa',
    subcategory: 'vestidos',
    audience: 'mujeres',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&h=1000&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&h=1000&fit=crop'
    ],
    description: 'Elegante vestido floral perfecto para la temporada de primavera. Confeccionado con telas de alta calidad.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Rosa', 'Azul', 'Verde'],
    isNew: true,
    isFeatured: true,
    stock: 15
  },
  {
    id: '2',
    name: 'Blusa Elegante Satinada',
    price: 59.99,
    category: 'ropa',
    subcategory: 'blusas',
    audience: 'jovenes',
    image: 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=400&h=500&fit=crop',
    description: 'Blusa satinada con detalles de encaje, perfecta para ocasiones especiales.',
    sizes: ['S', 'M', 'L'],
    colors: ['Blanco', 'Negro', 'Beige'],
    isNew: true,
    stock: 20
  },
  {
    id: '3',
    name: 'Sandalias de Tacón Rosa',
    price: 79.99,
    originalPrice: 99.99,
    category: 'calzado',
    subcategory: 'tacones',
    audience: 'mujeres',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
    description: 'Sandalias elegantes con tacón de 8cm, perfectas para eventos formales.',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: ['Rosa', 'Nude', 'Negro'],
    isFeatured: true,
    stock: 12
  },
  {
    id: '4',
    name: 'Bolso de Mano Chic',
    price: 49.99,
    category: 'accesorios',
    subcategory: 'bolsos',
    audience: 'jovenes',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop',
    description: 'Bolso de mano elegante con cadena dorada, ideal para cualquier ocasión.',
    colors: ['Rosa', 'Blanco', 'Negro'],
    isFeatured: true,
    stock: 25
  },
  {
    id: '5',
    name: 'Vestido Princesa Rosa',
    price: 69.99,
    category: 'ropa',
    subcategory: 'vestidos',
    audience: 'niñas',
    image: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=400&h=500&fit=crop',
    description: 'Hermoso vestido de princesa con tul y detalles brillantes.',
    sizes: ['2-3', '4-5', '6-7', '8-9', '10-11'],
    colors: ['Rosa', 'Lila', 'Blanco'],
    isNew: true,
    stock: 18
  },
  {
    id: '6',
    name: 'Zapatillas Deportivas Trendy',
    price: 89.99,
    category: 'calzado',
    subcategory: 'deportivas',
    audience: 'jovenes',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=400&h=500&fit=crop',
    description: 'Zapatillas cómodas con diseño moderno y suela de alta resistencia.',
    sizes: ['35', '36', '37', '38', '39', '40'],
    colors: ['Blanco/Rosa', 'Negro/Dorado'],
    isNew: true,
    stock: 30
  },
  {
    id: '7',
    name: 'Aretes Dorados Elegantes',
    price: 29.99,
    category: 'accesorios',
    subcategory: 'joyeria',
    audience: 'mujeres',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop',
    description: 'Aretes dorados con diseño geométrico, baño de oro de 18k.',
    colors: ['Dorado', 'Plateado', 'Oro Rosa'],
    stock: 50
  },
  {
    id: '8',
    name: 'Falda Plisada Midi',
    price: 54.99,
    originalPrice: 74.99,
    category: 'ropa',
    subcategory: 'faldas',
    audience: 'mujeres',
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0uj35?w=400&h=500&fit=crop',
    description: 'Falda plisada midi perfecta para looks sofisticados y elegantes.',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Beige', 'Negro', 'Burdeos'],
    isFeatured: true,
    stock: 22
  },
  {
    id: '9',
    name: 'Bailarinas con Lazo',
    price: 45.99,
    category: 'calzado',
    subcategory: 'flats',
    audience: 'niñas',
    image: 'https://images.unsplash.com/photo-1604001307862-2d953b875079?w=400&h=500&fit=crop',
    description: 'Bailarinas cómodas y elegantes con lazo decorativo.',
    sizes: ['28', '29', '30', '31', '32', '33', '34'],
    colors: ['Rosa', 'Blanco', 'Azul'],
    stock: 35
  },
  {
    id: '10',
    name: 'Diadema con Perlas',
    price: 19.99,
    category: 'accesorios',
    subcategory: 'pelo',
    audience: 'niñas',
    image: 'https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=500&fit=crop',
    description: 'Hermosa diadema decorada con perlas y cristales.',
    colors: ['Blanco', 'Rosa', 'Dorado'],
    isNew: true,
    stock: 40
  },
  {
    id: '11',
    name: 'Pantalón Wide Leg',
    price: 64.99,
    category: 'ropa',
    subcategory: 'pantalones',
    audience: 'jovenes',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop',
    description: 'Pantalón de pierna ancha con tiro alto, máxima elegancia y comodidad.',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Negro', 'Beige', 'Blanco'],
    stock: 28
  },
  {
    id: '12',
    name: 'Collar de Corazón',
    price: 34.99,
    category: 'accesorios',
    subcategory: 'joyeria',
    audience: 'jovenes',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=500&fit=crop',
    description: 'Delicado collar con dije de corazón en plata 925.',
    colors: ['Plateado', 'Dorado', 'Oro Rosa'],
    isFeatured: true,
    stock: 45
  }
];

export const categories = [
  { id: 'ropa', name: 'Ropa', icon: '👗' },
  { id: 'calzado', name: 'Calzado', icon: '👠' },
  { id: 'accesorios', name: 'Accesorios', icon: '👜' }
];

export const audiences = [
  { id: 'niñas', name: 'Niñas', description: '2-12 años' },
  { id: 'jovenes', name: 'Jóvenes', description: '13-25 años' },
  { id: 'mujeres', name: 'Mujeres', description: '26+ años' }
];
