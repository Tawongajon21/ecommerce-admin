"use client"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Category, Color, Image, Product, Size } from "@prisma/client"

import { Trash } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import axios from "axios"
import { useParams,useRouter  } from "next/navigation"
import { AlertModal } from "@/components/modals/alert-modal"
import { ApiAlert } from "@/components/ui/api-alert"
import { useOrigin } from "@/hooks/use-origin"
import ImageUpload from "@/components/ui/image-upload"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    sizeId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
  });
  type ProductFormValues= z.infer<typeof formSchema>
interface ProductFormProps{
    initialData:Product & {
        images:Image[]
    }|null;
    categories:Category  [],
    colors:Color  [],
    sizes:Size  [],

}



export const ProductForm:React.FC<ProductFormProps>=({initialData,categories,colors,sizes})=>{
    const params= useParams();
    const router=useRouter()
    const [open,setOpen]= useState(false)
const [loading,setLoading]= useState(false)
const title= initialData ? "Edit product": "Create product"
const description= initialData ? "Edit description": "Create description"
const toastMessage= initialData ? "Billboard updated": "Billboard created"
const action= initialData ? "Save changes": "Create"
 

    
      const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues:initialData ? {
            ...initialData,
            price:parseFloat(String(initialData?.price) )
        }: {
            name: '',
            images: [],
            price: 0,
            categoryId: '',
            colorId: '',
            sizeId: '',
            isFeatured: true,
            isArchived: true,
        }
      });


console.log(initialData);

 
const onSubmit=async(data:ProductFormValues)=>{


    
    
   try {
  
    if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productid}`,data)
    }else{
        await axios.post(`/api/${params.storeId}/products`,data)
     
    }

 router.refresh();
 router.push(`/${params.storeId}/products`)
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
  
    
 const response= await axios.delete(`/api/${params.storeId}/products/${params.productid}`);
 if (response.status===200) {
    console.log("hello world");
    router.refresh();
 router.push(`/${params.storeId}/products`)
 toast.success("Product deleted")
 }
console.log(response);

 

   } catch (error) {
    toast.error("Something went wrong.")
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
    name="images"
    render={({field})=>(
        <FormItem>
<FormLabel>
   Images
</FormLabel>
<FormControl>
   <ImageUpload
   value={field.value.map((image)=>image.url)}
   disabled={loading}
   onChange={(url)=>field.onChange([...field.value,{url}])}
   onRemove={(url)=>field.onChange([...field.value.filter((current)=>current.url!==url)])}

   />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />
 

</div>

<div className="grid grid-cols-2 gap-8">
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
    placeholder="Product name"
    {...field}

    />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />
<FormField
    control={form.control}
    name="price"
    render={({field})=>(
        <FormItem>
<FormLabel>
 Price
</FormLabel>
<FormControl>
    <Input 
    disabled={loading}
    placeholder="Product price"
    {...field}

    />
</FormControl>
<FormMessage/>
        </FormItem>
)}
    />


<FormField
    control={form.control}
    name="categoryId"
    render={({field})=>(
        <FormItem>
<FormLabel>
   Category Id
</FormLabel>
<FormControl>
   <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value} >
    <FormControl>
        <SelectTrigger > 
<SelectValue defaultValue={field.value} placeholder="Select category"
/>
        </SelectTrigger>
    </FormControl>
    <SelectContent >
          {
            categories.map((category)=>(
              <SelectItem key={category.id} value={category.id}>
                {category.name}
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
<FormField
    control={form.control}
    name="sizeId"
    render={({field})=>(
        <FormItem>
<FormLabel>
   Size Id
</FormLabel>
<FormControl>
   <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value} >
    <FormControl>
        <SelectTrigger > 
<SelectValue defaultValue={field.value} placeholder="Select size"
/>
        </SelectTrigger>
    </FormControl>
    <SelectContent >
          {
           sizes.map((size)=>(
              <SelectItem key={size.id} value={size.id}>
                {size.name}
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
<FormField
    control={form.control}
    name="colorId"
    render={({field})=>(
        <FormItem>
<FormLabel>
   Color Id
</FormLabel>
<FormControl>
   <Select disabled={loading} onValueChange={field.onChange} defaultValue={field.value} >
    <FormControl>
        <SelectTrigger > 
<SelectValue defaultValue={field.value} placeholder="Select color"
/>
        </SelectTrigger>
    </FormControl>
    <SelectContent >
          {
            colors.length === 0 ? "You have no colors in your store ":
           colors.map((color)=>(
              <SelectItem key={color.id} value={color.id}>
                {color.name}
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

<FormField
    control={form.control}
    name="isArchived"
    render={({field})=>(
        <FormItem className="flex flex-row items-start border p-4 space-y-0 rounded-md  space-x-3">
<FormLabel>
Is Archived
</FormLabel>
<FormControl>
   <Checkbox
   checked={field.value}
   //@ts-ignore
   onCheckedChange={field.onChange}

   />
</FormControl>
<br />
<div className="space-y-1 leading-none">
<FormDescription>
    This product will not  appear anywhere in   the home page
</FormDescription>
</div>
<FormMessage/>
        </FormItem>
)}
    />
    <FormField
    control={form.control}
    name="isFeatured"
    render={({field})=>(
        <FormItem className="flex flex-row items-start border p-4 space-y-0 rounded-md  space-x-3">
<FormLabel>
Is Featured
</FormLabel>
<FormControl>
   <Checkbox
   checked={field.value}
   //@ts-ignore
   onCheckedChange={field.onChange}

   />
</FormControl>
<div className="space-y-1 leading-none">
<FormDescription>
    This product will appear on the home page
</FormDescription>
</div>
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