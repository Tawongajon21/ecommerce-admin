import prismadb from "@/lib/prismadb"
import { CategoryFrom } from "./components/category-form"

const CategoryPage=async({params}:{params:{categoryid:string,storeId:string}})=>{
    console.log(params);
    
   const category= await prismadb.category.findUnique({
    where:{
        id:params.categoryid
    
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
           <CategoryFrom billboards={billboards} initialData={category}/>

            </div>
            
        </div>
    )
}

export default CategoryPage