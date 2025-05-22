import { saveUser } from "@/actions/save-user";
import { HomePage } from "@/components/home/home-page";
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
          imageUrl: true,
        },
      },
    },
  });

  return <HomePage shorts={shorts} />;
}
