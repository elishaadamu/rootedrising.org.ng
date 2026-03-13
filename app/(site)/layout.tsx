import Navbar from "@/components/common/Navbar";
import dynamic from "next/dynamic";

const Footer = dynamic(() => import("@/components/common/Footer"), { ssr: true });

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="grow">
        {children}
      </main>
      <Footer />
    </>
  );
}
