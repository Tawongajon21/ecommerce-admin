import prismadb from "@/lib/prismadb"
import { SizeFrom } from "./components/size-form"

const SizePage=async({params}:{params:{sizeid:string,storeId:string}})=>{
    console.log(params);
    
   const size= await prismadb.size.findUnique({
    where:{
        id:params.sizeid
    
    }
})

const billboards= await prismadb.billboard.findMany({
    where:{
        storeId:params.storeId
    }
})
  
    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
           <SizeFrom  initialData={size}/>

            </div>
            
        </div>
    )
}

export default SizePage