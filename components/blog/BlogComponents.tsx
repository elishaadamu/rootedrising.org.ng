"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, User, ArrowRight, Star, Mail } from "lucide-react";
import { useState } from "react";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  category: string;
  section?: string;
  author: string;
  rating?: number;
}

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  // Defensive check for image
  const validImage = typeof post.image === 'string' && post.image.trim().length > 0;
  const imageUrl = validImage ? post.image as string : "/images/gallery/IMG_2023.JPG";

  // Robust Date Handling for URL construction
  const dateObj = new Date(post.date || Date.now());
  const isValidDate = !isNaN(dateObj.getTime());
  
  const formattedDate = isValidDate ? dateObj.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }) : "Recent Story";
  
  const year = isValidDate ? dateObj.getFullYear() : new Date().getFullYear();
  const month = isValidDate ? String(dateObj.getMonth() + 1).padStart(2, '0') : '01';
  const day = isValidDate ? String(dateObj.getDate()).padStart(2, '0') : '01';
  
  // URL Construction: Handle category/section fallback
  const catSlug = (post.category || post.section || "insight").toLowerCase().trim().replace(/\s+/g, '-');
  const articleUrl = `/${catSlug}/${year}/${month}/${day}/${post.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className="group h-full"
    >
      <Link 
        href={articleUrl}
        className="flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 active:scale-[0.98] group/card"
      >
        {/* Image Container */}
        <div className="relative aspect-video overflow-hidden shrink-0">
          <Image
            src={imageUrl}
            alt={post.title || "Blog Post"}
            fill
            className="object-cover transition-transform duration-700 group-hover/card:scale-110"
          />
          {/* Subtle Overlay on Hover */}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"></div>
          
          <div className="absolute top-6 left-6 z-10">
            <span className="rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-white border border-white/30 shadow-xl">
              {post.category || post.section}
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 flex-col p-8 lg:p-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
               <span className="text-brand-cyan">{formattedDate}</span>
               <span className="h-1 w-1 rounded-full bg-slate-200"></span>
               <span className="text-brand-teal">{post.author}</span>
            </div>
            {post.rating !== undefined && post.rating > 0 && (
              <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-2.5 py-1 rounded-xl text-[10px] font-black">
                <Star className="h-3 w-3 fill-amber-500" />
                {post.rating.toFixed(1)}
              </div>
            )}
          </div>

          <h3 className="mb-4 text-2xl font-black leading-tight text-slate-900 group-hover/card:text-brand-forest transition-colors line-clamp-2 tracking-tight">
            {post.title}
          </h3>

          <p className="mb-8 text-slate-500 text-[15px] leading-relaxed font-medium line-clamp-3">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between pointer-events-none">
             <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-brand-forest transition-all group-hover/card:gap-3">
              Read Story
              <ArrowRight size={14} className="transition-transform group-hover/card:translate-x-1" />
            </div>
            <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover/card:bg-brand-forest/10 group-hover/card:text-brand-forest transition-all">
               <ArrowRight size={18} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function BlogSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="section-padding bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 square-grid opacity-50"></div>
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 flex flex-col items-center justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-teal flex items-center gap-3">
              <span className="h-0.5 w-10 bg-brand-teal"></span>
              Community Stories
            </h2>
          <h3 className="text-3xl font-extrabold text-slate-900 md:text-5xl leading-tight">
            Latest from <Link href="/blogs" className="header-highlight highlight-yellow text-slate-900 hover:opacity-80 transition-opacity">our Blog</Link>
          </h3>
          </div>
          <Link
            href="/blogs"
            className="group flex items-center gap-2 rounded-full border-2 border-brand-forest px-8 py-3 text-sm font-bold text-brand-forest transition-all hover:bg-brand-forest hover:text-white"
          >
            View All Posts
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function BlogSidebar({ recentPosts, categories = [] }: { recentPosts: any[], categories?: any[] }) {
  return (
    <aside className="space-y-12">
      {/* Search or About could go here */}
      
      {/* Categories */}
      <div className="bg-slate-50 rounded-[2.5rem] p-8 sm:p-10 border border-slate-100">
        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-brand-forest"></span>
          Categories
        </h4>
        <div className="space-y-4">
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/blogs/${cat.slug}`}
              className="flex items-center justify-between group py-2"
            >
              <span className="text-sm font-bold text-slate-600 group-hover:text-brand-forest transition-colors flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-200 group-hover:bg-brand-forest transition-colors"></span>
                {cat.name}
              </span>
              <span className="text-[10px] font-black text-slate-300 group-hover:text-brand-forest/40 transition-colors">
                {cat.count}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-white rounded-[2.5rem] p-8 sm:p-10 border border-slate-100 shadow-sm">
        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 mb-8 flex items-center gap-3">
          <span className="w-8 h-px bg-brand-orange"></span>
          Recent Stories
        </h4>
        <div className="space-y-8">
          {recentPosts.map((post) => {
             const dateObj = new Date(post.createdAt || post.date);
             const year = dateObj.getFullYear();
             const month = String(dateObj.getMonth() + 1).padStart(2, '0');
             const day = String(dateObj.getDate()).padStart(2, '0');
             const catSlug = (post.section || post.category || "insight").toLowerCase();
             const url = `/${catSlug}/${year}/${month}/${day}/${post.slug}`;

             return (
               <Link key={post.slug} href={url} className="flex gap-4 group">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100">
                     <Image 
                       src={post.image || "/images/placeholder.png"} 
                       alt={post.title}
                       fill
                       className="object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                  </div>
                  <div className="flex flex-col justify-center">
                     <span className="text-[9px] font-black uppercase tracking-widest text-brand-teal mb-1 opacity-60">
                        {post.section || post.category}
                     </span>
                     <h5 className="text-[13px] font-extrabold text-slate-900 leading-tight line-clamp-2 group-hover:text-brand-teal transition-colors">
                        {post.title}
                     </h5>
                  </div>
               </Link>
             );
          })}
        </div>
      </div>

    </aside>

  );
}
