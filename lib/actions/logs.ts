"use server";

import prisma from "@/lib/prisma";
import { getSession } from "./auth";

export async function recordActivity({ 
  action, 
  entity, 
  details 
}: { 
  action: string; 
  entity: string; 
  details: string; 
}) {
  try {
    const session = await getSession();
    if (!session || !session.id) {
      console.warn("Activity not recorded: Unauthorized or No ID in session");
      return { success: false, error: "Unauthorized" };
    }

    await (prisma as any).activityLog.create({
      data: {
        userId: session.id as string,
        action,
        entity,
        details,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to record activity:", error);
    return { success: false, error };
  }
}

export async function getActivityLogs() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") return { success: false, error: "Unauthorized" };

    const logs = await (prisma as any).activityLog.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 100, // Limit to last 100 logs for performance
    });

    return { success: true, data: logs };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
