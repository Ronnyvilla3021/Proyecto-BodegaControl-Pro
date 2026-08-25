import type { ReactNode } from 'react';

export default function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`card p-6 text-[#1a2333] dark:text-[#e8ebf5] ${className}`}>
      {children}
    </div>
  );
}