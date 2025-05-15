"use client";
import { uploadShorts } from "@/actions/shorts";
import UploadFile from "@/components/imagekit-upload";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useState } from "react";

type FormState = {
    errors?: {
        title?: string[];
        description?: string[];
        url?: string[];
    };
    successMessage?: string[];
    globalErrors?: string[];
};

const initialState: FormState = {};

export default function UploadReelPage() {
    const [formState, action, isPending] = useActionState(uploadShorts, initialState);
    const [shortsUrl, setShortsUrl] = useState("");

    return (
        <div className="w-screen h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
            <Card className="w-[500px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-md rounded-xl">
                <CardHeader className="text-xl font-semibold text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-slate-700 py-4 text-center">
                    Upload Your Reel Here
                </CardHeader>

                <CardContent className="p-6 space-y-6">
                    <form action={action} className="space-y-6">
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-slate-800 dark:text-slate-200">Title</Label>
                            <Input
                                type="text"
                                name="title"
                                placeholder="Enter title here"
                                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            {formState.errors?.title?.map((err, i) => (
                                <p key={i} className="text-red-500 text-sm">{err}</p>
                            ))}
                        </div>

                        <div className="space-y-3">
                            <Label htmlFor="description" className="text-slate-800 dark:text-slate-200">Description</Label>
                            <Input
                                type="text"
                                name="description"
                                placeholder="Enter description here"
                                className="w-full bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                            />
                            {formState.errors?.description?.map((err, i) => (
                                <p key={i} className="text-red-500 text-sm">{err}</p>
                            ))}
                        </div>

                        <UploadFile setShortsUrl={setShortsUrl} />

                        <Input type="text" name="url" hidden value={shortsUrl} readOnly />
                        {formState.errors?.url?.map((err, i) => (
                            <p key={i} className="text-red-500 text-sm">{err}</p>
                        ))}

                        {formState.globalErrors?.map((err, i) => (
                            <p key={i} className="text-red-600 text-sm">{err}</p>
                        ))}

                        {formState.successMessage?.map((msg, i) => (
                            <p key={i} className="text-green-600 text-sm">{msg}</p>
                        ))}

                        <Button
                            className="w-full bg-blue-600 text-white dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                            type="submit"
                            disabled={isPending}
                        >
                            {isPending ? "Uploading..." : "Create Shorts"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
