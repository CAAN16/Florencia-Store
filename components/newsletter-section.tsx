'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { newsletterService } from '@/services/newsletter.service';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setFeedbackMsg('');
    setIsError(false);

    try {
      const response = await newsletterService.subscribeNewsletter(email);
      if (response.success) {
        setIsSubmitted(true);
        setFeedbackMsg(response.message || '¡Gracias por suscribirte!');
        setEmail('');
        setTimeout(() => {
          setIsSubmitted(false);
          setFeedbackMsg('');
        }, 5000);
      } else {
        setIsError(true);
        setFeedbackMsg(response.message || 'Ocurrió un error. Intenta de nuevo.');
      }
    } catch (error: any) {
      setIsError(true);
      setFeedbackMsg(error.message || 'Error de conexión. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider">
            Newsletter
          </span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-serif font-bold text-balance">
            Únete a nuestra comunidad
          </h2>
          <p className="mt-4 text-muted-foreground">
            Recibe un 10% de descuento en tu primera compra y entérate de las últimas novedades y ofertas exclusivas.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="flex-1 px-6 py-3 rounded-full bg-card border border-border focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
            required
            disabled={isSubmitting || isSubmitted}
          />
          <Button type="submit" size="lg" className="rounded-full px-8" disabled={isSubmitting || isSubmitted}>
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
            ) : isSubmitted ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
              >
                ¡Listo!
              </motion.span>
            ) : (
              <>
                Suscribirse
                <Send size={16} className="ml-2" />
              </>
            )}
          </Button>
        </motion.form>

        {feedbackMsg && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-sm font-medium ${isError ? 'text-destructive' : 'text-emerald-600'}`}
          >
            {feedbackMsg}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-4 text-xs text-muted-foreground"
        >
          Al suscribirte, aceptas recibir comunicaciones de marketing. Puedes darte de baja en cualquier momento.
        </motion.p>
      </div>
    </section>
  );
}
