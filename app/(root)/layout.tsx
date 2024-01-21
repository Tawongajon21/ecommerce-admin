import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function SetupLayout({children}:{childen:React.ReactNode}){
    const {userId}= auth();
    console.log(userId);
    
    if (!userId) {
    redirect("/sign-in")
    }


const store= await prismadb.store.findFirst({
    where:{
        userId

    }
})
if (store) {
    redirect(`/${store.id}`)
}
return (
    <>
    <div className="">
        this is the navbar
    </div>
    {children}
    </>
)
}