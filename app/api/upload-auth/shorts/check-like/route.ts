
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
  console.log("hi ka hal chal");
  //  const {userId} = await auth();
  //  console.log("USER ID IS ",userId);
  // if (!userId) return NextResponse.json({ isLike: false });

  // const { shortId } = JSON.parse(( await req.json()));
  // console.log("shorts id in check-like ",shortId);

  // const user = await prisma.user.findUnique({
  //   where: { clerkId: userId }
  // });

  // if (!user) return NextResponse.json({ isLike: false });

  // const like = await prisma.like.findUnique({
  //   where: {
  //     userId_shortsId: {
  //       userId: user.id,
  //       shortsId: shortId,
  //     }
  //   }
  // });

  // return NextResponse.json({ isLike: !!like });
}
