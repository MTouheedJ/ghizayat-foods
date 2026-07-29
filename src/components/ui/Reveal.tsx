import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "scale" | "none";

type Props = {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  duration?: number;
  className?: string;
  /** Stagger children instead of animating the wrapper as one block. */
  stagger?: number;
  as?: "div" | "section" | "ul" | "li" | "span";
};

const OFFSETS: Record<Direction, { x?: number; y?: number; scale?: number }> = {
  up: { y: 28 },
  down: { y: -28 },
  left: { x: 32 },
  right: { x: -32 },
  scale: { scale: 0.94 },
  none: {},
};

/**
 * Scroll-triggered reveal.
 *
 * Runs once, uses transform/opacity only (compositor-friendly, no layout
 * thrash), and collapses to an instant no-op when the OS asks for reduced
 * motion — which also keeps it from interfering with LCP measurement.
 */
export default function Reveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.55,
  className,
  stagger,
  as = "div",
}: Props) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSETS[direction];

  const container: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration,
            delay,
            ease: [0.22, 1, 0.36, 1],
            ...(stagger ? { staggerChildren: stagger, delayChildren: delay } : {}),
          },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      variants={container}
      initial={reduceMotion ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -80px 0px" }}
    >
      {children}
    </MotionTag>
  );
}

/** Child of a <Reveal stagger={...}> — inherits the parent's timeline. */
export function RevealItem({
  children,
  className,
  direction = "up",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  direction?: Direction;
  as?: "div" | "li" | "span";
}) {
  const reduceMotion = useReducedMotion();
  const offset = OFFSETS[direction];

  const item: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const MotionTag = motion[as];

  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}
