"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function seedCampaignContent() {
  try {
    // 1. Seed Pamphlets
    const pamphlets = [
      {
        image: "/images/world-day-of-justice.png",
        title: "World Day of Justice",
        content: "We believe in inclusion and equality 📍 <br> Let’s support the rights of equality for all.<br> Gender, racism, language barriers, culture and religion only make life beautiful in diversity.",
        url: "https://www.instagram.com/p/DGTL0qNCFPD/?igsh=MWdqZmpmczc4NG1raQ=="
      },
      {
        image: "/images/timber-tomorrow.png",
        title: "Timber Or Tomorrow",
        content: "Join the fight against Deforestation!",
        url: "https://www.instagram.com/p/DGAYw0Dokae/?igsh=NGJ3ZThwM3lqYTNi"
      },
      {
        image: "/images/water-not-oil.png",
        title: "Water not Oil",
        content: "How oil pollution leads to water scarcity for children in the Niger Delta...",
        url: "https://www.instagram.com/p/DEhPsijIVSb/?igsh=MWZwOTZnZnc0czFpcg=="
      }
    ];

    for (const p of pamphlets) {
      await (prisma as any).pamphlet.upsert({
        where: { id: p.title.toLowerCase().replace(/[^a-z0-9]/g, '-') },
        update: { ...p, active: true },
        create: { id: p.title.toLowerCase().replace(/[^a-z0-9]/g, '-'), ...p, active: true }
      });
    }

    // 2. Seed Artvocacy (Single YouTube Video from the image)
    const artvocacyVideo = {
      id: "artvocacy-highlight",
      title: "Artvocacy",
      content: "Where art meets advocacy.",
      image: "https://img.youtube.com/vi/q1jYkK_M_k4/maxresdefault.jpg", // I'll assume a video ID or leave for user to edit
      url: "https://www.youtube.com/embed/q1jYkK_M_k4" // Placeholder ID based on common advocacy vids or image search 
    };

    await (prisma as any).artvocacy.upsert({
      where: { id: artvocacyVideo.id },
      update: { ...artvocacyVideo, active: true },
      create: { ...artvocacyVideo, active: true }
    });


    revalidatePath("/campaigns");
    return { success: true };
  } catch (error: any) {
    console.error("Seeding Error:", error);
    return { success: false, error: error.message };
  }
}
