"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { recordActivity } from "./logs";
import { sendEmail } from "@/lib/mail";
import { getSession } from "./auth";

export async function getUsers() {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: users };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return { success: false, error: "Unauthorized. Only admins can change roles." };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const oldRole = user.role;
    
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    await recordActivity({
      action: "UPDATED",
      entity: "User",
      details: `Changed role for ${user.email} from ${oldRole} to ${newRole}`,
    });

    // Send email notification for Admin or Editor upgrades
    if (newRole === "ADMIN" || newRole === "EDITOR") {
      const isUpgrade = (oldRole === "USER") || (oldRole === "EDITOR" && newRole === "ADMIN");
      
      if (isUpgrade) {
          const roleTitle = newRole === "ADMIN" ? "Administrative" : "Editorial";
          const roleSubject = newRole === "ADMIN" 
            ? "Your account has been upgraded to Administrator! 🔐" 
            : "Your account has been upgraded to Editor! 🖋️";
          
          await sendEmail({
            to: user.email,
            subject: roleSubject,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 30px; border: 1px solid #e2e8f0; border-radius: 24px; color: #1e293b; background-color: #ffffff;">
                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}">
                    <img src="cid:logo" alt="Rooted Rising Logo" style="height: 60px; margin-bottom: 20px; border: none;" />
                  </a>
                  <h1 style="color: #DA8E1F; margin: 0; font-size: 28px; font-weight: 900;">Rooted Rising Portal</h1>
                  <p style="text-transform: uppercase; font-size: 10px; letter-spacing: 2px; font-weight: 800; color: #64748b; margin-top: 5px;">${roleTitle} Access Granted</p>
                </div>
                
                <div style="background-color: #f8fafc; padding: 25px; border-radius: 20px; margin-bottom: 30px;">
                  <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin-top: 0;">Congratulations, ${user.name}!</h2>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6;">Your account on the Rooted Rising Portal has been upgraded to the <strong>${newRole}</strong> role.</p>
                  <p style="font-size: 15px; color: #475569; line-height: 1.6;">You now have expanded permissions to manage the platform's content and operations.</p>
                </div>

                <div style="text-align: center; margin-bottom: 30px;">
                  <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://rootedrising.org.ng'}/login" style="background-color: #1A233E; color: white; padding: 16px 35px; border-radius: 16px; text-decoration: none; font-weight: 900; display: inline-block; font-size: 15px; box-shadow: 0 10px 15px -3px rgba(26, 35, 62, 0.2);">Go to Dashboard</a>
                </div>

                <div style="padding-top: 25px; border-top: 1px solid #f1f5f9; font-size: 12px; color: #94a3b8; text-align: center;">
                  © ${new Date().getFullYear()} Rooted Rising Initiative. <br/>
                  Rooted in Truth, Rising for Justice
                </div>
              </div>
            `,
          });
      }
    }

    revalidatePath("/admin/users");
    return { success: true, data: updatedUser };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteUser(userId: string) {
    try {
      const session = await getSession();
      if (!session || session.role !== "ADMIN") {
        return { success: false, error: "Unauthorized." };
      }
  
      await prisma.user.delete({
        where: { id: userId },
      });
  
      await recordActivity({
        action: "DELETED",
        entity: "User",
        details: `Deleted user with ID: ${userId}`,
      });
  
      revalidatePath("/admin/users");
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
