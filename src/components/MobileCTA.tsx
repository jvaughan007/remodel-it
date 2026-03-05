'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const MobileCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`mobile-cta ${visible ? 'visible' : ''}`}>
      <Link
        href="/quote"
        style={{
          flex: 1,
          display: 'block',
          textAlign: 'center',
          backgroundColor: 'var(--accent-teal)',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: 700,
          fontSize: '0.95rem',
          textDecoration: 'none',
        }}
      >
        Get Free Quote
      </Link>
      <a
        href="tel:9725558746"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.375rem',
          backgroundColor: 'transparent',
          border: '2px solid var(--accent-teal)',
          color: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          fontWeight: 700,
          fontSize: '0.95rem',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
        </svg>
        Call Now
      </a>
    </div>
  );
};

export default MobileCTA;
