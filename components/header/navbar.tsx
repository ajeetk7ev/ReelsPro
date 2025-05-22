"use client"

import { Menu, Plus, Search } from "lucide-react"
import { Button } from "../ui/button"
import { currentUser } from "@clerk/nextjs/server"
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"
import { ModeToggle } from "../mode-toggle"
import Link from "next/link"

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { SignedIn, SignOutButton, useUser } from "@clerk/nextjs"

import {
    DropdownMenu,
    DropdownMenuContent,
   
    DropdownMenuItem,

    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"



export const Navbar =  () => {
    const user = useUser();

    return (
        <header className="w-screen h-[60px] bg-slate-50 dark:bg-slate-950 py-3 shadow-sm border-b dark:border-slate-800">
            <div className="w-[85%] flex items-center justify-between mx-auto">
                {/* Logo */}
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">ReelsPro</h1>



                {/* Create button and User profile */}
              <div className="flex items-center gap-3">
                  <div className=" hidden md:flex items-center ">
                    <Link href={"/upload"} >
                        <Button className="flex items-center gap-1 bg-blue-600 text-white dark:bg-blue-500 dark:text-white hover:bg-blue-700 dark:hover:bg-blue-600">
                            <Plus className="w-4 h-4" />
                            Create
                        </Button>
                    </Link>
                </div>

                    <ModeToggle />

                    <div className="hidden md:block">

                        <DropdownMenu >
                            <DropdownMenuTrigger asChild>
                                <Avatar>
                                    <AvatarImage
                                        className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700"
                                        src={user.user?.imageUrl ?? "https://github.com/shadcn.png"}
                                    />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                               
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem>
                                   
                                       <p className="text-center">
                                          Dashboard
                                       </p>
                                   
                                </DropdownMenuItem>

                                <DropdownMenuItem>
                                   
                                        <div className="text-center">
                                            <SignedIn >
                                        <SignOutButton  />
                                        </SignedIn>
                                        </div>
                                    
                                   
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>



                <MobileNavbar />
              </div>
            </div>
        </header>

    )
}

 function MobileNavbar() {
    const user = useUser();
    return (
        <div className="block md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="w-5 h-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col gap-6 bg-slate-50 dark:bg-slate-900">
                    {/* Header with Avatar and Mode Toggle */}
                    <SheetHeader>
                        <SheetTitle className="text-2xl  font-semibold text-slate-950 dark:text-slate-50 text-center mt-3">Welcome to ReelsPro</SheetTitle>
                        <div className="flex items-center justify-around mt-4">
                            <div className="flex flex-col items-center ">
                                <Avatar>
                                    <AvatarImage
                                        className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-700"
                                        src={user.user?.imageUrl ?? "https://github.com/shadcn.png"}
                                    />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>

                                <p className="text-2xl font-semibold">{user.user?.fullName}</p>


                            </div>

                            {/* <ModeToggle /> */}

                        </div>
                    </SheetHeader>


                    {/* Create Button */}
                    <Link href={"/upload"}>
                        <Button className="w-[80%] mx-auto bg-slate-600 text-white dark:bg-slate-800 dark:text-white   flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Create Short
                        </Button>
                    </Link>

                    <Link href={"/dashboard"}>
                       <Button className="w-[80%] mx-auto bg-slate-600 text-white dark:bg-slate-800 dark:text-white  flex items-center gap-2">
                          Dashboard
                        </Button>
                    </Link>


                    <SignedIn>
                        <SignOutButton />
                    </SignedIn>



                </SheetContent>
            </Sheet>
        </div>
    )
}

