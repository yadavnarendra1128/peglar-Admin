'use client'
import { useSearchParams } from 'next/navigation'
import React, { Suspense, useEffect, useMemo, useState } from 'react'
import { getVariantsByProductId } from '@/api/services/base.service'
import showToast from '@/api/lib/showToast'
import DefaultLayout from '@/components/Admin/Layouts/DefaultLaout'
import Breadcrumb from '@/components/Admin/Breadcrumbs/Breadcrumb'
import InputGroup from '@/components/Admin/FormElements/InputGroup'
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import { Box,Typography } from '@mui/material'
import { handleProductVariants, VariantType } from '../../../../api/services/product.service'

export default function page() {

  return (
    <Suspense fallback={<></>}>
        <VariantComponent/>
    </Suspense>
  )
}

type errorDataType = {
  size: string;
  finish: string;
  color: string;
  price: string;
  stock: string;
};

const VariantComponent = ()=>{
    const params = useSearchParams()
    const productId = params.get('id')
    const [variants,setVariants]=useState<VariantType[]>([])
    const [updatingEntry,setUpdatingEntry]=useState<number | null>(null)
    const [submitting,setSubmitting]=useState<boolean>(false)
    const [loading,setLoading]=useState<boolean>(true)
    const [localError,setLocalError]=useState<string>('')
    const [variantsUpdated,setVariantsUpdated]=useState<boolean>(false)

    const [errors, setErrors] = useState<errorDataType>({
      size: "",
      finish: "",
      color: "",
      price: "",
      stock: "",
    });

    const [formData, setFormData] = useState<VariantType>(
      {
        id:"",
        size: "",
        finish: "",
        color: "",
        price: "",
        stock: 1,
      });

    const handleChange=(field:string,value:string | number)=>{
        setFormData((p)=>({...p, [field] : value}))
    }  

    const isValid = ()=>{
        const newErrors: errorDataType = {
          size: "",
          finish: "",
          color: "",
          price: "",
          stock: "",
        };

        if (!formData.size.trim()) {
          newErrors.size = "Size is required";
        }

        if (!formData.finish.trim()) {
          newErrors.finish = "Finish is required";
        }

        if (!formData.color.trim()) {
          newErrors.color = "Color is required";
        }

        if (!formData.price.trim()) {
          newErrors.price = "Price is required";
        } else if (
          isNaN(Number(formData.price)) ||
          Number(formData.price) <= 0
        ) {
          newErrors.price = "Enter a valid price";
        }

        if (formData.stock < 1) {
          newErrors.stock = "Stock must be at least 1";
        }

        setErrors(newErrors);

        return Object.values(newErrors).every((v) => v === "");
    }

    const handleAdd = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        const valid = isValid()

        if(valid){
          if(!variantsUpdated){setVariantsUpdated(true)}
          if(updatingEntry==null){setVariants(p=>[...p,{
            id: formData.id,
            size: formData.size,
            finish: formData.finish,
            color: formData.color,
            price: formData.price,
            stock: formData.stock,
          }]);}
          else{
            const variant = variants.find((v,i)=>i==updatingEntry)
            if(variant){
              setVariants((prev)=>{
                return prev.map((e,i) =>
                  i == updatingEntry
                    ? {
                        id: formData.id,
                        size: formData.size,
                        finish: formData.finish,
                        color: formData.color,
                        price: formData.price,
                        stock: formData.stock,
                      }
                    : e
                );
              })
              setUpdatingEntry(null)
            }else{
              setLocalError('Variant not found.')
              setUpdatingEntry(null)
            }
          }
          setFormData({
            id:"",
            size: "",
            finish: "",
            color: "",
            price: "",
            stock: 1,
          })
        }else{
          showToast(false,'Check errors above.')
        }
    };

    const handleEdit = (row: MRT_Row<VariantType>,index:number)=>{
      const v = row.original
        setFormData({
          id: v.id,
          size: v.size,
          finish: v.finish,
          color: v.color,
          price: v.price,
          stock: v.stock,
        });
        setUpdatingEntry(index)
    }

    const handleDelete = (row: MRT_Row<VariantType>,index:number) => {
      if(!variantsUpdated){setVariantsUpdated(true)}
      setVariants((prev)=>prev.filter((v,i)=>i!==index))
    };

    const handleVariantsApi = async()=>{
      try{
        setSubmitting(true)
        await handleProductVariants(productId ?? '',variants)
        showToast(true,'Success.')
      }catch(err){
        showToast(false,'Error handling variants: ',err)
      }finally{
        setSubmitting(false)
      }
    }

    const handleSubmit=(e:any)=>{
      e.preventDefault();
      if(variants.length!==0){
        if(productId && variantsUpdated){
          handleVariantsApi()
        }else if(!variantsUpdated){
          showToast(false,'No changes found in variants.')
        }else{
          showToast(false,'Product not found.')
        }
      }else{
        showToast(false,"Variants not found.")
      }
    }

    useEffect(()=>{
        const getVariantsforProduct = async()=>{
            if(!productId)return;
            try {
                setLoading(true)
                const res = await getVariantsByProductId(productId)
                setVariants(res)
            } catch (err:any) {
                showToast(false,err)
            }finally{
                setLoading(false)
            }
        }
        if(productId)getVariantsforProduct()
    },[productId])

    const columns = useMemo<MRT_ColumnDef<VariantType>[]>(
       () => [
         {
           header: "Sr. No.",
           size: 140,
           Cell: ({ row }) => row.index + 1,
         },
         { accessorKey: "price", header: "price", size: 140 },
         { accessorKey: "stock", header: "stock", size: 140 },
         { accessorKey: "size", header: "size", size: 140 },
         { accessorKey: "finish", header: "finish", size: 140 },
         { accessorKey: "color", header: "color", size: 140 },
         {
           id: "actions",
           header: "Actions",
           size: 200,
           Cell: ({ row }) => (
             <div
               style={{
                 display: "flex",
                 gap: "0.5rem",
                 justifyContent: "center",
               }}
             >
               {/* View Action */}
               <button
                 onClick={() => handleEdit(row,row.index)}
                 title="Edit Variant"
                 style={{
                   background: "#4F9DFF",
                   color: "white",
                   padding: "4px 8px",
                   borderRadius: "4px",
                   border: "none",
                   cursor: "pointer",
                 }}
               >
                 Edit
               </button>
               <button
                 onClick={() => handleDelete(row,row.index)}
                 title="Delete Variant"
                 style={{
                   background: "#ff4d4d",
                   color: "white",
                   padding: "4px 8px",
                   borderRadius: "4px",
                   border: "none",
                   cursor: "pointer",
                 }}
               >
                 Delete
               </button>
             </div>
           ),
         },
       ],
       []
     );
    
    const renderContent = () => {
        if ((!variants.length) && (!loading)) {
          return (
        <Box
          sx={{
            p: 2,
            textAlign: "center",
            border: "1px solid #ccc",  // light gray border
            borderRadius: 2,           // rounded corners
            backgroundColor: "#f9f9f9" // light background
          }}
        >
          <Typography>No variants found.</Typography>
        </Box>
          );
        }
        return (
          <MaterialReactTable
            columns={columns}
            data={variants}
            initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
            enableColumnResizing
            muiTableProps={{ sx: { border: "1px solid #ccc" } }}
            muiTableHeadCellProps={{
              sx: {
                backgroundColor: "#f5f5f5",
                fontWeight: "bold",
                borderBottom: "2px solid #ccc",
              },
            }}
            muiTableBodyCellProps={{ sx: { borderBottom: "1px solid #e0e0e0" } }}
            muiTableBodyRowProps={({ row }) => ({
              sx: {
                backgroundColor: row.index % 2 === 0 ? "#fafafa" : "white",
                "&:hover": { backgroundColor: "#f0f0f0" },
              },
            })}
            state={{
              isLoading:loading
            }}
            muiSkeletonProps={{
              animation: "wave",
    
            }}
            muiCircularProgressProps={{
              style: {
                color: "#4F033D"
              }
            }}
          />
        );
      };

    return (
      <DefaultLayout>
        {/* Page header navigation */}
        <Breadcrumb pageName="Add Variant" />

        <div className="mx-auto">
        {renderContent()}
        </div>

        <form onSubmit={handleSubmit} className="w-full mx-auto mt-4">
          <div className="w-full gap-9">
            {/* Form Card */}
            <div className="col-span-2 md:col-span-1">
              <div className="rounded-[10px] border border-stroke bg-white shadow-md dark:border-dark-3 dark:bg-gray-dark">
                <div className="border-b border-stroke px-6.5 py-4 dark:border-dark-3">
                  <h3 className="font-semibold text-dark dark:text-white">
                    Variant Information
                  </h3>
                </div>

                <div className="p-6.5">
                  <InputGroup
                    label="Size"
                    type="text"
                    placeholder="Enter Size"
                    value={formData.size}
                    onChange={(value) => handleChange("size", value)}
                    required
                    customClasses="mb-4.5"
                  />

                  <InputGroup
                    label="Finish"
                    type="string"
                    placeholder="Enter Finish"
                    value={formData.finish}
                    onChange={(value) =>
                      handleChange("finish", value)
                    }
                    customClasses="mb-4.5"
                  />

                  <InputGroup
                    label="Color"
                    type="text"
                    placeholder="Enter Color"
                    value={formData.color}
                    onChange={(value) => handleChange("color", value)}
                    required
                    customClasses="mb-4.5"
                  />

                  <InputGroup
                    label="Price"
                    type="text"
                    placeholder="Enter Price"
                    value={formData.price}
                    onChange={(value) => handleChange("price", value)}
                    required
                    customClasses="mb-4.5"
                  />

                  <InputGroup
                    label="Stock"
                    type="number"
                    placeholder="Enter Stock Count"
                    value={formData.stock}
                    onChange={(value) =>
                      handleChange("stock", Number(value))
                    }
                    customClasses="mb-4.5"
                  />
                </div>
              
               
                <button className="mx-6 mb-6 w-fit rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 transition hover:bg-hoverPrimary hover:cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
                type="button" onClick={(e)=>handleAdd(e)}>
                  {updatingEntry!==null ? 'Update Variant' : 'Add Variant'}
                </button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || variants.length==0}
            className="mt-6 w-full rounded-[7px] bg-primary p-[13px] font-medium text-white hover:bg-opacity-90 transition hover:bg-hoverPrimary hover:cursor-pointer disabled:bg-primary/50 disabled:cursor-not-allowed"
          >
            Submit          
          </button>
        </form>
      </DefaultLayout>
    );
}
