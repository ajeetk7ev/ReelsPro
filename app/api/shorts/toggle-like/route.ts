// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
// import { auth } from "@clerk/nextjs/server";

// export async function POST(req: Request) {
//   const { shortId, userId } = await req.json();

//    if (!userId) return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });

//   const user = await prisma.user.findUnique({
//     where: { clerkId: userId },
//   });

//   if (!user) return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });

//   const existingLike = await prisma.like.findFirst({
//     where: {
//       userId:user.id,
//       shortsId: shortId,
//     },
//   });

//   if (existingLike) {
//     await prisma.like.delete({
//       where: { id: existingLike.id },
//     });
//     return NextResponse.json({ success: true, isLike: false });
//   } else {
//     await prisma.like.create({
//       data: {
//         userId: user.id,
//         shortsId: shortId,
//       },
//     });
//     return NextResponse.json({ success: true, isLike: true });
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { shortId, userId } = await req.json();

    if (!userId || !shortId) {
      return NextResponse.json({ success: false, message: "Missing data" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: user.id,
        shortsId: shortId,
      },
    });

    if (existingLike) {
      await prisma.like.delete({ where: { id: existingLike.id } });
      return NextResponse.json({ success: true, isLike: false });
    }

    await prisma.like.create({
      data: {
        userId: user.id,
        shortsId: shortId,
      },
    });

    return NextResponse.json({ success: true, isLike: true });
  } catch (error) {
    console.error("Error in toggle-like:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
