const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config(); // Try to load if available, or skip

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const videos = [
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

  for (let i = 0; i < videos.length; i++) {
    const v = videos[i];
    const slug = v.title.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    
    await prisma.video.upsert({
      where: { id: slug },
      update: {
        title: v.title,
        url: v.link,
        order: i,
        active: true
      },
      create: {
        id: slug,
        title: v.title,
        url: v.link,
        order: i,
        active: true
      }
    });
  }

  console.log('Videos seeded successfully!');
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
