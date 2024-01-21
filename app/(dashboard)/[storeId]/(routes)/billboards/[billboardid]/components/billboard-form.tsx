"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Billboard } from "@prisma/client"
import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams,useRouter  } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"


interface BillboardFormProps{
    initialData:Billboard|null
}
const formSchema = z.object({
    label:z.string().min(1),
    imageUrl:z.string().min(1)
});
type BillboardFormValues= z.infer<typeof formSchema>
export const BillboardForm:React.FC<BillboardFormProps>=({initialData})=>{
const form = useForm<BillboardFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData||{
        label:"",
        imageUrl:""
    }
})
const [open,setOpen]= useState(false)
const [loading,setLoading]= useState(false)
const title= initialData ? "Edit billboard": "Create billboard"
const description= initialData ? "Edit description": "Create description"
const toastMessage= initialData ? "Billboard updated": "Billboard created"
const action= initialData ? "Save changes": "Create"
    const params= useParams();
    const router=useRouter()
 
const onSubmit=async(data:BillboardFormValues)=>{
   try {
    setLoading(true)
    if (initialData) {
        await axios.patch(`/api/${params.storeId}/billboards/${params.billboardid}`,data)
    }else{
        await axios.post(`/api/${params.storeId}/billboards`,data)
     
    }

 router.refresh();
 router.push(`/${params.storeId}/billboards`)
 router.refresh();
 toast.success(toastMessage)

   } catch (error) {
    toast.error("Something went wrong")
   } finally{
    setLoading(false)
   }
    
}
const onDelete=async()=>{
   try {
    setLoading(true)
  console.log(params);
  
    
 const response= await axios.delete(`/api/${params.storeId}/billboards/${params.billboardid}`);
 if (response.status===200) {
    console.log("hello world");
    router.refresh();
 router.push(`/${params.storeId}/billboards`)
 toast.success("Billboard deleted")
 }
console.log(response);

 

   } catch (error) {
    toast.error("Make sure you removed all categores using this billboard first.")
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
     <div className="flex items-center justify-between">
<Heading 
title={title}
description={description}
/>
<Button
 variant="destructive"
  size="icon"
  onClick={()=>setOpen(true)}
  disabled={loading}
  >
<Trash className="h-4 w-4"/>
</Button>

    </div>
    <Separator/>
<Form {...form}>
<form className="space-y-8 w-full" onSubmit={form.handleSubmit(onSubmit)}>
<FormField
    control={form.control}
    name="imageUrl"
    render={({field})=>(
        <FormItem>
<FormLabel>
    Background Image
</FormLabel>
<FormControl>
   <ImageUpload
   value={field.value? [field.value]: []}
   disabled={loading}
   onChange={(url)=>field.onChange(url)}
   onRemove={()=>field.onChange("")}

   />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />
<div className="grid grid-cols-3 gap-8">
    <FormField
    control={form.control}
    name="label"
    render={({field})=>(
        <FormItem>
<FormLabel>
    Label
</FormLabel>
<FormControl>
    <Input 
    disabled={loading}
    placeholder="Billboard label"
    {...field}

    />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />

    
</div>
<Button disabled={loading} type="submit">
    {action}
</Button>
</form>

</Form>
<Separator/>

    </>
   
)
}