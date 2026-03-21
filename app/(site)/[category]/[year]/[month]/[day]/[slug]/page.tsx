import Hero from "@/components/common/Hero";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog";
import CommentSection from "@/components/blog/CommentSection";
import ShareButtons from "@/components/blog/ShareButtons";
import { BlogSidebar } from "@/components/blog/BlogComponents";
import { getSession } from "@/lib/actions/auth";
import { getBlogCategoriesWithCount } from "@/lib/actions/blog";
import { Calendar, User as UserIcon, Star } from "lucide-react";
import Link from "next/link";
import { Metadata } from 'next';

export async function generateMetadata(props: { 
  params: Promise<{ category: string, year: string, month: string, day: string, slug: string }> 
}): Promise<Metadata> {
  const { slug } = await props.params;
  const mdPost = getPostBySlug(slug);
  
  if (mdPost) {
    const description = mdPost.excerpt || mdPost.content.substring(0, 160).replace(/<[^>]*>?/gm, '');
    return {
      title: mdPost.title,
      description,
      openGraph: {
        title: mdPost.title,
        description,
        images: mdPost.image ? [mdPost.image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: mdPost.title,
        description,
        images: mdPost.image ? [mdPost.image] : [],
      }
    };
  }

  const dbPost = await prisma.post.findUnique({
    where: { slug },
  });

  if (dbPost) {
    const description = dbPost.excerpt || dbPost.content.substring(0, 160).replace(/<[^>]*>?/gm, '');
    return {
      title: dbPost.title,
      description,
      openGraph: {
        title: dbPost.title,
        description,
        images: dbPost.image ? [dbPost.image] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: dbPost.title,
        description,
        images: dbPost.image ? [dbPost.image] : [],
      }
    };
  }

  return { title: 'Post Not Found' };
}

export default async function DynamicBlogPostPage(props: { 
  params: Promise<{ category: string, year: string, month: string, day: string, slug: string }> 
}) {
  const params = await props.params;
  const { slug } = params;

  if (!slug) return notFound();

  const [session, categoryStats] = await Promise.all([
    getSession(),
    getBlogCategoriesWithCount()
  ]);

  // 1. Fetch from Database for Recent
  const dbRecent = await prisma.post.findMany({
    where: { published: true, section: { not: "Campaigns" } },
    orderBy: { createdAt: "desc" },
    take: 3
  });

  // 2. Fetch from Markdown for Recent
  const mdRecent = getAllPosts().slice(0, 3);

  // 3. Merge Recent
  const recentPosts = [
    ...dbRecent.map(p => ({ ...p, isMarkdown: false })),
    ...mdRecent.map(p => ({ ...p, createdAt: p.date, section: p.category, isMarkdown: true }))
  ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime()).slice(0, 5);

  // 4. Fetch the main post
  const mdPost = getPostBySlug(slug);
  const dbPost = !mdPost ? await prisma.post.findUnique({
    where: { slug },
    include: {
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
    },
  }) : null;

  if (!mdPost && !dbPost) {
    notFound();
  }

  // Normalize data
  const post = mdPost ? {
    id: mdPost.slug,
    slug: mdPost.slug,
    title: mdPost.title,
    content: mdPost.content,
    image: mdPost.image,
    author: { name: mdPost.author },
    createdAt: mdPost.date,
    section: mdPost.category,
    comments: [],
    rating: "0.0"
  } : {
    ...dbPost!,
    rating: dbPost!.comments.length > 0 
      ? (dbPost!.comments.reduce((acc, curr) => acc + curr.rating, 0) / dbPost!.comments.length).toFixed(1) 
      : "0.0"
  };

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
    <article className="flex flex-col min-h-screen font-outfit">
      <Hero 
        title={post.title}
        backgroundImage={post.image || "/images/gallery/IMG_2023.JPG"}
        height="half"
        titleSize="lg"
      >
        <div className="flex items-center justify-center gap-3 mt-6 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-white/70">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
           <Link href="/blogs" className="hover:text-white transition-colors">Blogs</Link>
           <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
           <span className="text-white truncate max-w-[150px] sm:max-w-xs">{post.title}</span>
        </div>
      </Hero>

      <div className="section-padding bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 sm:gap-24">
            {/* Main Content */}
            <div className="lg:col-span-8">
              <div className="flex flex-wrap items-center gap-8 mb-16 py-8 border-y border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-brand-forest/10 text-brand-forest flex items-center justify-center font-bold">
                      {(post.author as any).name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Published by</p>
                      <p className="text-sm font-black text-slate-900">{(post.author as any).name}</p>
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

                <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-brand-forest/5 text-brand-forest rounded-full text-[10px] uppercase font-black tracking-widest">
                      {post.section}
                    </span>
                </div>
              </div>

              <div className="flex items-center justify-end mb-12">
                <ShareButtons title={post.title} slug={post.slug} />
              </div>

              <div 
                className="prose prose-base sm:prose-lg md:prose-xl prose-slate max-w-none wrap-break-word overflow-hidden
                prose-headings:text-slate-900 prose-headings:font-black 
                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
                prose-strong:text-brand-forest prose-strong:font-black
                prose-blockquote:border-l-brand-cyan prose-blockquote:bg-slate-50 prose-blockquote:p-6 sm:prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic
                prose-img:rounded-3xl sm:prose-img:rounded-[2.5rem] prose-img:shadow-2xl mb-24"
                dangerouslySetInnerHTML={{ __html: mdPost ? post.content : decodeHTML(post.content) }}
              />

              {!mdPost && (
                <CommentSection 
                  postId={(post as any).id} 
                  comments={(post as any).comments} 
                  session={session} 
                />
              )}

              {mdPost && (
                <div className="mt-24 p-12 bg-slate-50 rounded-[3rem] text-center border border-slate-100/50">
                    <h4 className="text-xl font-black text-slate-900 mb-4 font-outfit">Legacy Content</h4>
                    <p className="text-slate-500 font-medium max-w-md mx-auto">This story was migrated from our historical archives. Comments are currently disabled for legacy posts.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-4">
               <div className="sticky top-32">
                   <BlogSidebar recentPosts={recentPosts} categories={categoryStats} />
               </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
