"use client"
import * as z from "zod"
import { useStoreModal } from "@/hooks/use-store-modal"
import { Modal } from "@/components/ui/modal"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import axios from "axios"
import prismadb from "@/lib/prismadb"
import {toast} from "react-hot-toast"
import { redirect } from "next/navigation"


const formSchema= z.object({
    name:z.string().min(1),

})
export const StoreModal=()=>{
    const storeModal= useStoreModal();
  
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
const form=useForm<z.infer<typeof formSchema>>({
    resolver:zodResolver(formSchema),
    defaultValues: {
        name:""
    },
})
const onSubmit=async(values:z.infer<typeof formSchema>)=>{
    //todo create store
    console.log(values);
    try {
        setLoading(true);
        toast.loading("Loading please wait")
        const {status,data,statusText}= await axios.post("/api/stores",values)
        
       if (status === 200 && statusText ==="OK") {
        setLoading(false)
        setSuccess(true)
    window.location.assign(`/${data.id}`)
       }
        
    } catch (error) {
        toast.error("Something went wrong")
        
    }finally{
        setLoading(false)
    }
    
}



   return( <Modal
    title="Create store"
    description="Add a new store to manage products and categgories"
    isOpen={storeModal.isOpen}
    onClose={storeModal.onClose}
    >
        <div className="">
        <div className="space-y-4 py-2 pb-4">
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)}>
<FormField control={form.control} name='name' 
render={({field})=>(
<FormItem>
    <FormLabel>
        Name
    </FormLabel>
    <FormControl>
        <Input
        disabled={loading}
        {...field}
        placeholder="E- Commerce"/>
    </FormControl>
    <FormMessage/>
</FormItem>
   )}
/>
<div className="pt-6 space-x-2 flex items-center justify-end w-full">
    <Button
    disabled={loading}
    onClick={storeModal.onClose} variant="outline">
Cancel
    </Button>
    <Button   disabled={loading} type="submit">
Continue
    </Button>
</div>


</form>
</Form>
</div>
        </div>
        
    </Modal>
   )
}