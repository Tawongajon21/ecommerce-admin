"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SizeColumn = {
  id: string
  name:string
  createdAt:string
value:string
}


export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name", 
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date ",
  },
  {
    accessorKey: "value",
    header: "Value",
    cell:({row})=>row.original.name
  },
  {
    id:"actions",
    cell:({row})=><CellAction data={row.original}/>

  }
]
