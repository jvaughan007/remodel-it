'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const services = [
    'Kitchen Remodeling',
    'Bathroom Renovation',
    'Whole Home Remodel',
    'Home Additions',
    'Outdoor Living',
    'Flooring Installation'
  ];

  const serviceAreas = [
    'Dallas', 'Fort Worth', 'Plano', 'Frisco',
    'McKinney', 'Arlington', 'Irving', 'Southlake',
    'Colleyville', 'Grapevine'
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="text-2xl font-bold gradient-text font-serif mb-4">
              Trinity Remodeling
            </h3>
            <p className="text-gray-300 mb-6">
              Transform your home with Dallas/Fort Worth&apos;s premier remodeling experts.
              Quality craftsmanship, innovative design, and exceptional service since 2010.
            </p>
            <div className="space-y-2 text-gray-300">
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
                </svg>
                <a href="tel:9725558746" className="hover:text-white transition-colors" style={{ color: 'var(--accent-teal)' }}>
                  (972) 555-TRIN
                </a>
              </p>
              <p className="flex items-center">
                <svg className="w-5 h-5 mr-2" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
                hello@trinityremodelingdfw.com
              </p>
              <p className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-1" style={{ color: 'var(--accent-teal)' }} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                </svg>
                <span>
                  123 Trinity Drive<br />
                  Dallas, TX 75201
                </span>
              </p>
            </div>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--accent-teal)' }}>Our Services</h4>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    href="/services"
                    className="text-gray-300 transition-colors"
                    style={{ textDecoration: 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Service Areas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--accent-teal)' }}>Service Areas</h4>
            <div className="grid grid-cols-2 gap-1 text-sm text-gray-300">
              {serviceAreas.map((area, index) => (
                <div key={index} className="transition-colors cursor-pointer"
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                >
                  {area}
                </div>
              ))}
            </div>
            <p className="text-gray-400 text-sm mt-4">
              And surrounding DFW metropolitan areas
            </p>
          </motion.div>

          {/* Quick Links & Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--accent-teal)' }}>Quick Links</h4>
            <ul className="space-y-2 mb-6">
              <li><Link href="/about" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>About Us</Link></li>
              <li><Link href="/gallery" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>Portfolio</Link></li>
              <li><Link href="/quote" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>Free Estimate</Link></li>
              <li><Link href="/contact" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>Contact</Link></li>
            </ul>

            <h5 className="text-sm font-semibold mb-3" style={{ color: 'var(--accent-teal)' }}>Follow Us</h5>
            <div className="flex space-x-4">
              {/* Facebook */}
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.987-5.367 11.987-11.988C24.014 5.367 18.647.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.653 13.455 3.653 11.987s.545-2.908 1.473-3.704c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.473 2.236 1.473 3.704s-.545 2.908-1.473 3.704c-.875.807-2.026 1.297-3.323 1.297zm7.119 0c-1.297 0-2.448-.49-3.323-1.297-.928-.796-1.473-2.236-1.473-3.704s.545-2.908 1.473-3.704c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.928.796 1.473 2.236 1.473 3.704s-.545 2.908-1.473 3.704c-.875.807-2.026 1.297-3.323 1.297z"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="text-gray-300 transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400"
        >
          <p>&copy; {currentYear} Trinity Remodeling. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <Link href="/privacy" className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms" className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>Terms of Service</Link>
            <span>•</span>
            <Link href="/sitemap" className="transition-colors" onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-teal)'; }} onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}>Sitemap</Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
