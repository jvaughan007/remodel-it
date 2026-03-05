'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

const PhoneIcon = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  const navBg = scrolled
    ? 'rgba(255,255,255,0.97)'
    : 'rgba(10,26,47,0.82)';

  const navShadow = scrolled
    ? '0 2px 16px 0 rgba(0,0,0,0.10)'
    : 'none';

  const linkColor = (href: string) =>
    pathname === href
      ? 'var(--accent-teal)'
      : scrolled
      ? '#1f2937'
      : '#ffffff';

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        width: '100%',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        backgroundColor: navBg,
        backdropFilter: scrolled ? 'blur(12px)' : 'blur(6px)',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'blur(6px)',
        boxShadow: navShadow,
      }}
    >
      {/* Inner content wrapper: centered, max-width, responsive horizontal padding */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 lg:py-3.5">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0 no-underline"
            aria-label="Trinity Remodeling home"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/trinity-logo.png"
              alt=""
              aria-hidden="true"
              className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 object-contain"
            />
            <span
              className="font-bold leading-tight whitespace-nowrap"
              style={{
                fontFamily: 'var(--font-playfair), serif',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                color: scrolled ? 'var(--deep-navy)' : '#ffffff',
                letterSpacing: '-0.01em',
              }}
            >
              <span style={{ color: 'var(--accent-teal)' }}>Trinity</span>
              {' '}Remodeling
            </span>
          </Link>

          {/* ── Desktop nav links (lg+) ── */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8 flex-shrink-0">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative font-medium text-sm xl:text-base no-underline transition-colors duration-200"
                style={{ color: linkColor(item.href) }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--accent-teal)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = linkColor(item.href);
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
                      backgroundColor: 'var(--accent-teal)',
                      borderRadius: '1px',
                    }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* ── Desktop right-side actions (lg+) ── */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-5 flex-shrink-0">
            {/* Phone number: hidden on md (tablet), shown on lg (desktop) */}
            <a
              href="tel:9725558746"
              className="flex items-center gap-1.5 font-semibold text-sm no-underline whitespace-nowrap transition-colors duration-200"
              style={{ color: scrolled ? 'var(--deep-navy)' : '#ffffff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-teal)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = scrolled ? 'var(--deep-navy)' : '#ffffff';
              }}
              aria-label="Call us at (972) 555-TRIN"
            >
              <PhoneIcon />
              (972) 555-TRIN
            </a>

            <Link
              href="/quote"
              className="btn-primary whitespace-nowrap"
              style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}
            >
              Free Quote
            </Link>
          </div>

          {/* ── Tablet: show phone + quote, hide full nav links (md only) ── */}
          <div className="hidden md:flex lg:hidden items-center gap-3 flex-shrink-0">
            <a
              href="tel:9725558746"
              className="flex items-center gap-1 font-semibold text-sm no-underline whitespace-nowrap transition-colors duration-200"
              style={{ color: scrolled ? 'var(--deep-navy)' : '#ffffff' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--accent-teal)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = scrolled ? 'var(--deep-navy)' : '#ffffff';
              }}
              aria-label="Call us at (972) 555-TRIN"
            >
              <PhoneIcon />
              <span className="hidden sm:inline">(972) 555-TRIN</span>
            </a>

            <Link
              href="/quote"
              className="btn-primary whitespace-nowrap"
              style={{ padding: '0.4rem 1rem', fontSize: '0.8125rem' }}
            >
              Free Quote
            </Link>
          </div>

          {/* ── Hamburger button (shown on mobile < md, and tablet md-lg) ── */}
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg flex-shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: scrolled ? '#1f2937' : '#ffffff',
              // Ensure ring color matches brand on focus
            }}
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            {/* Animated hamburger / X icon */}
            <div
              style={{
                width: '22px',
                height: '18px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  width: '22px',
                  backgroundColor: 'currentColor',
                  borderRadius: '1px',
                  transformOrigin: 'center',
                  transform: isOpen ? 'translateY(8px) rotate(45deg)' : 'none',
                  transition: 'transform 0.28s ease',
                }}
              />
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  width: '22px',
                  backgroundColor: 'currentColor',
                  borderRadius: '1px',
                  opacity: isOpen ? 0 : 1,
                  transform: isOpen ? 'scaleX(0)' : 'scaleX(1)',
                  transition: 'opacity 0.2s ease, transform 0.2s ease',
                }}
              />
              <span
                style={{
                  display: 'block',
                  height: '2px',
                  width: '22px',
                  backgroundColor: 'currentColor',
                  borderRadius: '1px',
                  transformOrigin: 'center',
                  transform: isOpen ? 'translateY(-8px) rotate(-45deg)' : 'none',
                  transition: 'transform 0.28s ease',
                }}
              />
            </div>
          </motion.button>
        </div>
      </div>

      {/* ── Mobile / Tablet drawer (below lg) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-label="Navigation menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
            style={{
              backgroundColor: '#ffffff',
              borderTop: '1px solid #e5e7eb',
              boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
            }}
          >
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-1">

              {/* Nav links */}
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.07, duration: 0.2 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center no-underline rounded-md transition-colors duration-150"
                    style={{
                      padding: '0.625rem 0.75rem',
                      color: pathname === item.href ? 'var(--accent-teal)' : '#1f2937',
                      fontWeight: pathname === item.href ? 600 : 500,
                      fontSize: '0.9375rem',
                      backgroundColor: pathname === item.href ? 'rgba(43,182,201,0.07)' : 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      if (pathname !== item.href) {
                        e.currentTarget.style.backgroundColor = '#f3f4f6';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        pathname === item.href ? 'rgba(43,182,201,0.07)' : 'transparent';
                    }}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* Divider */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: navItems.length * 0.07 }}
                style={{
                  height: '1px',
                  backgroundColor: '#e5e7eb',
                  margin: '0.5rem 0.75rem',
                }}
              />

              {/* Phone + Quote row */}
              <motion.div
                initial={{ x: -16, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navItems.length + 1) * 0.07, duration: 0.2 }}
                className="flex flex-col sm:flex-row sm:items-center gap-3 px-3 pb-2"
              >
                <a
                  href="tel:9725558746"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 no-underline font-semibold transition-colors duration-150"
                  style={{
                    color: 'var(--deep-navy)',
                    fontSize: '0.9375rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--accent-teal)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--deep-navy)';
                  }}
                  aria-label="Call us at (972) 555-TRIN"
                >
                  <PhoneIcon />
                  (972) 555-TRIN
                </a>

                <Link
                  href="/quote"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-center"
                  style={{
                    padding: '0.5rem 1.5rem',
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  Free Quote
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navigation;
