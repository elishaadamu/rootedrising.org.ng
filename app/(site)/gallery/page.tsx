"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Metadata } from "next";


import Hero from "@/components/common/Hero";
import { useState } from "react";
import ImageLightbox from "@/components/common/ImageLightbox";

const galleryImages = [
  "/images/gallery/about-2.png", 
  "/images/gallery/campaign-hero-1.jpg", 
  "/images/gallery/campaign-hero.jpg", 
  "/images/gallery/img_5932.jpg", 
  "/images/gallery/screenshot-42-.png", 
  "/images/gallery/screenshot-44-.png", 
  "/images/gallery/whatsapp-image-2025-03-12-at-14.52.32_271106fc.jpg", 
  "/images/gallery/whatsapp-image-2025-03-12-at-14.52.32_b03dddb8.jpg",
  "/images/gallery/whatsapp-image-2025-03-12-at-14.58.48_672fd971.jpg", 
  "/images/gallery/whatsapp-image-2025-03-12-at-18.08.58_26cb79ea.jpg", 
  "/images/gallery/whatsapp-image-2025-03-12-at-18.08.58_43a30e6d.jpg", 
  "/images/gallery/whatsapp-image-2025-03-12-at-18.08.58_a7f9e50e.jpg",
  "/images/gallery/whatsapp-image-2025-03-17-at-01.12.02_ec894ad6.jpg", 
  "/images/gallery/whatsapp-image-2025-06-15-at-22.12.27_a35a7497.jpg", 
  "/images/gallery/whatsapp-image-2025-08-26-at-08.18.24_87c5139b.jpg", 
  "/images/gallery/whatsapp-image-2025-10-21-at-22.19.23_805ef360.jpg",
  "/images/gallery/whatsapp-image-2025-10-21-at-22.19.23_c71e17ec.jpg"
];

const fadeIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" } }
} as any;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
} as any;

export default function GalleryPage() {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="flex flex-col">
      <Hero 
        title="Impact Gallery"
        subtitle="Visual stories representing our community co-creation, youth leadership, and local climate action."
        backgroundImage="/images/gallery/campaign-hero-1.jpg"
      />

      <section className="section-padding bg-slate-50">
        <div className="mx-auto max-w-7xl">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="columns-1 sm:columns-2 lg:columns-3 gap-8 space-y-8"
          >
            {galleryImages.map((img, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                onClick={() => openLightbox(i)}
              >
                <div className="relative">
                    <Image 
                      src={img} 
                      alt={`Impact story ${i}`}
                      width={800}
                      height={600}
                      className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                    />
                </div>
                <div className="absolute inset-0 bg-linear-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-6 left-6 text-white font-bold text-lg">
                    Story of Impact #{i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <ImageLightbox 
        images={galleryImages}
        currentIndex={currentIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onPrev={() => setCurrentIndex((currentIndex - 1 + galleryImages.length) % galleryImages.length)}
        onNext={() => setCurrentIndex((currentIndex + 1) % galleryImages.length)}
      />
    </div>
  );
}
