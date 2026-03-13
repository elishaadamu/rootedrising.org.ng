import Hero from "@/components/common/Hero";
import { BlogCard } from "@/components/blog/BlogComponents";
import prisma from "@/lib/prisma";

// Utility to create a safe plaintext excerpt from HTML content
function createExcerpt(htmlContent: string, maxLength: number = 150) {
  if (!htmlContent) return "";
  const plainText = htmlContent.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ");
  if (plainText.length <= maxLength) return plainText;
  return plainText.substring(0, plainText.lastIndexOf(" ", maxLength)) + "...";
}

export default async function BlogListingPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  
  const posts = await prisma.post.findMany({
    where: { 
      published: true,
      ...(section ? { section } : {})
    },
    include: { 
      author: true,
      comments: {
        select: { rating: true }
      }
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col">
      <Hero 
        title={section ? `${section} Insights` : "Perspectives & Insights"}
        subtitle={section 
          ? `Deep dive into our ${section.toLowerCase()} related research, stories, and impacts across Sub-Saharan Africa.`
          : "Exploring the frontier of climate resilience, rural technology, and community-led innovation across Sub-Saharan Africa."}
        backgroundImage="/images/gallery/IMG_2023.JPG"
        height="half"
        titleSize="lg"
      />

      <section className="section-padding bg-slate-50 relative overflow-hidden">
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
            {posts.map((post: any, index: number) => {
              const totalRating = post.comments.reduce((acc: number, curr: any) => acc + curr.rating, 0);
              const avgRating = post.comments.length > 0 ? totalRating / post.comments.length : 0;
              
              return (
                <BlogCard key={post.slug} post={{
                  ...post,
                  date: new Date(post.createdAt).toLocaleDateString(),
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
              <h4 className="text-2xl font-bold text-slate-400">No blog posts found. Check back soon for updates from the field!</h4>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
