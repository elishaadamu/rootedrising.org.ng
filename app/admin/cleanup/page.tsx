import prisma from "@/lib/prisma";
import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function CleanupPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  try {
    const result = await prisma.post.deleteMany({
      where: {
        NOT: {
          section: { in: ["Campaigns", "Campaign", "campaign"] }
        }
      }
    });

    return (
      <div className="p-20 text-center space-y-8">
        <h1 className="text-4xl font-black">Database Cleanup</h1>
        <div className="bg-emerald-50 text-emerald-700 p-8 rounded-2xl inline-block font-bold">
           Successfully deleted {result.count} non-campaign posts.
        </div>
        <p className="text-slate-500 font-medium">Your database now only contains Campaign-related content. Articles, Poems, and Stories have been cleared.</p>
        <div className="pt-8">
            <a href="/admin/blog" className="px-8 py-3 bg-brand-forest text-white rounded-xl font-bold">Back to Stories</a>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <div className="p-20 text-center text-rose-600">
        <h1 className="text-2xl font-black">Error during cleanup</h1>
        <p>{String(error)}</p>
      </div>
    );
  }
}
