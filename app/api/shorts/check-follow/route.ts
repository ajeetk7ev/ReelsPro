import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { adminUserId:targetUserId, userId } = await req.json();
    console.log("CHECK FOLLOW DATA ",targetUserId, userId);

    const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });

    if(!user){
      return NextResponse.json({ isFollowing: false });
    }

    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        }
      }
    });

    if (!follow) {
      return NextResponse.json({ isFollowing: false });
    }

    return NextResponse.json({isFollowing:true});
   
  } catch (error) {
    console.error("Error in check-follow route:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
