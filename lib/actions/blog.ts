"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/actions/auth";
import { revalidatePath } from "next/cache";
import { recordActivity } from "./logs";
import { getAllPosts } from "@/lib/blog";
import { notifySubscribersOfNewPost } from "./newsletter";

export async function getBlogCategories() {
  try {
    // 1. Get from Database
    const dbPosts = await prisma.post.findMany({
      where: { published: true, section: { notIn: ["Campaigns", "General"] } },
      select: { section: true }
    });
    const dbCategories = Array.from(new Set(dbPosts.map(p => p.section)));

    // 2. Get from Markdown
    const mdPosts = getAllPosts();
    const mdCategories = Array.from(new Set(mdPosts.map(p => p.category)));

    // 3. Combine and filter
    const allCategories = Array.from(new Set([...dbCategories, ...mdCategories]))
      .filter(Boolean);
    
    const standardCategories = ["Articles", "Poems", "Campaigns", "Story"];
    
    return allCategories
      .filter(c => standardCategories.includes(c))
      .sort();
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["Articles", "Poems"];
  }
}

export async function getBlogCategoriesWithCount() {
  try {
    // 1. Get from Database
    const dbPosts = await prisma.post.findMany({
      where: { published: true, section: { notIn: ["Campaigns", "General"] } },
      select: { section: true }
    });
    
    // 2. Get from Markdown
    const mdPosts = getAllPosts();
    
    // 3. Count categories
    const counts: Record<string, number> = {};
    
    dbPosts.forEach(p => {
      counts[p.section] = (counts[p.section] || 0) + 1;
    });
    
    mdPosts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    
    // 4. Format for UI and filter for standard ones only
    const standardSections = ["Articles", "Poems", "Campaigns", "Story"];
    return Object.entries(counts)
      .filter(([name]) => standardSections.includes(name))
      .map(([name, count]) => ({
        name,
        slug: name.toLowerCase(),
        count
      })).sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error("Error fetching categories with count:", error);
    return [];
  }
}


export async function createBlogPost(data: { title: string; excerpt: string; content: string; image: string; section?: string; published?: boolean }) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const { title, excerpt, content, image, section = "Story", published = false } = data;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        image,
        slug,
        authorId: session.id as string,
        published,
        section,
      },
    });

    await recordActivity({
      action: "CREATED",
      entity: "Post",
      details: `Created blog post: ${title}`
    });

    if (published) {
      await notifySubscribersOfNewPost({ title, excerpt, slug, section, image });
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, post };
  } catch (error) {
    console.error("Create blog post error:", error);
    return { error: "Error creating post" };
  }
}

export async function updateBlogPost(id: string, data: { title: string; excerpt: string; content: string; image: string; section?: string; published?: boolean }) {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  const { title, excerpt, content, image, section, published } = data;

  if (!title || !content) {
    return { error: "Title and content are required" };
  }

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  try {
    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        excerpt,
        content,
        image,
        slug,
        section,
        published,
      },
    });

    await recordActivity({
      action: "UPDATED",
      entity: "Post",
      details: `Updated blog post: ${title}`
    });

    if (published) {
      await notifySubscribersOfNewPost({ title, excerpt, slug, section, image });
    }

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    revalidatePath(`/blog/${post.slug}`);
    return { success: true, post };
  } catch (error) {
    console.error("Update blog post error:", error);
    return { error: "Error updating post" };
  }
}


export async function deletePost(id: string) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    await prisma.post.delete({ where: { id } });
    await recordActivity({
      action: "DELETED",
      entity: "Post",
      details: `Deleted blog post with ID: ${id}`
    });

    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error) {
    return { error: "Error deleting post" };
  }
}

export async function syncMarkdownPosts() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    const mdPosts = getAllPosts();
    let syncedCount = 0;

    for (const post of mdPosts) {
      // Upsert based on slug
      await prisma.post.upsert({
        where: { slug: post.slug },
        update: {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          image: post.image,
          section: post.category,
          updatedAt: new Date(post.date),
        },
        create: {
          title: post.title,
          content: post.content,
          excerpt: post.excerpt,
          image: post.image,
          slug: post.slug,
          section: post.category,
          authorId: session.id as string,
          published: true,
          createdAt: new Date(post.date),
        },
      });
      syncedCount++;
    }

    await recordActivity({
      action: "UPDATED",
      entity: "Post",
      details: `Synced ${syncedCount} posts from markdown files to database.`
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blogs");
    
    return { success: true, count: syncedCount };
  } catch (error) {
    console.error("Sync error:", error);
    return { error: "Failed to sync posts" };
  }
}

export async function normalizeBlogSections() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return { error: "Unauthorized" };

  try {
    const mappings = [
      { from: ["article", "Article", "Articles "], to: "Articles" },
      { from: ["poem", "Poem", "Poems "], to: "Poems" },
      { from: ["campaign", "Campaign", "Campaigns "], to: "Campaigns" },
      { from: ["story", "story", "Story "], to: "Story" },
    ];

    let totalUpdated = 0;
    for (const mapping of mappings) {
      const result = await prisma.post.updateMany({
        where: { section: { in: mapping.from } },
        data: { section: mapping.to },
      });
      totalUpdated += result.count;
    }

    /* await recordActivity({
      action: "UPDATED",
      entity: "Post",
      details: `Normalized sections for ${totalUpdated} posts in database.`
    }); */

    /* revalidatePath("/admin/blog");
    revalidatePath("/blogs"); */
    
    return { success: true, count: totalUpdated };
  } catch (error: any) {
    console.error("DEBUG - Normalization error:", error);
    return { error: "Failed to normalize sections: " + String(error) };
  }
}

export async function postComment(postId: string, data: { content: string; rating: number; guestName?: string; guestEmail?: string }) {
  const session = await getSession();
  const { content, rating, guestName, guestEmail } = data;

  if (!content || content.trim().length < 2) {
    return { error: "Comment is too short." };
  }

  if (rating < 1 || rating > 5) {
    return { error: "Please provide a valid rating (1-5)." };
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        rating,
        postId,
        userId: session ? (session.id as string) : null,
        guestName: session ? null : "Anonymous",
        guestEmail: session ? null : guestEmail,
      },
    });

    revalidatePath(`/blog/[slug]`, "page");
    return { success: true, comment };
  } catch (error) {
    console.error("Post comment error:", error);
    return { error: "Error posting comment" };
  }
}

export async function deleteComment(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return { error: "Comment not found" };

    if (session.role !== "ADMIN" && session.id !== comment.userId) {
      return { error: "Unauthorized" };
    }

    await prisma.comment.delete({ where: { id } });
    
    await recordActivity({
      action: "DELETED",
      entity: "Comment",
      details: `Deleted comment ID: ${id}`
    });

    revalidatePath("/admin/comments");
    revalidatePath(`/blog/[slug]`, "page");
    return { success: true };
  } catch (error) {
    return { error: "Error deleting comment" };
  }
}

export async function updateComment(id: string, data: { content: string; rating: number }) {
  const session = await getSession();
  
  if (!session) {
    return { error: "Unauthorized" };
  }

  const { content, rating } = data;

  if (!content || content.trim().length < 5) {
    return { error: "Comment content is too short." };
  }

  try {
    const existingComment = await prisma.comment.findUnique({ where: { id } });
    if (!existingComment) return { error: "Comment not found" };

    if (session.role !== "ADMIN" && session.id !== existingComment.userId) {
      return { error: "Unauthorized" };
    }

    const comment = await prisma.comment.update({
      where: { id },
      data: {
        content,
        rating,
      },
    });

    await recordActivity({
      action: "UPDATED",
      entity: "Comment",
      details: `Updated comment ID: ${id}`
    });

    revalidatePath("/admin/comments");
    // Also revalidate the blog post page where this comment is displayed
    revalidatePath(`/blog/[slug]`, 'page');
    
    return { success: true, comment };
  } catch (error) {
    console.error("Update comment error:", error);
    return { error: "Error updating comment." };
  }
}
