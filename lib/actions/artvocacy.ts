"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createArtvocacy(data: { title: string; url: string; content?: string }) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await (prisma as any).artvocacy.create({
      data: {
        id: slug,
        ...data,
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

export async function updateArtvocacy(id: string, data: { title: string; url: string; content?: string; active?: boolean }) {
  try {
    const result = await (prisma as any).artvocacy.update({
      where: { id },
      data
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
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
