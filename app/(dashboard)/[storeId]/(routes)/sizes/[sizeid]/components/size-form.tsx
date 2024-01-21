"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {  Billboard, Category, Size } from "@prisma/client"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


interface SizeFormProps{
    initialData:Size|null
   
}
const formSchema = z.object({
    name:z.string().min(1),
    value:z.string().min(1)
});
type SizeFormValues= z.infer<typeof formSchema>
export const SizeFrom:React.FC<SizeFormProps>=({initialData})=>{
const form = useForm<SizeFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData||{
        name:"",
    value:""
    }
})
const [open,setOpen]= useState(false)
const [loading,setLoading]= useState(false)
const title= initialData ? "Edit size ": "Create size"
const description= initialData ? "Edit size": "Create size"
const toastMessage= initialData ? "Size updated": "Size created"
const action= initialData ? "Save changes": "Create"
    const params= useParams();
    const router=useRouter()
 
const onSubmit=async(data:SizeFormValues)=>{
   try {
    setLoading(true)
    if (initialData) {
        await axios.patch(`/api/${params.storeId}/sizes/${params.sizeid}`,data)
    }else{
        await axios.post(`/api/${params.storeId}/sizes`,data)
     
    }

 router.refresh();
 router.push(`/${params.storeId}/sizes`)
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
  
    
 const response= await axios.delete(`/api/${params.storeId}/size/${params.sizeid}`);
 if (response.status===200) {
    console.log("hello world");
    router.refresh();
 router.push(`/${params.storeId}/sizes`)
 toast.success("Size deleted")
 }
console.log(response);

 

   } catch (error) {
    toast.error("Make sure you removed all products  using this size first.")
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

<div className="grid grid-cols-3 gap-8">
    <FormField
    control={form.control}
    name="name"
    render={({field})=>(
        <FormItem>
<FormLabel>
    Name
</FormLabel>
<FormControl>
    <Input 
    disabled={loading}
    placeholder="Size name"
    {...field}

    />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />
    <FormField
    control={form.control}
    name="value"
    render={({field})=>(
        <FormItem>
<FormLabel>
    Value
</FormLabel>
<FormControl>
    <Input 
    disabled={loading}
    placeholder="Size value"
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