import prisma from "@/lib/prisma";
import SubscriberList from "@/components/admin/SubscriberList";
import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function SubscribersPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin");
  }

  const subscribers = await (prisma as any).newsletter.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">Newsletter Subscribers</h2>
        <p className="text-sm sm:text-base text-slate-500 font-medium">Manage and view all users who have subscribed to your newsletter.</p>
      </div>

      <SubscriberList subscribers={subscribers} />
    </div>
  );
}
