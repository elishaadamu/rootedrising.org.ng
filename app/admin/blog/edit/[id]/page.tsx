import BlogEditor from "@/components/admin/BlogEditor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditBlogPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const id = params?.id;

  if (!id) {
    return notFound();
  }

  const post = await prisma.post.findUnique({
    where: { id }
  });

  if (!post) {
    return notFound();
  }

  return <BlogEditor initialData={post} />;
}
