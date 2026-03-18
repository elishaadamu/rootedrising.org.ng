"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createPamphlet(data: { title: string; image: string; content: string; url?: string }) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await (prisma as any).pamphlet.create({
      data: {
        id: slug,
        ...data
      }
    });
    revalidatePath("/campaigns");
    revalidatePath("/admin/pamphlets");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updatePamphlet(id: string, data: { title: string; image: string; content: string; url?: string; active?: boolean }) {
  try {
    const result = await (prisma as any).pamphlet.update({
      where: { id },
      data
    });
    revalidatePath("/campaigns");
    revalidatePath("/admin/pamphlets");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deletePamphlet(id: string) {
  try {
    await (prisma as any).pamphlet.delete({ where: { id } });
    revalidatePath("/campaigns");
    revalidatePath("/admin/pamphlets");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
