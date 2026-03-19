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

  const dateObj = new Date(post.date);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const catSlug = (post.category || "insight").toLowerCase();
  const articleUrl = `/${catSlug}/${year}/${month}/${day}/${post.slug}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link 
        href={articleUrl}
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

export function BlogSidebar({ recentPosts }: { recentPosts: any[] }) {
  const categories = [
    { name: "Articles", slug: "articles", count: 12 },
    { name: "Poems", slug: "poems", count: 5 },
    { name: "Research", slug: "research", count: 8 },
    { name: "Impact", slug: "impact", count: 15 }
  ];

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

      {/* Newsletter / CTA */}
      <div className="bg-brand-forest rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden shadow-2xl shadow-forest-500/20">
         <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
         <h4 className="text-lg font-black mb-4 relative z-10 leading-tight">Join our green community</h4>
         <p className="text-xs text-white/70 font-medium mb-6 relative z-10 leading-relaxed">Get the latest climate insights and impact stories delivered to your inbox.</p>
         <button className="w-full py-3 bg-white text-brand-forest rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-orange hover:text-white transition-all shadow-lg active:scale-95">
            Subscribe Now
         </button>
      </div>
    </aside>
  );
}
