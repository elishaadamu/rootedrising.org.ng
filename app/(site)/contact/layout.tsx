import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Rooted Rising Initiative. Reach out to collaborate, ask questions, or join our community of climate and gender justice advocates.",
  openGraph: {
    title: "Contact Rooted Rising | Let's Connect",
    description: "Start a conversation with our team and be part of the change.",
    images: ["/images/hero.png"], // Reusing high-quality hero image
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
