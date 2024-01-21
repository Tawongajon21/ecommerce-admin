import prismadb from "@/lib/prismadb"
import { ColorFrom } from "./components/color-form"

const ColorPage=async({params}:{params:{colorid:string,storeId:string}})=>{
    console.log(params);
    
   const color= await prismadb.color.findUnique({
    where:{
        id:params.colorid
    
    }
})


  
    return (

        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
           <ColorFrom  initialData={color}/>

            </div>
            
        </div>
    )
}

export default ColorPage