import Hero from "@/components/common/Hero";
import { BlogCard } from "@/components/blog/BlogComponents";
import prisma from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

function createExcerpt(htmlContent: string, maxLength: number = 150) {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "...";
}

export const dynamic = "force-dynamic";

export default async function CategoryListingPage({
  params,
  searchParams,
}: {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const category = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);
  
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const ITEMS_PER_PAGE = 6;
  
  // 1. Fetch from Database
  const dbPosts = await prisma.post.findMany({
    where: { 
      published: true,
      section: { equals: category, mode: "insensitive" }
    },
    include: { 
      author: true,
      comments: { select: { rating: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  // 2. Fetch from Markdown Files
  const mdPosts = getAllPosts().filter(p => 
    p.category.toLowerCase() === resolvedParams.category.toLowerCase()
  );

  // 3. Combine and Sort
  const posts = [
    ...mdPosts.map(p => ({
      ...p,
      createdAt: p.date,
      section: p.category,
      author: { name: p.author },
      comments: [],
      isMarkdown: true
    })),
    ...dbPosts.map(p => ({
      ...p,
      isMarkdown: false
    }))
  ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());

  const featuredPost = posts[0];
  const allGridPosts = posts; // Don't slice, show everything in the grid
  
  const totalPages = Math.ceil(allGridPosts.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const gridPosts = allGridPosts.slice(offset, offset + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col">
      <Hero 
        title={featuredPost?.title || `${category} Insights`}
        subtitle={featuredPost ? createExcerpt(featuredPost.content, 120) : `Deep dive into our ${category.toLowerCase()} related research, stories, and impacts across Sub-Saharan Africa.`}
        backgroundImage={featuredPost?.image || "/images/gallery/IMG_2023.JPG"}
        height="half"
        titleSize="lg"
      >
         {featuredPost && (
            <div className="mt-8 flex justify-center">
               <Link 
                href={`/blogs/${featuredPost.slug}`}
                className="group flex items-center gap-3 px-8 py-4 bg-brand-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
               >
                 Read Featured Story <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         )}
      </Hero>

      <section className="section-padding bg-slate-50 relative overflow-hidden font-outfit">
        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-cyan">
              {category} / IMPACT STORIES
            </h2>
            <h3 className="mb-8 text-4xl font-extrabold text-slate-900 md:text-5xl">
              Our {category} Perspective
            </h3>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post: any, index: number) => {
              const totalRating = post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
              const avgRating = post.comments.length > 0 ? totalRating / post.comments.length : 0;
              
              return (
                <BlogCard key={post.slug} post={{
                  ...post,
                  date: new Date(post.createdAt).toISOString(),
                  author: post.author?.name || "Rooted Rising",
                  rating: avgRating,
                  category: post.section,
                  excerpt: createExcerpt(post.content)
                }} index={index} />
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-20 border-t border-slate-100 mt-20">
              <Link
                href={`/blogs/${resolvedParams.category}?page=${Math.max(1, currentPage - 1)}`}
                className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:bg-slate-50 ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </Link>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blogs/${resolvedParams.category}?page=${p}`}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${currentPage === p ? 'bg-brand-forest text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300'}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                href={`/blogs/${resolvedParams.category}?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:bg-slate-50 ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
              >
                <ChevronRight size={20} className="text-slate-600" />
              </Link>
            </div>
          )}

          {gridPosts.length === 0 && (
            <div className="text-center py-40">
              <h4 className="text-2xl font-bold text-slate-400">Not found. Check back soon for updates from the field!</h4>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
