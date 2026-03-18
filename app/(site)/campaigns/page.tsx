import Hero from "@/components/common/Hero";
import VideoCard from "@/components/common/VideoCard";
import prisma from "@/lib/prisma";
import { getAllCampaigns } from "@/lib/campaigns";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CampaignsPage() {
  // 1. Videos (From Database with Fallback)
  let dbVideos = (prisma as any).video 
    ? await (prisma as any).video.findMany({
        where: { active: true },
        orderBy: { order: "asc" }
      })
    : [];


  const hardcodedVideos = [
    { title: "Oil Extraction and Water Pollution", link: "https://www.youtube.com/embed/dy-baZfnC-c?si=qi38nrQ_swvxAdXY" },
    { title: "16 Days of Activism (Gender Based Violence)", link: "https://www.youtube.com/embed/veRrjFfKugY?si=MZAzTTV2Da0ct0WY" },
    { title: "What is Climate Change?", link: "https://www.youtube.com/embed/7UMDpY263y8?si=tmghp3cmx9MEi-YB" },
    { title: "We are all Eyewitnesses", link: "https://www.youtube.com/embed/-ZUkP1v-gsU?si=6WFryay3kOp97A-t" },
    { title: "Let Her Be ", link: "https://www.youtube.com/embed/tAgYJl18pC4?si=CLYn3gRcXtNB3dBA" },
    { title: "Expose + Debunk False Climate Change Solutions ", link: "https://www.youtube.com/embed/Ols5YIO4mDg?si=cfeOjJ2ls-UP8W38" },
    { title: "LOOK BEYOND OIL", link: "https://www.youtube.com/embed/lKGI15cs8-I?si=tmp1GFyQEQsODCEG" },
    { title: "DEALS BEHIND THE DRILLS", link: "https://www.youtube.com/embed/oP9Oaus7Zf0?si=dlm0rFouWhRVnWTk" },
    { title: "STOP EACOP (STORY OF NAMAZZI)", link: "https://www.youtube.com/embed/l-fkJZDcJbw?si=O0Fd9bbzFs0YFbz-" }
  ];

  const videos = dbVideos.length > 0 
    ? dbVideos.map((v: any) => ({ title: v.title, link: v.url }))
    : hardcodedVideos;


  // 2. Campaign Blogs (Markdown + Prisma)
  const mdCampaigns = getAllCampaigns();
  const dbCampaigns = await prisma.post.findMany({
    where: { section: "Campaign", published: true },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  });

  // Combine both and sort by date descending
  const allBlogs = [ 
    ...mdCampaigns.map(c => ({ ...c, isExternal: false })), 
    ...dbCampaigns.map(p => ({
      slug: p.slug,
      title: p.title,
      date: p.createdAt.toISOString(),
      excerpt: p.excerpt || "",
      image: p.image || "/images/placeholder.png",
      category: "Campaign",
      author: (p.author as any).name,
      isExternal: false
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 3. Pamphlets
  const pamphlets = (prisma as any).pamphlet 
    ? await (prisma as any).pamphlet.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" }
      })
    : [];

  // 4. Artvocacy
  const artvocacy = (prisma as any).artvocacy 
    ? await (prisma as any).artvocacy.findMany({
        where: { active: true },
        orderBy: { createdAt: "desc" }
      })
    : [];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/30">
      <Hero 
        title="Our Campaigns"
        subtitle="Exploring global climate narratives and youth-led advocacy through impactful storytelling."
        backgroundImage="/images/1.png"
      />

      {/* Voice of the Frontline Section */}
      <section id="next-section" className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-yellow-50/50 rounded-bl-full z-0 opacity-50 blur-3xl"></div>
        <div className="mx-auto max-w-7xl px-6 relative z-10">
          <div className="mb-16 text-center">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
              <span className="header-highlight highlight-yellow">Voice of the Frontline</span>
            </h1>
            <p className="mt-6 text-slate-500 max-w-2xl mx-auto font-medium">Documenting the lived experiences of communities at the forefront of the climate crisis through visual storytelling.</p>
          </div>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video, idx) => (
              <VideoCard 
                key={idx}
                title={video.title}
                videoUrl={video.link}
                index={idx}
                aspect="square"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Campaign Blogs Section */}
      <section className="section-padding bg-slate-50/50 relative">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                Campaign <span className="text-brand-orange">Highlights</span>
              </h2>
              <p className="mt-4 text-slate-500 font-medium max-w-xl">Deep dives into our recent advocacy efforts, community engagements, and climate actions.</p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {allBlogs.map((blog: any, idx) => (
              <Link 
                key={idx} 
                href={blog.isExternal ? blog.slug : `/campaigns/${blog.slug}`}
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
            ))}
          </div>
        </div>
      </section>

      {/* Pamphlets Section */}
      {pamphlets.length > 0 && (
        <section className="section-padding bg-slate-50 overflow-hidden">
          <div className="mx-auto max-w-7xl px-6">
            <h2 className="text-4xl font-black text-brand-navy mb-16">Pamphlets</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {pamphlets.map((p: any, idx: number) => (
                <Link key={idx} href={p.url || "#"} target="_blank" className="group relative aspect-[3/4] rounded-4xl overflow-hidden shadow-2xl transition-all duration-700 hover:-translate-y-2">
                  <Image 
                    src={p.image || "/images/placeholder.png"} 
                    alt={p.title} 
                    fill 
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-navy/60 transition-opacity duration-500 group-hover:bg-brand-navy/70 p-6 sm:p-8">
                    <div className="border border-white/40 w-full h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center relative">
                        <div className="text-white text-[13px] sm:text-sm font-medium leading-relaxed mb-8 opacity-90 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105" dangerouslySetInnerHTML={{ __html: p.content }}></div>
                        <div className="w-16 h-px bg-white/30 mb-6"></div>
                        <h3 className="text-white font-black text-lg sm:text-2xl uppercase tracking-[0.2em] leading-tight">{p.title}</h3>
                        
                        {/* Decorative Corner */}
                        <div className="absolute bottom-4 right-4 h-10 w-10 sm:h-12 sm:w-12 rounded-full overflow-hidden bg-white/90 backdrop-blur-md p-2 shadow-xl border border-white/20">
                           <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                        </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Artvocacy Section */}
      {artvocacy.length > 0 && (
        <section className="section-padding bg-white">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-12">
              <h2 className="text-4xl font-black text-brand-navy">Artvocacy</h2>
            </div>
            
            <div className="relative aspect-video w-full rounded-4xl overflow-hidden shadow-2xl border border-slate-100 bg-slate-900 group">
              <iframe
                src={`${artvocacy[0].url}${artvocacy[0].url.includes('?') ? '&' : '?'}rel=0&autoplay=0`}
                title="Artvocacy Highlight"
                className="absolute inset-0 h-full w-full opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="mt-8 flex items-center justify-between">
               <div>
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-brand-orange mb-1">Featured Highlight</p>
                  <h3 className="text-2xl font-black text-slate-900 uppercase">{artvocacy[0].title}</h3>
               </div>
               <Link href="/blog" className="flex items-center gap-2 text-slate-400 font-bold hover:text-brand-forest transition-all">
                  Browse All Artvocacy <ArrowRight size={18} />
               </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
