"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, User, ArrowRight, Star } from "lucide-react";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  category: string;
  author: string;
  rating?: number;
}

export function BlogCard({ post, index }: { post: BlogPost; index: number }) {
  // Defensive check for image to avoid "Image missing required src property: {}"
  // This handles cases where post.image might be an empty string, null, or an unexpected object
  const validImage = typeof post.image === 'string' && post.image.trim().length > 0;
  const imageUrl = validImage ? post.image as string : "/images/gallery/IMG_2023.JPG";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link 
        href={`/blog/${post.slug}`}
        className="flex flex-col h-full overflow-hidden rounded-[2.5rem] bg-white shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 border border-slate-100"
      >
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={post.title || "Blog Post"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-6 left-6">
            <span className="rounded-full bg-brand-forest/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
              {post.category}
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-8 md:p-10">
          <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold uppercase tracking-widest text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-cyan" />
              {post.date}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-brand-teal" />
              {post.author}
            </div>
            {post.rating !== undefined && post.rating > 0 && (
              <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-3 py-1 rounded-full">
                <Star className="h-3 w-3 fill-amber-500" />
                {post.rating.toFixed(1)}
              </div>
            )}
          </div>

          <h3 className="mb-4 text-2xl font-extrabold leading-tight text-slate-900 group-hover:text-brand-forest transition-colors line-clamp-2">
            {post.title}
          </h3>

          <p className="mb-8 text-slate-600 line-clamp-3 leading-relaxed">
            {post.excerpt}
          </p>

          <div className="mt-auto pt-6 border-t border-slate-100">
            <div className="inline-flex items-center gap-2 font-bold text-brand-forest transition-all group-hover:gap-3">
              Read Perspective
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
              Latest from <Link href="/blog" className="header-highlight highlight-yellow text-slate-900 hover:opacity-80 transition-opacity">our Blog</Link>
            </h3>
          </div>
          <Link
            href="/blog"
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
