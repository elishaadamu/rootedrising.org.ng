import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import HighlightEditor from "@/components/admin/HighlightEditor";

export default async function EditHighlightPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const post = await prisma.post.findUnique({
    where: { id: resolvedParams.id },
    include: { author: true }
  });

  if (!post) {
    notFound();
  }

  return <HighlightEditor initialData={post} />;
}
