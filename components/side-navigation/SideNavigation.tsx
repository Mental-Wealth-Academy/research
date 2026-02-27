'use client';
import Link from 'next/link';

export default function SideNavigation({ children }: { children?: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <nav style={{ width: 60, background: '#1A1B24', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1rem 0', gap: '1rem' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.5rem' }} title="Mental Wealth Academy">M</Link>
      </nav>
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
