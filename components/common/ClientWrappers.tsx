"use client";

import dynamic from "next/dynamic";

const ChatBot = dynamic(() => import("@/components/common/ChatBot"), { ssr: false });
const Toaster = dynamic(() => import("sonner").then(m => m.Toaster), { ssr: false });

export default function ClientWrappers() {
  return (
    <>
      <Toaster position="top-right" richColors />
      <ChatBot />
    </>
  );
}
