'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, Menu, X, User, Sun, Moon, LogOut, Settings, Package } from 'lucide-react';
import { useCart } from '@/contexts/cart-context';
import { useAuth } from '@/contexts/auth-context';
import { useTheme } from '@/contexts/theme-context';

const navLinks = [
  { href: '/catalogo', label: 'Tienda' },
  { href: '/nosotros', label: 'Nosotros' },
  { href: '/colecciones', label: 'Colecciones' },
  { href: '/contacto', label: 'Contacto' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { totalItems, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? 'bg-background/95 backdrop-blur-md shadow-sm' : 'bg-background'
      }`}>
        {/* Top bar */}
        <div className="hidden lg:block border-b border-border/50">
          <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between text-xs tracking-wide text-muted-foreground">
            <span>Envio gratis en compras mayores a $999</span>
            <button 
              onClick={toggleTheme}
              className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            >
              {theme === 'light' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              <span>{theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}</span>
            </button>
          </div>
        </div>

        {/* Main header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center justify-between h-16 lg:h-20">
            {/* Left navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.slice(0, 2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-foreground"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
              <h1 className="font-serif text-2xl lg:text-3xl tracking-wide text-foreground">
                Florencia
              </h1>
            </Link>

            {/* Right navigation - Desktop */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.slice(2).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-1">
              {/* Theme toggle - Mobile */}
              <button
                onClick={toggleTheme}
                className="lg:hidden p-2 text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Cambiar tema"
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-foreground hover:bg-muted rounded-full transition-colors"
                aria-label="Buscar"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="p-2 text-foreground hover:bg-muted rounded-full transition-colors"
                  aria-label="Mi cuenta"
                >
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-40"
                        onClick={() => setIsUserMenuOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50"
                      >
                        {isAuthenticated ? (
                          <>
                            <div className="p-4 border-b border-border">
                              <p className="font-medium text-foreground">{user?.nombre}</p>
                              <p className="text-sm text-muted-foreground">{user?.correo}</p>
                            </div>
                            <div className="p-2">
                              {user?.rol === 'admin' && (
                                <Link
                                  href="/admin"
                                  className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  <Settings className="w-4 h-4" />
                                  Panel Admin
                                </Link>
                              )}
                              <Link
                                href="/inventario"
                                className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                                onClick={() => setIsUserMenuOpen(false)}
                              >
                                <Package className="w-4 h-4" />
                                Inventario
                              </Link>
                              <button
                                onClick={() => { logout(); setIsUserMenuOpen(false); }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                              >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesion
                              </button>
                            </div>
                          </>
                        ) : (
                          <div className="p-2">
                            <Link
                              href="/login"
                              className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Iniciar Sesion
                            </Link>
                            <Link
                              href="/registro"
                              className="block px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              Crear Cuenta
                            </Link>
                          </div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Cart */}
              <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-foreground hover:bg-muted rounded-full transition-colors relative"
                aria-label="Carrito"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-foreground text-background text-xs font-medium rounded-full flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </button>
            </div>
          </nav>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t border-border overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      router.push(`/catalogo?q=${encodeURIComponent(searchQuery.trim())}`);
                      setIsSearchOpen(false);
                    }
                  }}
                  className="relative max-w-xl mx-auto"
                >
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 bg-muted border-0 rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />
                  <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Search className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background z-50 lg:hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-border">
                <span className="font-serif text-xl text-foreground">Menu</span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 text-foreground hover:bg-muted rounded-full transition-colors"
                  aria-label="Cerrar menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="p-6">
                <ul className="space-y-1">
                  {navLinks.map((link, index) => (
                    <motion.li
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="block py-3 text-lg text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>

                <div className="mt-8 pt-8 border-t border-border">
                  {isAuthenticated ? (
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Hola, <span className="text-foreground font-medium">{user?.nombre}</span>
                      </p>
                      {user?.rol === 'admin' && (
                        <Link
                          href="/admin"
                          className="block py-2 text-foreground hover:text-primary transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Panel Admin
                        </Link>
                      )}
                      <Link
                        href="/inventario"
                        className="block py-2 text-foreground hover:text-primary transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Inventario
                      </Link>
                      <button
                        onClick={() => { logout(); setIsMenuOpen(false); }}
                        className="text-destructive hover:text-destructive/80 transition-colors"
                      >
                        Cerrar Sesion
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Link
                        href="/login"
                        className="block w-full py-3 text-center bg-foreground text-background rounded-lg font-medium hover:bg-foreground/90 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Iniciar Sesion
                      </Link>
                      <Link
                        href="/registro"
                        className="block w-full py-3 text-center border border-border text-foreground rounded-lg font-medium hover:bg-muted transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Crear Cuenta
                      </Link>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
