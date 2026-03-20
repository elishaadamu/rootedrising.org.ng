"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail, sendBulkEmail } from "@/lib/mail";
import { getSession } from "./auth";
import { recordActivity } from "./logs";

export async function subscribeNewsletter(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email || !email.includes("@")) {
    return { error: "Please provide a valid email address." };
  }

  try {
    // Check if already subscribed
    const existing = await (prisma as any).newsletter.findUnique({
      where: { email }
    });

    if (existing) {
      return { error: "You are already subscribed to our perspectives." };
    }

    // Save to database
    await (prisma as any).newsletter.create({
      data: { email }
    });

    // Send Welcome Email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to the Rooted Rising Community! 🌍",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 20px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}">
              <img src="cid:logo" alt="Rooted Rising Logo" style="height: 50px; margin-bottom: 20px; border: none;" />
            </a>
            <h2 style="color: #DA8E1F; margin-top: 0;">Welcome to Rooted Rising!</h2>
            <div style="text-align: left;">
              <p>Thank you for subscribing to our newsletter. You're now part of a global youth-led community dedicated to climate resilience and sustainable development in underserved communities.</p>
              <p>We'll keep you updated with:</p>
              <ul>
                <li>Localized climate insights</li>
                <li>Research field notes</li>
                <li>Impact stories from our communities</li>
              </ul>
              <p>Stay connected!</p>
            </div>
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
              © ${new Date().getFullYear()} Rooted Rising Initiative. Roots of Resilience, Rising for our Future.
            </div>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Email delivery failed:", emailError);
      // We don't return error here because the DB subscription succeeded
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Newsletter error:", error);
    return { error: "Failed to subscribe. Please try again later." };
  }
}

export async function deleteSubscriber(id: string) {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  try {
    await (prisma as any).newsletter.delete({
      where: { id }
    });
    
    await recordActivity({
      action: "DELETED",
      entity: "Subscriber",
      details: `Admin deleted subscriber (ID: ${id})`
    });
    
    revalidatePath("/admin/subscribers");
    return { success: true };
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return { error: "Failed to delete subscriber." };
  }
}

import { campaignTemplates } from "@/lib/constants/templates";

export async function sendCampaign(formData: FormData) {
  const templateId = formData.get("templateId") as string;
  const subject = formData.get("subject") as string;
  const content = formData.get("content") as string;

  if (!subject || !content) {
    return { error: "Subject and content are required." };
  }

  try {
    const subscribers = await (prisma as any).newsletter.findMany();
    if (subscribers.length === 0) {
      return { error: "No subscribers found to send to." };
    }


    // Optimize: Send in bulk using ZeptoMail's multiple recipients feature
    const emails = subscribers.map((sub: any) => sub.email);
    const result = await sendBulkEmail({
      emails,
      subject,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 20px; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}">
              <img src="cid:logo" alt="Rooted Rising Logo" style="height: 60px; margin-bottom: 20px; border: none;" />
            </a>
            <h1 style="color: #DA8E1F; margin: 0;">Rooted Rising</h1>
            <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 2px; font-weight: bold; color: #64748b;">Roots of Resilience, Rising for our Future</p>
          </div>
          <div style="line-height: 1.6; font-size: 16px;">
            ${content.replace(/\n/g, '<br/>')}
          </div>
          <div style="margin-top: 40px; text-align: center;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}/blogs" style="background-color: #1A233E; color: white; padding: 12px 25px; border-radius: 10px; text-decoration: none; font-weight: bold; display: inline-block;">Read More on our Blog</a>
          </div>
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #94a3b8; text-align: center;">
            You are receiving this because you subscribed to the Rooted Rising Initiative updates.<br/>
            Jos, Nigeria
          </div>
        </div>
      `,
    });

    const sentCount = (result as any).count || 0;

    // Log the campaign
    await (prisma as any).campaign.create({
      data: {
        subject,
        content,
        template: templateId,
        sentCount
      }
    });

    await recordActivity({
      action: "CREATED",
      entity: "Campaign",
      details: `Sent campaign: "${subject}" to ${sentCount} subscribers`
    });

    revalidatePath("/admin/subscribers");
    return { success: true, sentCount };
  } catch (error) {
    console.error("Campaign error:", error);
    return { error: "Failed to process campaign. Please check SMTP settings." };
  }
}

export async function notifySubscribersOfNewPost(post: { title: string; excerpt: string; slug: string; section?: string; image?: string }) {
  try {
    const subscribers = await (prisma as any).newsletter.findMany();
    if (subscribers.length === 0) return { success: true, message: "No subscribers" };

    const emails = subscribers.map((sub: any) => sub.email);
    const postUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}/blogs/${post.slug}`;

    return await sendBulkEmail({
      emails,
      subject: `New Perspectives: ${post.title} 📝`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 20px; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}">
              <img src="cid:logo" alt="Rooted Rising Logo" style="height: 60px; margin-bottom: 20px; border: none;" />
            </a>
            <h1 style="color: #DA8E1F; margin: 0;">New Post Alert!</h1>
            <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 2px; font-weight: bold; color: #64748b;">Latest from Rooted Rising Initiative</p>
          </div>
          
          ${post.image ? `<div style="margin-bottom: 25px;"><img src="${post.image}" alt="${post.title}" style="width: 100%; border-radius: 15px; max-height: 300px; object-cover" /></div>` : ''}
          
          <h2 style="font-size: 24px; font-weight: 800; color: #0f172a; margin-top: 0; margin-bottom: 10px;">${post.title}</h2>
          <p style="font-size: 16px; color: #475569; line-height: 1.6; margin-bottom: 25px;">${post.excerpt || 'Read our latest insights on climate resilience and sustainable development.'}</p>
          
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${postUrl}" style="background-color: #1A233E; color: white; padding: 15px 30px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">Continue Reading</a>
          </div>
          
          <div style="padding-top: 25px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center;">
            You are receiving this because you subscribed to Rooted Rising updates.<br/>
            Jos, Nigeria
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Post notification error:", error);
    return { success: false, error };
  }
}
