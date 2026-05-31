import React from 'react';
import { motion, Variants } from 'framer-motion';

/** Variants cho container — stagger các children */
export const staggerContainer: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.1,
    },
  },
};

/** Variants cho từng card item — fade + slide up */
export const cardVariant: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Container bọc danh sách item, tự động stagger từng children.
 * Dùng kết hợp với <AnimatedItem> cho mỗi card.
 */
export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className,
  style,
}) => (
  <motion.div
    variants={staggerContainer}
    initial="hidden"
    animate="show"
    className={className}
    style={style}
  >
    {children}
  </motion.div>
);

interface AnimatedItemProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Wrapper cho từng item bên trong StaggerContainer.
 * Tự động nhận stagger delay từ parent.
 */
export const AnimatedItem: React.FC<AnimatedItemProps> = ({
  children,
  className,
  style,
}) => (
  <motion.div
    variants={cardVariant}
    className={className}
    style={style}
    whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
);

/** Fade in đơn giản, không có stagger — dùng cho section header, stats */
interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  style,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45, delay, ease: 'easeOut' }}
    style={style}
    className={className}
  >
    {children}
  </motion.div>
);
