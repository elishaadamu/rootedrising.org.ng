import prisma from "@/lib/prisma";
import HomeClient from "@/components/home/HomeClient";

// A simple utility to strip HTML tags and truncate text for the preview excerpt
function createExcerpt(htmlContent: string, maxLength: number = 150) {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "...";
}

export default async function Home() {
  // Fetch latest 3 published posts from the database dynamically
  const dbPosts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 3,
    include: {
      author: true,
      comments: { select: { rating: true } },
    },
  });

  const formattedPosts = dbPosts.map((post: any) => {
    const totalRating = post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
    const avgRating = post.comments.length > 0 ? totalRating / post.comments.length : 0;

    return {
      slug: post.slug,
      title: post.title,
      date: new Date(post.createdAt).toLocaleDateString(),
      excerpt: createExcerpt(post.content),
      image: post.image,
      category: post.section,
      author: post.author.name,
      rating: avgRating,
    };
  });
  
  return <HomeClient posts={formattedPosts} />;
}
