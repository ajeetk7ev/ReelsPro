import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { shortId } = await req.json();

    const totalLikes = await prisma.like.count({
      where: { shortsId: shortId },
    });

    return NextResponse.json({ totalLike: totalLikes });
  } catch (error) {
    console.error("Error in like-count:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
