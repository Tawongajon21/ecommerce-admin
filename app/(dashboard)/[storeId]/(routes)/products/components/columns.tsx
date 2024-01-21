"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import {string} from "zod"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string
  name:string
  size:string
  price :string
  category:string
  color:string
  isFeatured :boolean
  isArchived:boolean
  createdAt:string
 
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell:({row})=>(
      <div className="flex items-center gap-x-2">
{row.original.color}
<div  className="h-6 w-6 rounded-full border" style={{backgroundColor:row.original.color}}/>


      </div>
    )
  },
  {
    accessorKey:"isArchived",
    header:"Archived"
  },
  {
    accessorKey:"isFeatured",
    header:"Featured"
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id:"actions",
    cell:({row})=><CellAction data={row.original}/>

  }
]
