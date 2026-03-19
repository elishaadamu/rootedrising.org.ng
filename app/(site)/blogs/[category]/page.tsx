import Hero from "@/components/common/Hero";
import { BlogCard } from "@/components/blog/BlogComponents";
import prisma from "@/lib/prisma";
import { getAllPosts } from "@/lib/blog";

function createExcerpt(htmlContent: string, maxLength: number = 150) {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "...";
}

export default async function CategoryListingPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const category = resolvedParams.category.charAt(0).toUpperCase() + resolvedParams.category.slice(1);
  
  // 1. Fetch from Database
  const dbPosts = await prisma.post.findMany({
    where: { 
      published: true,
      section: category
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

  return (
    <div className="flex flex-col">
      <Hero 
        title={`${category} Insights`}
        subtitle={`Deep dive into our ${category.toLowerCase()} related research, stories, and impacts across Sub-Saharan Africa.`}
        backgroundImage="/images/gallery/IMG_2023.JPG"
        height="half"
        titleSize="lg"
      />

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
            {posts.map((post: any, index: number) => {
              const totalRating = post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
              const avgRating = post.comments.length > 0 ? totalRating / post.comments.length : 0;
              
              return (
                <BlogCard key={post.slug} post={{
                  ...post,
                  date: new Date(post.createdAt).toISOString(),
                  author: post.author.name,
                  rating: avgRating,
                  category: post.section,
                  excerpt: createExcerpt(post.content)
                }} index={index} />
              );
            })}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-40">
              <h4 className="text-2xl font-bold text-slate-400">Not found. Check back soon for updates from the field!</h4>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
