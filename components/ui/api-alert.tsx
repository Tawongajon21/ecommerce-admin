"use client"

import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CopyIcon, Server } from "lucide-react";
import { Badge, BadgeProps } from "@/components/ui/badge";
import { Button } from "./button";
import toast from "react-hot-toast";

interface ApiAlertProps{
    title:String;
    description:string;
    variant:"public"| "admin";


}

const textMap:Record<ApiAlertProps["variant"],string>={
    public:"public",
    admin:"Admin"
}

const variantMap:Record<ApiAlertProps["variant"],BadgeProps["variant"]>={
    public:"secondary",
    admin:"destructive"
}


export const ApiAlert:React.FC<ApiAlertProps>=({
    title,
    description,
    variant="public"
})=>{
    const onCopy=()=>{
        navigator.clipboard.writeText(description)
        toast.success("API Route copied to the clipboard")
    }
    return (
        <Alert>
<Server
className="h-4 w-4"
/>
<AlertTitle className="flex items-center gap-x-2">
    {title}
</AlertTitle>
<AlertDescription className="mt-4 flex items-center justify-between">
    <code className="relative round bg-muted px-[0.3rem] font-mono text-sm font-semibold">
{description}
    </code>
    <Button variant="outline" size="icon" onClick={onCopy}>
        <CopyIcon className="h-4 w-4"/>
    </Button>
</AlertDescription>
<Badge variant={variantMap[variant]}>
    {
        textMap[variant]
    }
</Badge>
        </Alert>
    )
}