"use client"


import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel } from "@/components/ui/dropdown-menu"
import { CategoryColumn } from "./columns"
import { DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu"
import { Button } from "@/components/ui/button"
import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react"
import toast from "react-hot-toast"
import { useRouter ,useParams} from "next/navigation"
import axios from "axios"
import { useState } from "react"
import { AlertModal } from "@/components/modals/alert-modal"

interface CellActionProps{
    data:CategoryColumn
}
export const CellAction:React.FC<CellActionProps>=({data})=>{
 const router= useRouter();
    const onCopy=(id:string)=>{
        navigator.clipboard.writeText(id)
        toast.success("Category  id copied to the clipboard")
    }
 
    const params= useParams()
    const [loading,setLoading]= useState(false)
    const [open,setOpen]= useState(false)
    const onDelete=async()=>{
        try {
         setLoading(true)
      await axios.delete(`/api/${params.storeId}/categories/${data.id}`)
      router.refresh();

      toast.success("Category deleted")
     
        } catch (error) {
         toast.error("Make sure you removed all categores using this billboard first.")
         console.log(error);
         
        } finally{
         setLoading(false)
         setOpen(false)
        }
         
     }
    return (
        <>
        <AlertModal
        isOpen={open}
        onClose={()=>setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
        />
         <DropdownMenu>
<DropdownMenuTrigger asChild>
    <Button className="h-8 w-8 p-0" variant="ghost">
    <span className="sr-only">
Open menu
    </span>
    <MoreHorizontal className="h-4 w-4"/>
    </Button>
</DropdownMenuTrigger>
<DropdownMenuContent align="end">
    <DropdownMenuLabel>
      Actions
    </DropdownMenuLabel>
    <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/categories/${data.id}`)}>
        <Edit className="mr-2 h-4 w-4"/>
        Update
    </DropdownMenuItem>
    <DropdownMenuItem onClick={()=>onCopy(data.id)}>
        <Copy className="mr-2 h-4 w-4"/>
       Copy Id
    </DropdownMenuItem>
    <DropdownMenuItem onClick={()=>setOpen(true)}>
        <Trash className="mr-2 h-4 w-4"/>
     Delete
    </DropdownMenuItem>
</DropdownMenuContent>
        </DropdownMenu>
        </>
       
    )
}