import { normalizeBlogSections } from "@/lib/actions/blog";
import { getSession } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

export default async function MigrationPage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/");
  }

  const result = await normalizeBlogSections();

  return (
    <div className="p-20 text-center space-y-8">
      <h1 className="text-4xl font-black">Database Normalization</h1>
      <pre className="bg-slate-100 p-8 rounded-2xl text-left inline-block">
        {JSON.stringify(result, null, 2)}
      </pre>
      <p className="text-slate-500 font-medium">
        If you see "success: true", your database has been normalized to use "Articles", "Poems", "Campaigns", and "Story".
      </p>
    </div>
  );
}
