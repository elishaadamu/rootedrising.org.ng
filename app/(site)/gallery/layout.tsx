import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Gallery",
  description: "A visual journey through Rooted Rising's fieldwork, community engagements, and artistic advocacy. See the change in action through our lens.",
  openGraph: {
    title: "Rooted Rising Gallery | Visual Advocacy",
    description: "Experience our story through high-impact photography and media captured from the frontlines.",
    images: ["/images/hero.png"],
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
