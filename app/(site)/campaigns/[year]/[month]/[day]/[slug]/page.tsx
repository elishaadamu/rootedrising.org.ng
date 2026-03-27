import Hero from "@/components/common/Hero";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getCampaignBySlug } from "@/lib/campaigns";
import { Calendar, User as UserIcon, Share2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ShareButtons from "@/components/blog/ShareButtons";
import CommentSection from "@/components/blog/CommentSection";
import { getSession } from "@/lib/actions/auth";
import { Metadata } from 'next';
import { createWordExcerpt } from "@/lib/utils";

export async function generateMetadata(props: {
  params: Promise<{ year: string, month: string, day: string, slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params;
  
  const mdCampaign = getCampaignBySlug(slug);
  const dbCampaign = !mdCampaign ? await prisma.post.findUnique({
    where: { slug },
  }) : null;

  const campaign = (mdCampaign || dbCampaign) as any;
  if (!campaign) return { title: 'Campaign Not Found' };

  const description = campaign.excerpt || createWordExcerpt(campaign.content, 10);

  return {
    title: campaign.title,
    description,
    openGraph: {
      title: campaign.title,
      description,
      images: campaign.image ? [campaign.image] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: campaign.title,
      description,
      images: campaign.image ? [campaign.image] : [],
    }
  };
}

export default async function CampaignDetailPage(props: {
  params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
}) {
  const { slug } = await props.params;

  if (!slug) return notFound();

  const session = await getSession();

  // 1. Fetch from Database
  let campaign: any = await prisma.post.findUnique({
    where: { slug, published: true },
    include: { 
      author: true,
      comments: {
        include: { user: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  let isMarkdown = false;
  let markdownContent = "";

  // 2. Fallback to Markdown
  if (!campaign) {
    const mdCampaign = getCampaignBySlug(slug);
    if (!mdCampaign) return notFound();
    
    // Setup shadow post if it doesn't exist for comments
    const adminUser = await prisma.user.findFirst({ where: { role: "ADMIN" } });
    if (adminUser) {
      try {
        campaign = await prisma.post.create({
          data: {
            slug: mdCampaign.slug,
            title: mdCampaign.title,
            content: mdCampaign.content,
            excerpt: mdCampaign.excerpt,
            image: mdCampaign.image,
            section: "Campaigns",
            published: true,
            authorId: adminUser.id,
          },
          include: { 
            author: true, 
            comments: {
                include: { user: true },
                orderBy: { createdAt: "desc" }
            }
          }
        });
      } catch (err) {
        campaign = { ...mdCampaign, comments: [] };
      }
    } else {
        campaign = { ...mdCampaign, comments: [] };
    }
    
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
            href="/campaigns/all" 
            className="inline-flex items-center gap-2 text-slate-400 font-bold text-sm mb-12 hover:text-brand-orange transition-colors group"
           >
             <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
             Back to Campaigns
           </Link>

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
                    Rooted Rising
                   </p>
                </div>
             </div>

             <div className="h-8 border-l border-slate-100 hidden sm:block"></div>

             <div className="flex-1 flex justify-end">
               <ShareButtons title={campaign.title} slug={`${await props.params.then(p => `${p.year}/${p.month}/${p.day}/${p.slug}`)}`} />
             </div>
          </div>

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

          <CommentSection 
            postId={campaign.id} 
            comments={campaign.comments || []} 
            session={session} 
          />
        </div>
      </div>
    </article>
  );
}
