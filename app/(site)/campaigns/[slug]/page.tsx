import Hero from "@/components/common/Hero";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/campaigns";
import { Calendar, User as UserIcon, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export default async function CampaignDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  if (!slug) return notFound();

  // Try fetching from database first (recent ones)
  let campaign: any = await prisma.post.findUnique({
    where: { slug, section: "Campaign" },
    include: { author: true }
  });

  let isMarkdown = false;
  let markdownContent = "";

  // If not in DB, try markdown files
  if (!campaign) {
    const mdCampaign = getCampaignBySlug(slug);
    if (!mdCampaign) return notFound();
    
    campaign = mdCampaign;
    isMarkdown = true;
    markdownContent = mdCampaign.content;
  }

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
        title={campaign.title}
        backgroundImage={campaign.image || "/images/gallery/IMG_2023.JPG"}
        height="half"
        titleSize="lg"
      >
        <div className="flex items-center justify-center gap-3 mt-6 text-[10px] sm:text-xs font-black tracking-[0.2em] uppercase text-white/70">
           <Link href="/" className="hover:text-white transition-colors">Home</Link>
           <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
           <Link href="/campaigns" className="hover:text-white transition-colors">Campaigns</Link>
           <span className="w-1.5 h-1.5 rounded-full bg-brand-forest"></span>
           <span className="text-white truncate max-w-[150px] sm:max-w-xs">{campaign.title}</span>
        </div>
      </Hero>

      <div className="section-padding bg-white relative">
        <div className="mx-auto max-w-4xl">
           <Link 
            href="/campaigns" 
            className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm mb-12 hover:text-brand-orange transition-colors group"
           >
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             Back to Campaigns
           </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-8 mb-16 py-8 border-y border-slate-100">
             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                   <Calendar size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</p>
                   <p className="text-sm font-black text-slate-900">
                    {new Date(isMarkdown ? campaign.date : campaign.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}
                   </p>
                </div>
             </div>

             <div className="h-8 border-l border-slate-100"></div>

             <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-brand-forest/10 text-brand-forest flex items-center justify-center">
                   <UserIcon size={18} />
                </div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Contributor</p>
                   <p className="text-sm font-black text-slate-900">
                    {isMarkdown ? (campaign.author || "Rooted Rising") : campaign.author.name}
                   </p>
                </div>
             </div>
          </div>

          {/* Content */}
          <div className="prose prose-base sm:prose-lg md:prose-xl prose-slate max-w-none wrap-break-word overflow-hidden
            prose-headings:text-slate-900 prose-headings:font-black 
            prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
            prose-strong:text-brand-forest prose-strong:font-black
            prose-blockquote:border-l-brand-cyan prose-blockquote:bg-slate-50 prose-blockquote:p-6 sm:prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic
            prose-img:rounded-3xl sm:prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
            {isMarkdown ? (
              <ReactMarkdown>{markdownContent}</ReactMarkdown>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: decodeHTML(campaign.content) }} />
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
