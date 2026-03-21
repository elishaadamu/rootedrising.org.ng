"use server";

import prisma from "@/lib/prisma";

export async function searchContent(query: string) {
  if (!query || query.length < 2) return { posts: [] };

  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        title: true,
        slug: true,
        section: true,
        createdAt: true,
      },
      take: 5,
    });

    return {
      posts: posts.map(post => ({
        ...post,
        type: post.section === 'Campaign' ? 'Campaign' : 'Blog',
        url: `/${post.section.toLowerCase()}/${new Date(post.createdAt).getFullYear()}/${String(new Date(post.createdAt).getMonth() + 1).padStart(2, '0')}/${String(new Date(post.createdAt).getDate()).padStart(2, '0')}/${post.slug}`
      }))
    };
  } catch (error) {
    console.error("Search error:", error);
    return { posts: [] };
  }
}
