import { apiClient } from "../lib/apiClient"

  export const handleUpdate = async (id: string, name: string) => {
    const res = await apiClient.put("/categories/" + id, { name })
    return res.data.data

  }
  export const createCategory=async (payload:string)=>{
    const res=await apiClient.post("/categories",{name:payload})
    return res.data
  }