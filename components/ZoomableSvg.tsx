import React, { useEffect, useRef } from 'react';
import { SvgToolbelt, SvgEnhancerConfig } from 'svg-toolbelt';
import 'svg-toolbelt/dist/svg-toolbelt.css';

interface ZoomableSvgProps {
  children: React.ReactNode;
  config?: Partial<SvgEnhancerConfig>;
  className?: string;
}

export function ZoomableSvg({ children, config, className }: ZoomableSvgProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const enhancerRef = useRef<SvgToolbelt | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      enhancerRef.current = new SvgToolbelt(containerRef.current, config);
      enhancerRef.current.init();
    }

    return () => {
      enhancerRef.current?.destroy();
    };
  }, [config]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}