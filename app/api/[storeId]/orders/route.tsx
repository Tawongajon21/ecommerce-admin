import prismadb from "@/lib/prismadb";
import {NextResponse} from "next/server";

const corsHeaders={
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type,Authorization"
}

export async function OPTIONS()  {
    return NextResponse.json({},{headers:corsHeaders})
}
 export async function POST(req:Request,{params}:{params:{storeId:string}}) {
    try {
        const body= await req.json();
        const {productIds}=body;
        const products = await prismadb.product.findMany({
            where: {
                id: { in: productIds },
            }
        })
        
        return NextResponse.json({data:products},{
            headers:corsHeaders
        })
    } catch (error) {
        return new NextResponse("Error ",{status:500})
    }
}