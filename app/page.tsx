import { saveUser } from "@/actions/save-user";
import { Navbar } from "@/components/header/navbar";
import ShortsFeed from "@/components/shorts/shorts-feed";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  await saveUser();

  const shorts = await prisma.shorts.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return (
     <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
      {/* shorts container  */}
      <div className="fixed left-0 right-0 top-0 z-50">
         <Navbar />
      </div>
      <div className="flex flex-col items-center pt-[40px]">
        {shorts.map((short) => (
          <div key={short.id} className="snap-start flex justify-center items-center h-screen">
            <ShortsFeed short={short} />
          </div>
        ))}
      </div>
    </div>
  );
}
