'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { AuthProvider } from '@/contexts/auth-context';
import { ThemeProvider } from '@/contexts/theme-context';
import { contactService } from '@/services/contact.service';

function ContactoContent() {
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    asunto: '',
    mensaje: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAlert(null);

    try {
      const response = await contactService.sendContactMessage(
        formData.nombre,
        formData.correo,
        formData.asunto,
        formData.mensaje
      );

      if (response.success) {
        setAlert({
          type: 'success',
          message: response.message || 'Mensaje enviado correctamente. Te contactaremos pronto.'
        });
        setFormData({ nombre: '', correo: '', asunto: '', mensaje: '' });
      } else {
        setAlert({
          type: 'error',
          message: response.message || 'Ocurrió un error al enviar el mensaje. Intenta de nuevo.'
        });
      }
    } catch (error: any) {
      setAlert({
        type: 'error',
        message: error.message || 'Error de conexión. Por favor intenta de nuevo.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Correo electronico',
      value: 'hola@florencia.com',
      link: 'mailto:hola@florencia.com'
    },
    {
      icon: Phone,
      title: 'Telefono',
      value: '+52 (55) 1234 5678',
      link: 'tel:+525512345678'
    },
    {
      icon: MapPin,
      title: 'Direccion',
      value: 'Av. Reforma 222, CDMX',
      link: 'https://maps.google.com/?q=Paseo+de+la+Reforma+222+CDMX'
    },
    {
      icon: Clock,
      title: 'Horario',
      value: 'Lun - Sab: 10:00 - 20:00',
      link: '#'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-24 lg:pt-32">
        {/* Hero */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm tracking-widest text-muted-foreground uppercase mb-4"
            >
              Contacto
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-4xl lg:text-6xl text-foreground mb-6 text-balance"
            >
              Estamos aqui para ayudarte
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
            >
              Tienes alguna pregunta sobre nuestros productos o necesitas asistencia? 
              No dudes en contactarnos.
            </motion.p>
          </div>
        </section>

        {/* Contact info cards */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((item, index) => (
                <motion.a
                  key={item.title}
                  href={item.link}
                  target={item.link.startsWith('http') ? '_blank' : undefined}
                  rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="p-6 bg-card border border-border rounded-xl hover:border-foreground/20 transition-all group"
                >
                  <item.icon className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors mb-4" />
                  <h3 className="font-medium text-foreground mb-1">{item.title}</h3>
                  <p className="text-muted-foreground">{item.value}</p>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-serif text-3xl lg:text-4xl text-foreground mb-4">
                Envíanos un mensaje
              </h2>
              <p className="text-muted-foreground">
                Completa el formulario y te responderemos lo antes posible
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

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium text-foreground mb-2">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder="Tu nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="w-full px-4 py-3.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="correo" className="block text-sm font-medium text-foreground mb-2">
                    Correo electronico *
                  </label>
                  <input
                    type="email"
                    id="correo"
                    name="correo"
                    placeholder="tu@correo.com"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    className="w-full px-4 py-3.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="asunto" className="block text-sm font-medium text-foreground mb-2">
                  Asunto *
                </label>
                <input
                  type="text"
                  id="asunto"
                  name="asunto"
                  placeholder="De que te gustaria hablar?"
                  value={formData.asunto}
                  onChange={(e) => setFormData({ ...formData, asunto: e.target.value })}
                  className="w-full px-4 py-3.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="mensaje" className="block text-sm font-medium text-foreground mb-2">
                  Mensaje *
                </label>
                <textarea
                  id="mensaje"
                  name="mensaje"
                  placeholder="Escribe tu mensaje aqui..."
                  value={formData.mensaje}
                  onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-3.5 bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all resize-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-foreground text-background font-medium rounded-lg hover:bg-foreground/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </motion.form>
          </div>
        </section>

        {/* Map iframe */}
        <section className="h-96 w-full relative border-y border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.661596700762!2d-99.1648083850934!3d19.429215086884976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff35f609b787%3A0xfa719e7a83dfcfd0!2sAv.%20Paseo%20de%20la%20Reforma%20222%2C%20Ju%C3%A1rez%2C%20Cuauht%C3%A9moc%2C%2006600%20Ciudad%20de%20M%C3%A9xico%2C%20CDMX!5e0!3m2!1ses-419!2smx!4v1653841000000!5m2!1ses-419!2smx"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de ubicación de la tienda"
            className="w-full h-full absolute inset-0"
          ></iframe>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default function ContactoPage() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <ContactoContent />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
