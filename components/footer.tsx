'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';

const footerLinks = {
  tienda: [
    { label: 'Catalogo', href: '/catalogo' },
    { label: 'Novedades', href: '/novedades' },
    { label: 'Ofertas', href: '/ofertas' },
    { label: 'Colecciones', href: '/colecciones' }
  ],
  ayuda: [
    { label: 'Guia de tallas', href: '/tallas' },
    { label: 'Envios', href: '/envios' },
    { label: 'Devoluciones', href: '/devoluciones' },
    { label: 'FAQ', href: '/faq' }
  ],
  empresa: [
    { label: 'Sobre nosotros', href: '/nosotros' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Blog', href: '/blog' },
    { label: 'Trabaja con nosotros', href: '/empleos' }
  ]
};

const socialLinks = [
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Facebook, href: '#', label: 'Facebook' }
];

export function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-serif">Florencia</h3>
              <p className="mt-4 text-background/60 text-sm leading-relaxed">
                Moda femenina para todas las edades. Elegancia, estilo y calidad en cada prenda.
              </p>

              {/* Social links */}
              <div className="mt-6 flex gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="w-10 h-10 rounded-full border border-background/20 flex items-center justify-center hover:bg-background/10 transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-medium mb-4 text-sm tracking-wide">Tienda</h4>
            <ul className="space-y-3">
              {footerLinks.tienda.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-medium mb-4 text-sm tracking-wide">Ayuda</h4>
            <ul className="space-y-3">
              {footerLinks.ayuda.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-medium mb-4 text-sm tracking-wide">Empresa</h4>
            <ul className="space-y-3">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 hover:text-background transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="col-span-2 md:col-span-1"
          >
            <h4 className="font-medium mb-4 text-sm tracking-wide">Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-background/60">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>Av. Reforma 222, CDMX</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>+52 (55) 1234 5678</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-background/60">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span>hola@florencia.com</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/50">
            2026 Florencia. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/privacidad" className="text-sm text-background/50 hover:text-background transition-colors">
              Privacidad
            </Link>
            <Link href="/terminos" className="text-sm text-background/50 hover:text-background transition-colors">
              Terminos
            </Link>
            <Link href="/cookies" className="text-sm text-background/50 hover:text-background transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
