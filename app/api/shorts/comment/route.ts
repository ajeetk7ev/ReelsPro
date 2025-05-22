import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";




export async function POST(req:NextRequest){
       try {
        const {comment, shortsId} = await req.json();
        console.log("COMMENT AND SHORTS ID",{comment,shortsId});

        if(!comment || !shortsId){
            return NextResponse.json({
                success:false,
                message:"All fields are required"
            },{status:400})
        }

        const {userId} = await auth();

        if(!userId){
            return NextResponse.json({
                success:false,
                message:"Unauthorized Log in first"
            },{status:401})
        }

        const user = await prisma.user.findUnique({
            where:{
                clerkId:userId
            }
        })

          if(!user){
              return NextResponse.json({
                success:false,
                message:"User not found"
            },{status:404})
        }



        await prisma.comment.create({
            data:{
                userId:user?.id,
                content:comment,
                shortsId:shortsId
            }
        })

      
        return NextResponse.json({
            success:true,
            message:"Comment created successfully"
        },{status:200})
       } catch (error) {
        console.log("error in create comment", error);
        return NextResponse.json({
            success:false,
            message:"Internal server error"
        },{status:500})
       }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const shortsId = searchParams.get("shortsId");

    if (!shortsId) {
      return NextResponse.json({ success: false, message: "Missing shortId" }, { status: 400 });
    }

    const comments = await prisma.comment.findMany({
      where: { shortsId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            name: true,
            imageUrl: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}


