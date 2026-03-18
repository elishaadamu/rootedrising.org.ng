"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createVideo(data: { title: string; url: string; order?: number }) {
  try {
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const result = await (prisma as any).video.create({
      data: {
        id: slug,
        ...data
      }
    });
    revalidatePath("/campaigns");
    revalidatePath("/admin/videos");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateVideo(id: string, data: { title: string; url: string; order?: number; active?: boolean }) {
  try {
    const result = await (prisma as any).video.update({
      where: { id },
      data
    });
    revalidatePath("/campaigns");
    revalidatePath("/admin/videos");
    return { success: true, data: result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteVideo(id: string) {
  try {
    await (prisma as any).video.delete({ where: { id } });
    revalidatePath("/campaigns");
    revalidatePath("/admin/videos");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function seedInitialVideos() {
  const videos = [
    { title: "Oil Extraction and Water Pollution", link: "https://www.youtube.com/embed/dy-baZfnC-c?si=qi38nrQ_swvxAdXY" },
    { title: "16 Days of Activism (Gender Based Violence)", link: "https://www.youtube.com/embed/veRrjFfKugY?si=MZAzTTV2Da0ct0WY" },
    { title: "What is Climate Change?", link: "https://www.youtube.com/embed/7UMDpY263y8?si=tmghp3cmx9MEi-YB" },
    { title: "We are all Eyewitnesses", link: "https://www.youtube.com/embed/-ZUkP1v-gsU?si=6WFryay3kOp97A-t" },
    { title: "Let Her Be ", link: "https://www.youtube.com/embed/tAgYJl18pC4?si=CLYn3gRcXtNB3dBA" },
    { title: "Expose + Debunk False Climate Change Solutions ", link: "https://www.youtube.com/embed/Ols5YIO4mDg?si=cfeOjJ2ls-UP8W38" },
    { title: "LOOK BEYOND OIL", link: "https://www.youtube.com/embed/lKGI15cs8-I?si=tmp1GFyQEQsODCEG" },
    { title: "DEALS BEHIND THE DRILLS", link: "https://www.youtube.com/embed/oP9Oaus7Zf0?si=dlm0rFouWhRVnWTk" },
    { title: "STOP EACOP (STORY OF NAMAZZI)", link: "https://www.youtube.com/embed/l-fkJZDcJbw?si=O0Fd9bbzFs0YFbz-" }
  ];

  try {
    for (let i = 0; i < videos.length; i++) {
        const v = videos[i];
        const slug = v.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        await (prisma as any).video.upsert({
          where: { id: slug },
          update: {
            title: v.title,
            url: v.link,
            order: i,
            active: true
          },
          create: {
            id: slug,
            title: v.title,
            url: v.link,
            order: i,
            active: true
          }
        });
      }
      return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
