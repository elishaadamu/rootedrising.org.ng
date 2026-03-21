import Hero from "@/components/common/Hero";
import prisma from "@/lib/prisma";
import { getAllCampaigns } from "@/lib/campaigns";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight, Star } from "lucide-react";

export const dynamic = "force-dynamic";

const ITEMS_PER_PAGE = 6;

export default async function AllCampaignsPage(props: {
  searchParams: Promise<{ page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;

  // 1. Fetch from Database
  let dbCampaigns: any[] = [];
  try {
    dbCampaigns = await prisma.post.findMany({
      where: { 
        section: { in: ["Campaign", "Campaigns", "campaign"] },
        published: true 
      },
      include: { 
        author: true,
        comments: { select: { rating: true } }
      },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Database error fetching campaign blogs:", error);
  }

  // 2. Fetch from Markdown
  const mdCampaigns = getAllCampaigns();

  // Combine both sources, deduplicate by slug (DB takes priority for ratings)
  const combinedMap = new Map();
  
  mdCampaigns.forEach(c => {
    combinedMap.set(c.slug, {
      ...c,
      date: c.date,
      rating: 0,
      isExternal: false,
      source: 'md'
    });
  });

  dbCampaigns.forEach(p => {
    combinedMap.set(p.slug, {
      slug: p.slug,
      title: p.title,
      date: p.createdAt.toISOString(),
      excerpt: p.excerpt || "",
      image: p.image || "/images/placeholder.png",
      category: "Campaign",
      author: (p.author as any)?.name || "Rooted Rising",
      rating: p.comments.length > 0 
        ? p.comments.reduce((acc: number, curr: { rating: number }) => acc + curr.rating, 0) / p.comments.length 
        : 0,
      isExternal: false,
      source: p.content.startsWith('#') ? 'md' : 'db' // Heuristic
    });
  });

  const allBlogs = Array.from(combinedMap.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Pagination Logic
  const totalItems = allBlogs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedBlogs = allBlogs.slice(offset, offset + ITEMS_PER_PAGE);

  const featuredCampaign = allBlogs[0];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30 font-outfit">
      <Hero 
        title={featuredCampaign?.title || "Impact Archive"}
        subtitle={featuredCampaign ? featuredCampaign.excerpt : "Our complete collection of advocacy stories, community engagements, and climate actions."}
        backgroundImage={featuredCampaign?.image || "/images/gallery/IMG_2023.JPG"}
        height="half"
      >
         {featuredCampaign && (
            <div className="mt-8 flex justify-center">
               <Link 
                href={`/campaigns/${new Date(featuredCampaign.date).getFullYear()}/${String(new Date(featuredCampaign.date).getMonth() + 1).padStart(2, '0')}/${String(new Date(featuredCampaign.date).getDate()).padStart(2, '0')}/${featuredCampaign.slug}`}
                className="group flex items-center gap-3 px-8 py-4 bg-brand-forest text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-orange transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
               >
                 Read Featured Archive <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
         )}
         <div className="flex items-center justify-center gap-3 mt-12 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
            <Link href="/campaigns" className="hover:text-white transition-colors">Campaigns</Link>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
            <span className="text-white">All Campaigns</span>
         </div>
      </Hero>

      <section className="section-padding bg-white relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
              Every Story <span className="text-brand-orange">Matters</span>
            </h2>
            <p className="mt-4 text-slate-500 font-medium max-w-xl">Browse our archive of narratives that drive change and inspire global resilience.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {displayedBlogs.map((blog: any, idx) => {
              const d = new Date(blog.date);
              const year = d.getFullYear();
              const month = String(d.getMonth() + 1).padStart(2, '0');
              const day = String(d.getDate()).padStart(2, '0');
              const detailUrl = blog.isExternal ? blog.slug : `/campaigns/${year}/${month}/${day}/${blog.slug}`;
              
              return (
                <Link 
                  key={idx} 
                  href={detailUrl}
                  className="group bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col"
                >
                <div className="relative h-64 overflow-hidden">
                  <Image 
                    src={blog.image} 
                    alt={blog.title} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>{new Date(blog.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>By {blog.author}</span>
                  </div>
                  {blog.rating > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-[10px] font-black w-fit mb-4">
                      <Star className="h-3 w-3 fill-amber-500" />
                      {Number(blog.rating).toFixed(1)}
                    </div>
                  )}
                  <h3 className="text-xl font-black text-slate-900 mb-4 group-hover:text-brand-orange transition-colors line-clamp-2 leading-tight">
                    {blog.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">
                    {blog.excerpt}
                  </p>
                  <div className="flex items-center text-brand-orange font-bold text-sm tracking-tight gap-2 group/btn">
                    Read Full Story
                    <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                  </div>
                </div>
              </Link>
            );
          })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 py-12 border-t border-slate-100">
              <Link
                href={`/campaigns/all?page=${Math.max(1, currentPage - 1)}`}
                className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:bg-slate-50 ${currentPage === 1 ? 'pointer-events-none opacity-40' : ''}`}
              >
                <ChevronLeft size={20} className="text-slate-600" />
              </Link>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/campaigns/all?page=${p}`}
                    className={`h-12 w-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${currentPage === p ? 'bg-brand-forest text-white shadow-lg' : 'bg-white border border-slate-100 text-slate-400 hover:border-slate-300'}`}
                  >
                    {p}
                  </Link>
                ))}
              </div>

              <Link
                href={`/campaigns/all?page=${Math.min(totalPages, currentPage + 1)}`}
                className={`p-4 rounded-2xl bg-white border border-slate-100 flex items-center justify-center transition-all hover:bg-slate-50 ${currentPage === totalPages ? 'pointer-events-none opacity-40' : ''}`}
              >
                <ChevronRight size={20} className="text-slate-600" />
              </Link>
            </div>
          )}

          {allBlogs.length === 0 && (
            <div className="text-center py-40">
              <h4 className="text-2xl font-bold text-slate-400">No campaigns found. Check back soon for updates!</h4>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
