"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordActivity } from "./logs";

export async function getTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: testimonials };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTestimonial(data: any) {
  try {
    const testimonial = await prisma.testimonial.create({
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        image: data.image,
        rating: data.rating || 5,
        active: data.active ?? true,
      },
    });
    await recordActivity({
      action: "CREATED",
      entity: "Testimonial",
      details: `Created testimonial: ${data.name}`
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, data: testimonial };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTestimonial(id: string, data: any) {
  try {
    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        content: data.content,
        image: data.image,
        rating: data.rating,
        active: data.active,
      },
    });
    await recordActivity({
      action: "UPDATED",
      entity: "Testimonial",
      details: `Updated testimonial: ${data.name}`
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true, data: testimonial };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await prisma.testimonial.delete({
      where: { id },
    });
    await recordActivity({
      action: "DELETED",
      entity: "Testimonial",
      details: `Deleted testimonial with ID: ${id}`
    });
    revalidatePath("/admin/testimonials");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
