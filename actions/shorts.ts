"use server";
import { prisma } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';

const shortSchema = z.object({
    title: z.string({ message: "Title is required" }).min(5).max(40),
    description: z.string({ message: "Description is required" }).min(10).max(200),
    url: z.string({ message: "Shorts Url is required" }).url(),
})

type FormState = {
    errors?: {
        title?: string[];
        description?: string[];
        url?: string[];
    };
    successMessage?: string[];
    globalErrors?: string[];
}

export const uploadShorts = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    const rawData = {
        title: String(formData.get("title") || ""),
        description: String(formData.get("description") || ""),
        url: String(formData.get("url") || ""),
    };

   // console.error("RAW DATA IS ", rawData);

    const res = shortSchema.safeParse(rawData);

    if (!res.success) {
        return {
            errors: res.error.flatten().fieldErrors,
            globalErrors: res.error.flatten().formErrors,
        };
    }

    try {
        const { userId } = await auth();
        if (!userId) {
            return { globalErrors: ["Log in first to upload shorts"] };
        }

        const user = await prisma.user.findUnique({
            where: { clerkId: userId },
        });

        if (!user) {
            return { globalErrors: ["User not found"] };
        }

        await prisma.shorts.create({
            data: {
                userId: user.id,
                title: res.data.title,
                description: res.data.description,
                videoUrl: res.data.url,
            },
        });


    } catch (error) {
        console.error("Shorts upload failed:", error);

        if (error instanceof Error) {
            return { globalErrors: [error.message] };
        }

        return { globalErrors: ["Internal server error"] };
    }

    revalidatePath('/');
    redirect('/');
};
