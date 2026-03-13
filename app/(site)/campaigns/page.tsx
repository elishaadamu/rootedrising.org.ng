"use client";

import { motion } from "framer-motion";
import Hero from "@/components/common/Hero";
import VideoCard from "@/components/common/VideoCard";

const campaigns = [
  { title: "Oil Extraction and Water Pollution", link: "https://www.youtube.com/embed/dy-baZfnC-c?si=qi38nrQ_swvxAdXY" },
  { title: "16 Days of Activism (Gender Based Violence)", link: "https://www.youtube.com/embed/veRrjFfKugY?si=MZAzTTV2Da0ct0WY" },
  { title: "What is Climate Change?", link: "https://www.youtube.com/embed/7UMDpY263y8?si=tmghp3cmx9MEi-YB" },
  { title: "We are all Eyewitnesses", link: "https://www.youtube.com/embed/-ZUkP1v-gsU?si=6WFryay3kOp97A-t" },
  { title: "Let Her Be ", link: "https://www.youtube.com/embed/tAgYJl18pC4?si=CLYn3gRcXtNB3dBA" },
  { title: "Expose + Debunk False Climate Change Solutions ", link: "https://www.youtube.com/embed/Ols5YIO4mDg?si=cfeOjJ2ls-UP8W38" },
  { title: "LOOK BEYOND OIL", link: "https://www.youtube.com/embed/lKGI15cs8-I?si=tmp1GFyQEQsODCEG" },
  { title: "DEALS BEHIND THE DRILLS", link: "https://www.youtube.com/embed/oP9Oaus7Zf0?si=dlm0rFouWhRVnWTk" },
  { title: "STOP EACOP (STORY OF NAMAZZI)", link: "https://www.youtube.com/embed/l-fkJZDcJbw?si=O0Fd9bbzFs0YFbz-" }
];

export default function CampaignsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero 
        title="Voice of the Frontline"
        subtitle="Exploring global climate narratives and youth-led advocacy through impactful storytelling."
        backgroundImage="/images/1.png"
      />

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {campaigns.map((video, idx) => (
              <VideoCard 
                key={idx}
                title={video.title}
                videoUrl={video.link}
                index={idx}
                aspect="square"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
