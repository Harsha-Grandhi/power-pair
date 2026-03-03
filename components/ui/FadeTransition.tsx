'use client';

import React, { useEffect, useState } from 'react';

interface FadeTransitionProps {
  children: React.ReactNode;
  transitionKey: string | number;
  className?: string;
}

/**
 * Fades out on transitionKey change, then fades the new children back in.
 * Children are rendered directly (never cached) so controlled inputs stay live.
 */
export default function FadeTransition({
  children,
  transitionKey,
  className = '',
}: FadeTransitionProps) {
  const [visible, setVisible] = useState(false);

  // Fade out → swap → fade in when the key changes
  useEffect(() => {
    setVisible(false);
    const t = setTimeout(() => setVisible(true), 180);
    return () => clearTimeout(t);
  }, [transitionKey]);

  // Initial mount fade-in
  useEffect(() => {
    setVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      } ${className}`}
    >
      {children}
    </div>
  );
}
