import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "_posts");

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  category: string;
  author: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  // Get file names under /content/blog
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        title: matterResult.data.title || "Untitled Perspective",
        date: matterResult.data.date || new Date().toISOString(),
        excerpt: matterResult.data.excerpt || matterResult.content.slice(0, 150) + "...",
        image: matterResult.data.image || "/images/placeholder.png",
        category: matterResult.data.categories || matterResult.data.category || "Insight",
        author: matterResult.data.author || "Rooted Rising",
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()));
}

export function getPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);
    if (!fs.existsSync(fullPath)) return null;

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);

    return {
      slug,
      content: matterResult.content,
      title: matterResult.data.title || "Untitled Perspective",
      date: matterResult.data.date || new Date().toISOString(),
      excerpt: matterResult.data.excerpt || matterResult.content.slice(0, 150) + "...",
      image: matterResult.data.image || "/images/placeholder.png",
      category: matterResult.data.categories || matterResult.data.category || "Insight",
      author: matterResult.data.author || "Rooted Rising",
    } as BlogPost;
  } catch (e) {
    return null;
  }
}
