'use client';
import styles from './Skeleton.module.css';

export function SurveysPageSkeleton() {
  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} style={{ height: 120, background: '#E1E1F4', borderRadius: 12, animation: 'pulse 1.5s ease-in-out infinite' }} />
      ))}
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}

export default function Skeleton({ width, height }: { width?: number | string; height?: number | string }) {
  return <div style={{ width: width || '100%', height: height || 20, background: '#E1E1F4', borderRadius: 8, animation: 'pulse 1.5s ease-in-out infinite' }} />;
}
