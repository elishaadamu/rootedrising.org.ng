import prisma from "@/lib/prisma";
import ArtvocacyEditor from "@/components/admin/ArtvocacyEditor";
import { notFound } from "next/navigation";

export default async function EditArtvocacyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const item = await (prisma as any).artvocacy.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!item) {
    notFound();
  }

  return <ArtvocacyEditor initialData={item} isEditing={true} />;
}
