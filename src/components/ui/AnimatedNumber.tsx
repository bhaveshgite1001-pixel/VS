'use client';

import React, { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedNumberProps {
  value: number;
  formatFn?: (val: number) => string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({ value, formatFn = (v) => v.toString(), className = '', duration = 800 }: AnimatedNumberProps) {
  const springValue = useSpring(value, {
    stiffness: 100,
    damping: 20,
    mass: 1,
    restDelta: 0.001
  });

  useEffect(() => {
    springValue.set(value);
  }, [value, springValue]);

  const displayValue = useTransform(springValue, (current) => formatFn(current));

  return (
    <motion.span className={className}>
      {displayValue}
    </motion.span>
  );
}
