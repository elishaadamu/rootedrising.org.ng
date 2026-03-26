"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAISetting(key: string) {
  try {
    const setting = await (prisma as any).aISettings.findUnique({
      where: { key }
    });
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateAISetting(key: string, prompt: string) {
  try {
    const setting = await (prisma as any).aISettings.upsert({
      where: { key },
      update: { prompt },
      create: { key, prompt }
    });
    revalidatePath("/admin/ai");
    return { success: true, data: setting };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getAllAISettings() {
  try {
    const settings = await (prisma as any).aISettings.findMany();
    return { success: true, data: settings };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
