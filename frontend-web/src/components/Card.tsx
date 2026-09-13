import type { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`card ${className}`}
      style={{
        background: 'var(--color-card)',
        borderRadius: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05), 0 8px 24px rgba(0,0,0,0.03)',
        border: '1px solid rgba(226,232,240,0.8)',
        padding: '24px',
        transition: 'all 0.3s ease',
        color: 'var(--color-text-main)'
      }}
    >
      {children}
    </div>
  );
}