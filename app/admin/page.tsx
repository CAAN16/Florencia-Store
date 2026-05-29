'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Mail, 
  Users, 
  PlusCircle, 
  ListCollapse, 
  ArrowRight,
  TrendingUp,
  Inbox,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { productsService } from '@/services/products.service';
import { contactService, type ContactMessage } from '@/services/contact.service';
import { newsletterService } from '@/services/newsletter.service';

function AdminDashboardContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState({
    products: 0,
    messages: 0,
    newsletter: 0
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

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

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!isAuthenticated || user?.rol !== 'admin') return;
      setIsFetching(true);
      try {
        const [productsList, contactMsgs, newsletterSubs] = await Promise.all([
          productsService.getProducts({ soloActivos: false }),
          contactService.getMessages(),
          newsletterService.getSubscribers()
        ]);

        setStats({
          products: productsList.length,
          messages: contactMsgs.length,
          newsletter: newsletterSubs.length
        });
        
        // Guardar los 5 mensajes de contacto más recientes
        setMessages(contactMsgs.slice(0, 5));
      } catch (error: any) {
        console.error('Error al cargar datos del dashboard:', error);
        setAlert({ type: 'error', message: 'Error de conexión al cargar datos del panel.' });
      } finally {
        setIsFetching(false);
      }
    };

    if (!isLoading && isAuthenticated && user?.rol === 'admin') {
      loadDashboardData();
    }
  }, [isLoading, isAuthenticated, user]);

  const handleMarkAsRead = async (id: number) => {
    // Optimistic update: actualizar visualmente de inmediato
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, leido: true } : msg))
    );
    try {
      await contactService.markAsRead(id);
      setAlert({ type: 'success', message: 'Mensaje marcado como leído.' });
    } catch (error: any) {
      // Rollback si falla el servidor
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, leido: false } : msg))
      );
      setAlert({ type: 'error', message: 'No se pudo actualizar el estado del mensaje.' });
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10">
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground mb-2">
              Panel de Control Admin
            </h1>
            <p className="text-muted-foreground">
              Bienvenido, administrador. Gestiona los productos, mensajes y suscripciones desde aquí.
            </p>
          </div>

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

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-card border border-border rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3.5 bg-primary/10 text-primary rounded-lg">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Productos en Catálogo</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.products}</h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-card border border-border rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3.5 bg-rose-500/10 text-rose-500 rounded-lg">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensajes Recibidos</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.messages}</h3>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-card border border-border rounded-xl flex items-center gap-4 hover:shadow-md transition-shadow"
            >
              <div className="p-3.5 bg-emerald-500/10 text-emerald-500 rounded-lg">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Suscriptores Newsletter</p>
                <h3 className="text-2xl font-bold text-foreground">{stats.newsletter}</h3>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions & Recent Messages */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quick Actions */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">Acciones Rápidas</h2>
              <div className="flex flex-col gap-4">
                <Link
                  href="/admin/productos/nuevo"
                  className="p-5 bg-card border border-border rounded-xl flex items-center justify-between group hover:border-primary transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted text-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <PlusCircle className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Agregar Producto</p>
                      <p className="text-xs text-muted-foreground">Subir nueva prenda al catálogo</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  href="/inventario"
                  className="p-5 bg-card border border-border rounded-xl flex items-center justify-between group hover:border-primary transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-muted text-foreground rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ListCollapse className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground">Ver Inventario</p>
                      <p className="text-xs text-muted-foreground">Editar tallas, stock y precios</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Recent Messages */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-foreground">Mensajes de Contacto Recientes</h2>
              
              <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
                {messages.length > 0 ? (
                  <div className="divide-y divide-border">
                    {messages.map((msg) => (
                      <div key={msg.id} className="p-5 hover:bg-muted/10 transition-colors">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold text-sm text-foreground">{msg.nombre}</h4>
                              {!msg.leido && (
                                <span className="inline-block w-2 h-2 bg-primary rounded-full" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">{msg.correo}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {new Date(msg.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-1">
                          Asunto: {msg.asunto}
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {msg.mensaje}
                        </p>
                        
                        {!msg.leido && (
                          <div className="mt-3 text-right">
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="text-xs font-medium text-primary hover:underline"
                            >
                              Marcar como leído
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center">
                    <Inbox className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground text-sm">No hay mensajes de contacto recientes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <AdminDashboardContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
