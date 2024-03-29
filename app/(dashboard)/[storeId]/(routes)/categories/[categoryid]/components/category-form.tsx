"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import {  Billboard, Category } from "@prisma/client"
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


interface CategoryFormProps{
    initialData:Category|null
    billboards:Billboard[]
}
const formSchema = z.object({
    name:z.string().min(1),
    billboardId:z.string().min(1)
});
type CategoryFormValues= z.infer<typeof formSchema>
export const CategoryFrom:React.FC<CategoryFormProps>=({initialData,billboards})=>{
const form = useForm<CategoryFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData||{
        name:"",
        billboardId:""
    }
})
const [open,setOpen]= useState(false)
const [loading,setLoading]= useState(false)
const title= initialData ? "Edit category": "Create category"
const description= initialData ? "Edit category": "Create category"
const toastMessage= initialData ? "Category updated": "Category created"
const action= initialData ? "Save changes": "Create"
    const params= useParams();
    const router=useRouter()
 
const onSubmit=async(data:CategoryFormValues)=>{
   try {
    setLoading(true)
    if (initialData) {
        await axios.patch(`/api/${params.storeId}/categories/${params.categoryid}`,data)
    }else{
        await axios.post(`/api/${params.storeId}/categories`,data)
     
    }

 router.refresh();
 router.push(`/${params.storeId}/categories`)
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
  
    
 const response= await axios.delete(`/api/${params.storeId}/category/${params.categoryid}`);
 if (response.status===200) {
    console.log("hello world");
    router.refresh();
 router.push(`/${params.storeId}/category`)
 toast.success("Category deleted")
 }
console.log(response);

 

   } catch (error) {
    toast.error("Make sure you removed all products  using this category first.")
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
    placeholder="Category name"
    {...field}

    />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />

    
</div>
<div className="grid grid-cols-3 gap-8">
    <FormField
    control={form.control}
    name="billboardId"
    render={({field})=>(
        <FormItem>
<FormLabel>
   Billboard Id
</FormLabel>
<FormControl>
   <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value} >
    <FormControl>
        <SelectTrigger > 
<SelectValue defaultValue={field.value} placeholder="Select a billboard"
/>
        </SelectTrigger>
    </FormControl>
    <SelectContent >
          {
            billboards.map((billboard)=>(
              <SelectItem key={billboard.id} value={billboard.id}>
                {billboard.label}
              </SelectItem>
              )  )
          }
    </SelectContent>
   </Select>
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