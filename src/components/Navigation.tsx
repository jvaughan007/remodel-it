'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'all 0.3s',
        backgroundColor: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(17,24,39,0.8)',
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(4px)',
        boxShadow: scrolled ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0' }}>
          {/* Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <Image 
              src="/logo-icon.png" 
              alt="Trinity Remodeling" 
              width={48} 
              height={48} 
              style={{ borderRadius: '50%', objectFit: 'cover', width: '48px', height: '48px' }} 
            />
            <span style={{ 
              fontFamily: 'var(--font-playfair), serif',
              fontSize: '1.25rem', 
              fontWeight: 700, 
              color: scrolled ? '#0A1A2F' : '#ffffff' 
            }}>
              Trinity Remodeling
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  position: 'relative',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: pathname === item.href 
                    ? '#2BB6C9' 
                    : scrolled ? '#1f2937' : '#ffffff',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.color = '#2BB6C9'; }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.color = pathname === item.href 
                    ? '#2BB6C9' 
                    : scrolled ? '#1f2937' : '#ffffff'; 
                }}
              >
                {item.label}
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeTab"
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: 0,
                      right: 0,
                      height: '2px',
                      backgroundColor: '#2BB6C9',
                    }}
                  />
                )}
              </Link>
            ))}
            <Link href="/quote" className="btn-primary" style={{ marginLeft: '1rem' }}>
              Free Quote
            </Link>
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleMenu}
            className="md:hidden"
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: scrolled ? '#1f2937' : '#ffffff',
            }}
          >
            <div style={{ width: '24px', height: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  width: '24px',
                  backgroundColor: 'currentColor',
                  transform: isOpen ? 'rotate(45deg) translateY(4px)' : 'translateY(-4px)',
                  transition: 'transform 0.3s',
                }}
              />
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  width: '24px',
                  backgroundColor: 'currentColor',
                  opacity: isOpen ? 0 : 1,
                  transition: 'opacity 0.3s',
                }}
              />
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  width: '24px',
                  backgroundColor: 'currentColor',
                  transform: isOpen ? 'rotate(-45deg) translateY(-4px)' : 'translateY(4px)',
                  transition: 'transform 0.3s',
                }}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden"
              style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}
            >
              <div style={{ padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'block',
                        padding: '0.5rem 1rem',
                        color: pathname === item.href ? '#2BB6C9' : '#1f2937',
                        fontWeight: pathname === item.href ? 600 : 400,
                        textDecoration: 'none',
                      }}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  style={{ padding: '0.5rem 1rem' }}
                >
                  <Link
                    href="/quote"
                    onClick={() => setIsOpen(false)}
                    className="btn-primary"
                    style={{ display: 'block', textAlign: 'center' }}
                  >
                    Free Quote
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navigation;