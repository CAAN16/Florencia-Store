'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { Product } from '@/lib/store';
import { useCart } from '@/contexts/cart-context';
import Image from 'next/image';
import Link from 'next/link';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addItem } = useCart();

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Image container */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isNew && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full"
            >
              Nuevo
            </motion.span>
          )}
          {discount > 0 && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-full"
            >
              -{discount}%
            </motion.span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 p-2 bg-card/80 backdrop-blur-sm rounded-full shadow-md hover:bg-card transition-colors"
          aria-label={isLiked ? 'Quitar de favoritos' : 'Añadir a favoritos'}
        >
          <Heart
            size={18}
            className={`transition-colors ${
              isLiked ? 'fill-primary text-primary' : 'text-foreground'
            }`}
          />
        </button>

        {/* Quick actions overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-foreground/10 flex items-end justify-center pb-4 gap-2"
        >
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.1 }}
            onClick={() => addItem(product)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg"
          >
            <ShoppingBag size={16} />
            Añadir
          </motion.button>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ delay: 0.15 }}
          >
            <Link
              href={`/producto/${product.id}`}
              className="p-2 bg-card rounded-full shadow-lg hover:bg-secondary transition-colors flex items-center justify-center"
              aria-label={`Ver detalle de ${product.name}`}
            >
              <Eye size={18} />
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {product.subcategory}
        </p>
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-medium text-foreground line-clamp-2 leading-tight mb-2 group-hover:text-primary transition-colors cursor-pointer">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-lg font-serif font-semibold text-primary">
            ${product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Colors preview */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-1 mt-3">
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-border"
                style={{
                  backgroundColor:
                    color.toLowerCase() === 'rosa' ? '#f4a5c0' :
                    color.toLowerCase() === 'blanco' ? '#ffffff' :
                    color.toLowerCase() === 'negro' ? '#1a1a1a' :
                    color.toLowerCase() === 'beige' ? '#d4b896' :
                    color.toLowerCase() === 'azul' ? '#6b9ac4' :
                    color.toLowerCase() === 'verde' ? '#7cb08a' :
                    color.toLowerCase() === 'dorado' ? '#d4af37' :
                    color.toLowerCase() === 'plateado' ? '#c0c0c0' :
                    color.toLowerCase() === 'lila' ? '#c8a2c8' :
                    color.toLowerCase() === 'nude' ? '#e5cdb4' :
                    color.toLowerCase() === 'burdeos' ? '#800020' :
                    color.toLowerCase() === 'oro rosa' ? '#e8b4b8' :
                    '#e5e5e5'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground ml-1">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
