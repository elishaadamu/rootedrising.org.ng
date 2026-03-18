import prisma from "@/lib/prisma";
import PamphletEditor from "@/components/admin/PamphletEditor";
import { notFound } from "next/navigation";

export default async function EditPamphletPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const pamphlet = await (prisma as any).pamphlet.findUnique({
    where: { id: resolvedParams.id }
  });

  if (!pamphlet) {
    notFound();
  }

  return <PamphletEditor initialData={pamphlet} isEditing={true} />;
}
