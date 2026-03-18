import VideoEditor from "@/components/admin/VideoEditor";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EditVideo(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const video = await (prisma as any).video.findUnique({
    where: { id }
  });

  if (!video) return notFound();

  return (
    <div className="py-6 sm:py-10">
      <VideoEditor initialData={video} />
    </div>
  );
}
