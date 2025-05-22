
import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";


export async function POST(req: NextRequest) {

  const { shortId, userId } = await req.json();
  console.log("shorts id in check-like ",shortId, );

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user) return NextResponse.json({ isLike: false });

  const like = await prisma.like.findUnique({
    where: {
      userId_shortsId: {
        userId:user.id,
        shortsId: shortId,
      }
    }
  });

  return NextResponse.json({ isLike: !!like });
}
