import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{categoryid:string,storeId:string}}) {
    try {
        console.log(params);
        
        const body= await req.json();
        const {name,billboardId}=body;
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

        if (!name) {
            return new NextResponse("name  is required",{status:400})
        }
       
      
        if (!params.categoryid) {
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

    const category= await prismadb.category.updateMany({

         where:{
                id:params.categoryid
            },
        data:{
            name,billboardId

        }
    })
    return  NextResponse.json(category)
    } catch (error) {
        console.log(error);
        
        console.log(`[category_patch ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function GET(req:Request,{params}:{params:{categoryid:string}}) {
    try {
      
    
      
        if (!params.categoryid) {
            return new NextResponse("category id   is required",{status:400})
        }
      

    const category= await prismadb.category.findUnique({
      
     where:{
        id:params.categoryid
     },
     include:{
        billboard:true
     }
    })
    return  NextResponse.json(category)
    } catch (error) {
        console.log(error);
        
        console.log(`[category_get ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function DELETE(req:Request,{params}:{params:{storeId:string,
    categoryid:string

}}) {
    try {
         
    
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

    
        if (!params.categoryid) {
            return new NextResponse("category id is required",{status:400})
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
       
    const category= await prismadb.category.deleteMany({
        where:{
            id:params.categoryid
         
        }
    })
    return  NextResponse.json(category)
    } catch (error) {
        console.log(error);
        
        console.log(`[category_delete ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}

