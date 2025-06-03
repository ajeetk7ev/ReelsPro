import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { targetUserId, userId } = await req.json(); // both are Clerk IDs

    // Fetch both users by clerkId
   const user = await prisma.user.findUnique({
      where: { clerkId: userId }
    });


    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if already following
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: user.id,
          followingId: targetUserId,
        },
      },
    });

    if (follow) {
      // Unfollow
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: user.id,
            followingId: targetUserId,
          },
        },
      });

      return NextResponse.json({ success: true, isFollowing: false, message: "Unfollowed successfully" });
    } else {
      // Follow
      await prisma.follow.create({
        data: {
          followerId: user.id,
          followingId: targetUserId,
        },
      });

      return NextResponse.json({ success: true, isFollowing: true, message: "Followed successfully" });
    }
  } catch (error) {
    console.error("Error in toggle-follow route:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
