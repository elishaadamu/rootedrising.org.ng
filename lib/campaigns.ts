import fs from "fs";
import path from "path";
import matter from "gray-matter";

const campaignsDirectory = path.join(process.cwd(), "_campaigns");

export interface CampaignPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  content: string;
}

export function getAllCampaigns(): CampaignPost[] {
  if (!fs.existsSync(campaignsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(campaignsDirectory);
  const allCampaignsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(campaignsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        title: matterResult.data.title || "Untitled Campaign",
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || matterResult.content.slice(0, 150) + "...",
        image: matterResult.data.image || "/images/placeholder.png",
        category: matterResult.data.category || "Campaign",
        author: matterResult.data.author || "Rooted Rising",
        ...matterResult.data
      } as CampaignPost;
    });

  return allCampaignsData.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getCampaignBySlug(slug: string): CampaignPost | null {
  try {
    const fullPath = path.join(campaignsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;
    
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      content: matterResult.content,
      title: matterResult.data.title || "Untitled Campaign",
      date: matterResult.data.date || new Date().toISOString(),
      excerpt: matterResult.data.excerpt || matterResult.content.slice(0, 150) + "...",
      image: matterResult.data.image || "/images/placeholder.png",
      category: matterResult.data.category || "Campaign",
      author: matterResult.data.author || "Rooted Rising",
      ...matterResult.data
    } as CampaignPost;
  } catch (e) {
    return null;
  }
}
