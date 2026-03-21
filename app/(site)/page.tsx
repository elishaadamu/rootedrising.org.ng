import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";
import { getAllCampaigns } from "@/lib/campaigns";

// A simple utility to strip HTML tags and truncate text for the preview excerpt
function createExcerpt(htmlContent: string, maxLength: number = 150) {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "...";
}

export default async function Home() {
  // 1. Fetch Blogs (Latest 3)
  const blogPostsData = await prisma.post.findMany({
    where: { 
      published: true,
      section: { in: ['Articles', 'article', 'Article', 'Poems', 'poem', 'Poem', 'Story', 'story', 'General'] }
    },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      author: true,
      comments: { select: { rating: true } },
    },
  });

  // 2. Fetch Campaigns (Sync with Archive Logic)
  let dbCampaigns: any[] = [];
  try {
    dbCampaigns = await prisma.post.findMany({
      where: { 
        published: true,
        section: { in: ['Campaign', 'Campaigns', 'campaign'] }
      },
      include: { 
        author: true,
        comments: { select: { rating: true } }
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {}

  const mdCampaigns = getAllCampaigns();
  
  // Combine logic from campaigns/all/page.tsx
  const campaignMap = new Map();
  mdCampaigns.forEach(c => {
    campaignMap.set(c.slug, {
      ...c,
      createdAt: c.date,
      rating: 0,
      isMarkdown: true
    });
  });

  dbCampaigns.forEach(p => {
    const avgRating = p.comments.length > 0 
      ? p.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0) / p.comments.length 
      : 0;

    campaignMap.set(p.slug, {
      slug: p.slug,
      title: p.title,
      createdAt: p.createdAt.toISOString(),
      excerpt: p.excerpt || createExcerpt(p.content),
      image: p.image || "/images/placeholder.png",
      category: "campaigns",
      author: p.author?.name || "Rooted Rising",
      rating: avgRating,
      isMarkdown: false
    });
  });

  const allCampaigns = Array.from(campaignMap.values())
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 3. Fetch latest 3 active videos
  let videos = [];
  try {
    if ((prisma as any).video) {
      videos = await (prisma as any).video.findMany({
        where: { active: true },
        orderBy: { order: "asc" },
        take: 3
      });
    }
  } catch (e) {}

  const blogPosts = blogPostsData.map(post => ({
    slug: post.slug,
    title: post.title,
    date: new Date(post.createdAt).toLocaleDateString(),
    excerpt: createExcerpt(post.content),
    image: post.image,
    category: post.section,
    author: post.author?.name || "Rooted Rising",
    rating: post.comments.length > 0 
      ? post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0) / post.comments.length 
      : 0
  }));
  
  // Prepare campaign posts for HomeClient (take 3)
  const homeCampaigns = allCampaigns.slice(0, 3).map(post => ({
    slug: post.slug,
    title: post.title,
    date: new Date(post.createdAt).toLocaleDateString(),
    excerpt: post.excerpt,
    image: post.image,
    category: "campaigns",
    author: typeof post.author === 'string' ? post.author : (post.author?.name || "Rooted Rising"),
    rating: post.rating || 0
  }));
  
  return <HomeClient blogPosts={blogPosts} campaignPosts={homeCampaigns} videos={videos} />;
}
