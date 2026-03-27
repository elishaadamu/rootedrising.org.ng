"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createArtvocacy(data: { title: string; url: string; content?: string; image?: string }) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    // Auto-generate image from YouTube if not provided
    let image = data.image || "";
    if (!image && data.url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = data.url.match(regExp);
      const ytId = (match && match[2].length === 11) ? match[2] : null;
      if (ytId) {
        image = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
    }

    const result = await (prisma as any).artvocacy.create({
      data: {
        id: slug,
        ...data,
        image,
        active: true
      }
    });
    revalidatePath("/campaigns");
    revalidatePath("/admin/artvocacy");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateArtvocacy(id: string, data: { title: string; url: string; content?: string; active?: boolean; image?: string }) {
  try {
    const updateData = { ...data };
    
    // Auto-generate image from YouTube if not provided and url changed
    if (!updateData.image && updateData.url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
      const match = updateData.url.match(regExp);
      const ytId = (match && match[2].length === 11) ? match[2] : null;
      if (ytId) {
        updateData.image = `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`;
      }
    }

    const result = await (prisma as any).artvocacy.update({
      where: { id },
      data: updateData
    });
    revalidatePath("/campaigns");
    revalidatePath("/admin/artvocacy");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteArtvocacy(id: string) {
  try {
    await (prisma as any).artvocacy.delete({ where: { id } });
    revalidatePath("/campaigns");
    revalidatePath("/admin/artvocacy");
    revalidatePath("/artvocacy");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getArtvocacies() {
  try {
    const artvocacies = await (prisma as any).artvocacy.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });
    return { success: true, data: artvocacies };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
