import Hero from "@/components/common/Hero";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CommentSection from "@/components/blog/CommentSection";
import ShareButtons from "@/components/blog/ShareButtons";
import { getSession } from "@/lib/actions/auth";
import { Calendar, User as UserIcon, Clock, Share2, Star } from "lucide-react";
import Link from "next/link";

export default async function BlogPostPage(props: { params: Promise<{ slug: string }> }) {
  // In Next.js 15+, params is a Promise that must be awaited
  const params = await props.params;
  const slug = params?.slug;

  if (!slug) {
    return notFound();
  }

  const session = await getSession();

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Calculate average rating
  const totalRating = post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
  const avgRating = post.comments.length > 0 ? (totalRating / post.comments.length).toFixed(1) : "0.0";

  // Decode escaped HTML
  const decodeHTML = (html: string) => {
    if (!html) return "";
    return html
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#x27;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ");
  };

  return (
    <article className="flex flex-col min-h-screen">
      <Hero 
        title={post.title}
        backgroundImage={post.image || "/images/gallery/IMG_2023.JPG"}
        height="half"
        titleSize="lg"
      >
        <div className="flex items-center justify-center gap-3 mt-6 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-white/70">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
           <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
           <span className="w-1.5 h-1.5 rounded-full bg-brand-forest"></span>
           <span className="text-white truncate max-w-[150px] sm:max-w-xs">{post.title}</span>
        </div>
      </Hero>

      <div className="section-padding bg-white relative">
        <div className="mx-auto max-w-4xl">
          {/* Post Meta */}
          <div className="flex flex-wrap items-center gap-8 mb-16 py-8 border-y border-slate-100">
             <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-brand-forest/10 text-brand-forest flex items-center justify-center font-bold">
                   {post.author.name?.charAt(0)}
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published by</p>
                   <p className="text-sm font-black text-slate-900">{post.author.name}</p>
                </div>
             </div>

             <div className="h-8 border-l border-slate-100 hidden sm:block"></div>

             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Calendar size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                   <p className="text-sm font-black text-slate-900">{new Date(post.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
                </div>
             </div>

             <div className="h-8 border-l border-slate-100 hidden sm:block"></div>

             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                   <Star size={18} className="fill-amber-500" />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Community Rating</p>
                   <p className="text-sm font-black text-slate-900">{avgRating} / 5.0</p>
                </div>
             </div>
          </div>

          <div className="flex items-center justify-end mb-12">
             <ShareButtons title={post.title} slug={post.slug} />
          </div>

          {/* Content */}
          <div 
            className="prose prose-base sm:prose-lg md:prose-xl prose-slate max-w-none break-words overflow-hidden
            prose-headings:text-slate-900 prose-headings:font-black 
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
            prose-strong:text-brand-forest prose-strong:font-black
            prose-blockquote:border-l-brand-cyan prose-blockquote:bg-slate-50 prose-blockquote:p-6 sm:prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic
            prose-img:rounded-3xl sm:prose-img:rounded-[2.5rem] prose-img:shadow-2xl"
            dangerouslySetInnerHTML={{ __html: decodeHTML(post.content) }}
          />

          {/* Comment Section */}
          <CommentSection 
            postId={post.id} 
            comments={post.comments} 
            session={session} 
          />
        </div>
      </div>
    </article>
  );
}
