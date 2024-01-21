import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{billboardid:string,storeId:string}}) {
    try {
        console.log(params);
        
        const body= await req.json();
        const {label,imageUrl}=body;
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

        if (!label) {
            return new NextResponse("label  is required",{status:400})
        }
        if (!imageUrl) {
            return new NextResponse("image url  is required",{status:400})
        }
      
        if (!params.billboardid) {
            return new NextResponse("billboard id   is required",{status:400})
        }
    
        const storeByUserId=await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse("Unauthorized ",{status:403})
        }

    const billboard= await prismadb.billboard.updateMany({

         where:{
                id:params.storeId
            },
        data:{
            label,imageUrl

        }
    })
    return  NextResponse.json(billboard)
    } catch (error) {
        console.log(error);
        
        console.log(`[billboards_patch ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function GET(req:Request,{params}:{params:{billboardid:string}}) {
    try {
      
    
      
        if (!params.billboardid) {
            return new NextResponse("billboard id   is required",{status:400})
        }
      

    const billboard= await prismadb.billboard.findUnique({
      
     where:{
        id:params.billboardid
     }
    })
    return  NextResponse.json(billboard)
    } catch (error) {
        console.log(error);
        
        console.log(`[billboard_get ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function DELETE(req:Request,{params}:{params:{storeId:string,
    billboardid:string

}}) {
    try {
         
    
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

    
        if (!params.billboardid) {
            return new NextResponse("Billboard id is required",{status:400})
        }
  
        const storeByUserId=await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        });
        if (!storeByUserId) {
            return new NextResponse("Unauthorized",{status:403})
        }
       
    const billboard= await prismadb.billboard.deleteMany({
        where:{
            id:params.billboardid
         
        }
    })
    return  NextResponse.json(billboard)
    } catch (error) {
        console.log(error);
        
        console.log(`[delete_delete ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}

