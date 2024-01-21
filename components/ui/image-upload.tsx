
"use client"

import { useEffect, useState } from "react";
import { Button } from "./button";
import { ImagePlus, ImagePlusIcon, Trash } from "lucide-react";
import Image from "next/image";
import {CldUploadWidget} from "next-cloudinary"

interface ImageUploadProps{
    disabled? : boolean;
    onChange:(value:string)=>void;
    onRemove:(value:string)=>void;
    value:string[]
}
const ImageUpload:React.FC<ImageUploadProps>=({disabled,
    onChange,
    onRemove,
    value
})=>{
    const [isMounted, setIsMounted] = useState(false);
    const onUpload=(result:any)=>{
        onChange(result.info.secure_url)
    }
    useEffect(() => {
    setIsMounted(true)
    
      
    }, [])
    if (!isMounted) {
        return null
    }

 
    return  (
        <div>
 <div className="mb-4 flex items-center gap-4">
{
    value.map((url)=>{
    return    <div className="relative w-[200px] rounded-md overflow-hidden  h-[200px]" key={url}>
<div className="z-10 absolute top-2 right-2">
<Button type="button" variant="destructive" size="icon" onClick={()=>onRemove(url)}>
    <Trash className="h-4 w-4"/>
</Button>
</div>
<Image fill className="object-cover" alt="image" src={url}/>


        </div>
    })
}
</div>
<CldUploadWidget onUpload={onUpload} uploadPreset="de2bwwya">
{
    ({open})=>{
        const onClick =()=>{
            open()
        }
        return (
            <Button disabled={disabled} variant="secondary" type="button" onClick={onClick} >
                <ImagePlusIcon className="h-4 w-4 mr-2"/>
                Upload an Image
            </Button>
        )
    }
}
</CldUploadWidget>
        </div>
       
    )
}

export default ImageUpload