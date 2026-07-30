"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Reveal all'ingresso in viewport. Uno dei tre soli casi di motion previsti.
 * Con prefers-reduced-motion non anima: rende un div statico.
 */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  // Anima all'ingresso in viewport, ma NON resta mai invisibile: se l'osservatore
  // non scatta (es. screenshot "pagina intera"), l'animate lo porta comunque a
  // opacità piena. `once` evita ripetizioni.
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
