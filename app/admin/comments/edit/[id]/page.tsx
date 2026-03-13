import CommentEditor from "@/components/admin/CommentEditor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditCommentPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;

  if (!id) {
    return notFound();
  }

  const comment = await prisma.comment.findUnique({
    where: { id },
    include: { user: true, post: true }
  });

  if (!comment) {
    return notFound();
  }

  return <CommentEditor initialData={comment} />;
}
