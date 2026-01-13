"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface GyroParallaxProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
}

export default function GyroParallax({ children, className = "", intensity = 20 }: GyroParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 50, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-intensity, intensity]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return;
      
      const rect = ref.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      
      const mouseXFromCenter = e.clientX - rect.left - width / 2;
      const mouseYFromCenter = e.clientY - rect.top - height / 2;
      
      x.set(mouseXFromCenter / width);
      y.set(mouseYFromCenter / height);
    };

    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta && e.gamma) {
        // beta: front to back (-180 to 180)
        // gamma: left to right (-90 to 90)
        // Clamp values for subtle effect
        const beta = Math.min(Math.max(e.beta, -45), 45);
        const gamma = Math.min(Math.max(e.gamma, -45), 45);
        
        y.set(beta / 45); // Map to -1 to 1
        x.set(gamma / 45);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    if (window.DeviceOrientationEvent) {
      window.addEventListener("deviceorientation", handleDeviceOrientation);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (window.DeviceOrientationEvent) {
        window.removeEventListener("deviceorientation", handleDeviceOrientation);
      }
    };
  }, [x, y]);

  return (
    <motion.div
      ref={ref}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
}
