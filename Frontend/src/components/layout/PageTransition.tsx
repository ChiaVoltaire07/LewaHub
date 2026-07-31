import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState("fadeIn");
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    if (location.pathname !== prevPathRef.current) {
      setTransitionStage("fadeOut");
      prevPathRef.current = location.pathname;
    }
  }, [location.pathname]);

  const handleAnimationComplete = () => {
    if (transitionStage === "fadeOut") {
      setDisplayChildren(children);
      setTransitionStage("fadeIn");
    }
  };

  useEffect(() => {
    if (transitionStage === "fadeIn") {
      setDisplayChildren(children);
    }
  }, [children, transitionStage]);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== "undefined"
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={false}
      animate={
        transitionStage === "fadeIn"
          ? { opacity: 1 }
          : { opacity: 0 }
      }
      transition={{ duration: 0.2, ease: "easeOut" }}
      onAnimationComplete={handleAnimationComplete}
    >
      {displayChildren}
    </motion.div>
  );
}