import { SignUp } from "@clerk/nextjs";


export default function SignUpPage(){

    return(
        <main className="w-screen h-screen flex items-center justify-center">
            <SignUp/>
        </main>
    )
}