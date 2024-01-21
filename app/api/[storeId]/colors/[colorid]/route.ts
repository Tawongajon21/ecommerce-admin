import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{colorid:string,storeId:string}}) {
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
       
      
        if (!params.colorid) {
            return new NextResponse("color id   is required",{status:400})
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

    const color= await prismadb.size.updateMany({

         where:{
                id:params.colorid
            },
        data:{
            name,value

        }
    })
    return  NextResponse.json(color)
    } catch (error) {
        console.log(error);
        
        console.log(`[color_patch ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function GET(req:Request,{params}:{params:{colorId:string}}) {
    try {
      
    
      
        if (!params.colorId) {
            return new NextResponse("color id   is required",{status:400})
        }
      

    const color= await prismadb.size.findUnique({
      
     where:{
        id:params.colorId
     }
    })
    return  NextResponse.json(color)
    } catch (error) {
        console.log(error);
        
        console.log(`[color_get ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function DELETE(req:Request,{params}:{params:{storeId:string,
    colorid:string

}}) {
    try {
         
    
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

    
        if (!params.colorid) {
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
       
    const color= await prismadb.color.deleteMany({
        where:{
            id:params.colorid
         
        }
    })
    return  NextResponse.json(color)
    } catch (error) {
        console.log(error);
        
        console.log(`[color_delete ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}

