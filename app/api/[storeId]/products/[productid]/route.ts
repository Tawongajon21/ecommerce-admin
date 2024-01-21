import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(req:Request,{params}:{params:{productid:string,storeId:string}}) {
    try {
        console.log(params);
        
        const body= await req.json();
        const {name,price,categoryId,colorId,sizeId,images,isFeatured,isArchived}=body;
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

        if (!name) {
            return new NextResponse("name  is required",{status:400})
        }
        if (!price) {
            return new NextResponse("price  is required",{status:400})
        }
        if (!categoryId) {
            return new NextResponse("category  is required",{status:400})
        }
      
        if (!colorId) {
            return new NextResponse("color id  is required",{status:400})
        }
        if (!sizeId) {
            return new NextResponse("side id  is required",{status:400})
        }
        if (!images) {
            return new NextResponse("images are required",{status:400})
        }
        if (!isFeatured) {
            return new NextResponse("Is Featured is required",{status:400})
        }
        if (!isArchived) {
            return new NextResponse("Is Archived is required",{status:400})
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

    await prismadb.product.update({

         where:{
                id:params.productid
            },
        data:{
            name,price,categoryId,colorId,sizeId,
            images:{
                deleteMany:{}
            }
,
isArchived,
isFeatured
        }
    })
    const product= await prismadb.product.update({
        where:{
            id:params.productid
        },
        data:{
            images:{
                createMany:{
                    data:[
                        ...images.map((image:{url:string})=>image)
                    ]
                }
            }
        }
    })
    return  NextResponse.json(product)
    } catch (error) {
        console.log(error);
        
        console.log(`[product_patch ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function GET(req:Request,{params}:{params:{productid:string}}) {
    try {
      
    
      
        if (!params.productid) {
            return new NextResponse("product id   is required",{status:400})
        }
      

    const product= await prismadb.product.findUnique({
      
     where:{
        id:params.productid
     },
     include:{
        images : true,
        category:true,
        size:true,
        color:true
     }
    })
    return  NextResponse.json(product)
    } catch (error) {
        console.log(error);
        
        console.log(`[product_get ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}
export async function DELETE(req:Request,{params}:{params:{storeId:string,
    productid:string

}}) {
    try {
         
    
        const {userId}= auth();

        if (!userId) {
            return new NextResponse("Unauthenticated",{status:401})
        }

    
        if (!params.productid) {
            return new NextResponse("product id is required",{status:400})
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
       
    const product= await prismadb.product.deleteMany({
        where:{
            id:params.productid
         
        }
    })
    return  NextResponse.json(product)
    } catch (error) {
        console.log(error);
        
        console.log(`[product_delete ${error}`);
        return new NextResponse("Internal error",{status:500})
    
    }
}

