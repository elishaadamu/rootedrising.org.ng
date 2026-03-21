"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  isDark?: boolean;
}

export default function Logo({ className, isDark = false }: LogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-3 transition-all hover:opacity-90 active:scale-95 group", className)}>
      <div className="relative h-14 w-32 overflow-hidden rounded-xl transition-all">
        <Image
          src="/images/logo.png"
          alt="REACT Logo"
          fill
          className="object-contain"
          priority
        />
      </div>
    </Link>
  );
}
