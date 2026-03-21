"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MoveLeft, Home, Search, Compass } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/common/Footer"), { ssr: true });

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="grow">
        <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6 py-24">
          {/* Dynamic Background Elements */}
          <div className="absolute inset-0 -z-10 bg-slate-50/70">
            <div className="absolute inset-0 square-grid opacity-[0.12]"></div>
            
            {/* Animated Blobs */}
            <motion.div 
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -30, 0]
              }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-orange/10 rounded-full blur-[120px] opacity-40"
            ></motion.div>
            
            <motion.div 
              animate={{ 
                scale: [1, 1.3, 1],
                x: [0, -60, 0],
                y: [0, 40, 0]
              }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 2 }}
              className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-brand-navy/5 rounded-full blur-[100px] opacity-30"
            ></motion.div>
          </div>

          <div className="max-w-4xl w-full text-center relative z-10">
            {/* Large 404 Display */}
            <div className="relative mb-12 flex justify-center items-center">
              <motion.h1
                initial={{ opacity: 0, scale: 0.5, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 10,
                  duration: 0.8 
                }}
                className="text-[12rem] md:text-[20rem] font-black leading-none tracking-tight text-brand-navy/5 select-none"
              >
                404
              </motion.h1>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 200, damping: 15 }}
                  className="relative"
                >
                  <div className="p-8 md:p-12 rounded-full bg-white shadow-2xl shadow-brand-orange/20 border border-brand-orange/20">
                    <div className="hover:scale-110 transition-transform">
                      <Compass size={80} className="text-brand-orange md:w-32 md:h-32" strokeWidth={1.5} />
                    </div>
                  </div>
                  
                  <div className="absolute -inset-4 border-2 border-dashed border-brand-orange/30 rounded-full"></div>
                </motion.div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-4xl md:text-6xl font-black text-brand-navy mb-6 tracking-tight">
                Lost in the Wilderness?
              </h2>
              <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed px-4">
                The page you are looking for has moved or no longer exists. 
                Let's get you back on track to exploring our mission.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link 
                  href="/"
                  className="group flex items-center gap-3 bg-brand-navy text-white px-10 py-5 rounded-full font-black text-lg transition-all hover:bg-brand-navy/90 hover:scale-[1.03] active:scale-[0.98] shadow-2xl shadow-brand-navy/20"
                >
                  <Home size={22} />
                  Return to Home
                </Link>
                
                <button 
                  onClick={() => window.history.back()}
                  className="group flex items-center gap-3 bg-white text-brand-navy border-2 border-brand-navy/10 px-10 py-5 rounded-full font-black text-lg transition-all hover:border-brand-navy/30 hover:bg-slate-50 active:scale-[0.98] shadow-lg shadow-black/5"
                >
                  <MoveLeft size={22} className="transition-transform group-hover:-translate-x-1" />
                  Go Back
                </button>
              </div>
            </motion.div>

            {/* Support Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
              className="mt-24 pt-12 border-t border-slate-200/60 max-w-sm mx-auto"
            >
              <p className="text-sm font-bold text-slate-400 uppercase tracking-[0.3em]">
                Rooted Rising Initiative
              </p>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

