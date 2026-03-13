"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Maximize2 } from "lucide-react";
import ImageLightbox from "@/components/common/ImageLightbox";

const homeImages = [
  "/images/gallery/campaign-hero.jpg", 
  "/images/gallery/campaign-hero-1.jpg", 
  "/images/gallery/whatsapp-image-2025-03-12-at-18.08.58_43a30e6d.jpg",
  "/images/gallery/img_5932.jpg",
  "/images/gallery/screenshot-42-.png",
  "/images/gallery/whatsapp-image-2025-03-12-at-14.52.32_271106fc.jpg"
];

export default function GallerySection() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <section className="section-padding bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-orange">Visual Impact</h2>
            <h3 className="text-3xl font-extrabold text-slate-900 md:text-5xl leading-tight">
              Moments of <span className="header-highlight highlight-cyan text-brand-navy">Co-Creation</span>
            </h3>
          </div>
          <Link 
            href="/gallery" 
            className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-base font-bold text-slate-900 transition-all hover:border-brand-navy hover:bg-slate-50 active:scale-95"
          >
            See Full Gallery
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {homeImages.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-[2.5rem] bg-slate-100 cursor-pointer shadow-sm hover:shadow-2xl transition-all"
              onClick={() => openLightbox(i)}
            >
              <Image 
                src={img} 
                alt={`Impact story ${i}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
              />
              <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white scale-75 group-hover:scale-100 transition-transform duration-500">
                  <Maximize2 size={24} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ImageLightbox 
        images={homeImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentIndex((currentIndex - 1 + homeImages.length) % homeImages.length)}
        onNext={() => setCurrentIndex((currentIndex + 1) % homeImages.length)}
      />
    </section>
  );
}
