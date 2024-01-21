import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{sizeid:string,storeId:string}}) {
    try {
        console.log(params);
        
        const body= await req.json();
        const {name,value}=body;
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

        if (!name) {
            return new NextResponse("name  is required",{status:400})
        }
       
      
        if (!params.sizeid) {
            return new NextResponse("size id   is required",{status:400})
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

    const size= await prismadb.size.updateMany({

         where:{
                id:params.sizeid
            },
        data:{
            name,value

        }
    })
    return  NextResponse.json(size)
    } catch (error) {
        console.log(error);
        
        console.log(`[size_patch ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function GET(req:Request,{params}:{params:{sizeId:string}}) {
    try {
      
    
      
        if (!params.sizeId) {
            return new NextResponse("size id   is required",{status:400})
        }
      

    const size= await prismadb.size.findUnique({
      
     where:{
        id:params.sizeId
     }
    })
    return  NextResponse.json(size)
    } catch (error) {
        console.log(error);
        
        console.log(`[size_get ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function DELETE(req:Request,{params}:{params:{storeId:string,
    sizeid:string

}}) {
    try {
         
    
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

    
        if (!params.sizeid) {
            return new NextResponse("size id is required",{status:400})
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
       
    const size= await prismadb.size.deleteMany({
        where:{
            id:params.sizeid
         
        }
    })
    return  NextResponse.json(size)
    } catch (error) {
        console.log(error);
        
        console.log(`[size_delete ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}

