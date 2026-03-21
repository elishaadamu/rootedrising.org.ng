"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/mail";
import { recordActivity } from "./logs";

export async function getTeamMembers() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return { success: true, data: members };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createTeamMember(data: any) {
  try {
    const member = await prisma.teamMember.create({
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: data.image,
        linkedin: data.linkedin,
        facebook: data.facebook,
        instagram: data.instagram,
        email: data.email,
        order: data.order || 0,
      },
    });

    // Automatically create an admin user for the team member
    if (data.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email: data.email },
      });

      if (!existingUser) {
        const hashedPassword = await bcrypt.hash("password", 10);
        await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            password: hashedPassword,
            role: "EDITOR",
          },
        });
        
        // Send Welcome Email to the new Editor
        try {
          await sendEmail({
            to: data.email,
            subject: "Welcome to the Rooted Rising Editorial Team! 🖋️",
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}">
                    <img src="cid:logo" alt="Rooted Rising Logo" style="height: 60px; margin-bottom: 20px; border: none;" />
                  </a>
                  <h1 style="color: #DA8E1F; margin: 0; font-size: 28px; font-weight: 900;">Rooted Rising Portal</h1>
                  <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 2px; font-weight: 800; color: #64748b; margin-top: 5px;">Editorial Access Granted</p>
                </div>
                
                <div style="background-color: #f8fafc; padding: 25px; border-radius: 20px; margin-bottom: 30px;">
                  <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Welcome, ${data.name}!</h2>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6;">You have been added as a team member and granted <strong>Editor</strong> access to the Rooted Rising dashboard. You can now manage blog posts, campaigns, artvocacy, and more.</p>
                </div>

                <div style="padding: 0 10px; margin-bottom: 30px;">
                  <h3 style="font-size: 14px; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 15px;">Your Login Credentials</h3>
                  <div style="background-color: #ffffff; border: 1px solid #e2e8f0; padding: 15px; border-radius: 16px;">
                    <p style="margin: 0 0 10px 0; font-size: 14px;"><strong>Email:</strong> ${data.email}</p>
                    <p style="margin: 0; font-size: 14px;"><strong>Password:</strong> <code style="background-color: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace;">password</code></p>
                  </div>
                  <p style="font-size: 13px; color: #ef4444; font-weight: 700; margin-top: 15px;">⚠️ Please change your password immediately after logging in for security.</p>
                </div>

                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}/login" style="background-color: #1A233E; color: white; padding: 16px 35px; border-radius: 16px; text-decoration: none; font-weight: 900; display: inline-block; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(26, 35, 62, 0.2);">Access Dashboard</a>
                </div>

                <div style="padding-top: 25px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center;">
                  © ${new Date().getFullYear()} Rooted Rising Initiative. <br/>
                  Roots of Resilience, Rising for our Future
                </div>
              </div>
            `,
          });
        } catch (emailErr) {
          console.error("Failed to send welcome email:", emailErr);
        }
      }
    }

    await recordActivity({
      action: "CREATED",
      entity: "TeamMember",
      details: `Created team member: ${data.name}`
    });

    revalidatePath("/admin/team");
    revalidatePath("/about");
    return { success: true, data: member };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateTeamMember(id: string, data: any) {
  try {
    const oldMember = await prisma.teamMember.findUnique({ where: { id } });
    
    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: data.name,
        role: data.role,
        bio: data.bio,
        image: data.image,
        linkedin: data.linkedin,
        facebook: data.facebook,
        instagram: data.instagram,
        email: data.email,
        order: data.order,
      },
    });

    // If email changed, update the user record too
    if (oldMember?.email && data.email && oldMember.email !== data.email) {
      await prisma.user.updateMany({
        where: { email: oldMember.email },
        data: { 
          email: data.email,
          name: data.name 
        },
      });
    }

    await recordActivity({
      action: "UPDATED",
      entity: "TeamMember",
      details: `Updated team member: ${data.name}`
    });

    revalidatePath("/admin/team");
    revalidatePath("/about");
    return { success: true, data: member };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteTeamMember(id: string) {
  try {
    await prisma.teamMember.delete({
      where: { id },
    });
    await recordActivity({
      action: "DELETED",
      entity: "TeamMember",
      details: `Deleted team member with ID: ${id}`
    });

    revalidatePath("/admin/team");
    revalidatePath("/about");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
