import { Metadata } from "next";
import Hero from "@/components/common/Hero";

export const metadata: Metadata = {
  title: "Blog & Perspectives",
  description: "Dive into our collection of research, stories, and impacts from frontline communities. We use storytelling to ignite climate action and gender equality.",
  openGraph: {
    title: "Rooted Rising Blog | Stories for Change",
    description: "Read our latest insights and narratives from the field.",
    images: ["/images/hero.png"],
  },
};
import { BlogCard } from "@/components/blog/BlogComponents";
import prisma from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

// Utility to create a safe plaintext excerpt from HTML content
function createExcerpt(htmlContent: string, maxLength: number = 150) {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "...";
}

export const dynamic = "force-dynamic";

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string; page?: string }>;
}) {
  const { section, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const ITEMS_PER_PAGE = 6;
  
  // 1. Fetch from Database
  let dbPosts: any[] = [];
  try {
    dbPosts = await prisma.post.findMany({
      where: { 
        published: true,
        section: section 
          ? { equals: section, mode: 'insensitive' } 
          : { in: ["Articles", "article", "Article", "Poems", "poem", "Poem", "Story", "story", "General"] }
      },
      include: { 
        author: true,
        comments: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: "desc" },
    });

    const totalCount = await prisma.post.count();
    const publishedCount = await prisma.post.count({ where: { published: true } });
    console.log(`DEBUG: DB Total: ${totalCount}, DB Published: ${publishedCount}, Section: ${section || 'General'}`);
  } catch (error) {
    console.error("Database error fetching blog posts:", error);
  }

  // 2. Fetch from Markdown Files
  const mdPosts = getAllPosts().filter(p => !section || p.category === section);

  // 3. Combine and Sort
  console.log(`DEBUG: Found ${dbPosts.length} posts in DB and ${mdPosts.length} in Markdown.`);
  
  const posts = [
    ...mdPosts.map(p => ({
      ...p,
      createdAt: p.date,
      section: p.category,
      author: { name: "Rooted Rising" },
      comments: [],
      isMarkdown: true
    })),
    ...dbPosts.map(p => ({
      ...p,
      isMarkdown: false
    }))
  ].sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime());

  console.log(`DEBUG: Total combined posts: ${posts.length}`);

  const featuredPost = posts[0];
  const allGridPosts = posts; // Don't slice, show everything in the grid
  
  const totalPages = Math.ceil(allGridPosts.length / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const gridPosts = allGridPosts.slice(offset, offset + ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col">
      <Hero 
        title={featuredPost?.title || (section ? `${section} Insights` : "Perspectives & Insights")}
        subtitle={featuredPost ? createExcerpt(featuredPost.content, 120) : (section 
          ? `Deep dive into our ${section.toLowerCase()} related research, stories, and impacts across Sub-Saharan Africa.`
          : "Exploring the frontier of climate resilience, rural technology, and community-led innovation across Sub-Saharan Africa.")}
        backgroundImage={featuredPost?.image || "/images/gallery/IMG_2023.JPG"}
        height="half"
        titleSize="lg"
      >
         {featuredPost && (() => {
            const dateObj = new Date(featuredPost.createdAt);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const catSlug = (featuredPost.section || "insight").toLowerCase();
            const detailUrl = `/${catSlug}/${year}/${month}/${day}/${featuredPost.slug}`;
            
            return (
              <div className="mt-8 flex justify-center">
                 <Link 
                  href={detailUrl}
                  className="group flex items-center gap-3 px-8 py-4 bg-brand-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
                 >
                   Read Featured Story <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                 </Link>
              </div>
            );
         })()}
      </Hero>

      <section className="section-padding bg-slate-50 relative overflow-hidden font-outfit">
        {/* Background decorative patterns */}
        <div className="absolute top-0 right-0 -mr-48 -mt-48 h-[600px] w-[600px] rounded-full bg-brand-cyan/5 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-48 -mb-48 h-[600px] w-[600px] rounded-full bg-brand-forest/5 blur-3xl pointer-events-none"></div>

        <div className="mx-auto max-w-7xl relative z-10">
          <div className="mb-20 text-center max-w-4xl mx-auto">
            <h2 className="mb-4 text-sm font-bold uppercase tracking-widest text-brand-cyan">
              {section ? `${section} / IMPACT STORIES` : "STORY / STRATEGY / INSIGHT"}
            </h2>
            <h3 className="mb-8 text-4xl font-extrabold text-slate-900 md:text-5xl">
              {section ? `Our ${section} Perspective` : "Building Resilience Through Shared Knowledge"}
            </h3>
            <p className="text-xl text-slate-600 leading-relaxed font-medium">
              We translate global climate and development goals into community-level action by sharing research, field notes, and success stories directly from the front lines of climate action.
            </p>
          </div>

          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {gridPosts.map((post: any, index: number) => {
              const totalRating = post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
              const avgRating = post.comments.length > 0 ? totalRating / post.comments.length : 0;
              
              return (
                <BlogCard key={post.slug} post={{
                  ...post,
                  date: new Date(post.createdAt).toISOString(),
                  author: "Rooted Rising",
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
                href={`/blogs?${section ? `section=${section}&` : ''}page=${Math.max(1, currentPage - 1)}`}
                className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:bg-slate-50 ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </Link>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/blogs?${section ? `section=${section}&` : ''}page=${p}`}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${currentPage === p ? 'bg-brand-forest text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300'}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                href={`/blogs?${section ? `section=${section}&` : ''}page=${Math.min(totalPages, currentPage + 1)}`}
                className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:bg-slate-50 ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
              >
                <ChevronRight size={20} className="text-slate-600" />
              </Link>
            </div>
          )}

          {posts.length === 0 && (
            <div className="text-center py-40">
              <h4 className="text-2xl font-bold text-slate-400">No blog posts found. Check back soon for updates from the field!</h4>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
