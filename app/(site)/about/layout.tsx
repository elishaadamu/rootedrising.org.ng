import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Rooted Rising's mission to harness storytelling, art, and grassroots activism for climate action and gender equality. Discover our methodology and the team behind the movement.",
  openGraph: {
    title: "About Rooted Rising | Rooted in Truth, Rising for Justice",
    description: "Discover how we amplify frontline voices through media advocacy and artistic impact.",
    images: ["/images/about-us.jpg"],
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
