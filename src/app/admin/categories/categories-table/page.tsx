"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import TextField from "@mui/material/TextField";
import { useCategories } from "@/hooks/useCategories";
import showToast from "@/api/lib/showToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import { useDeleteModal } from "@/context/DeleteModalContext";
import { handleUpdate } from "@/api/services/category.service";

// Updated type definition for the category data
type Category = {
  id: string; // Assuming 'id' is a string for a UUID
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default function GuruTable() {
  // Use React Query to fetch data from the API
  const { data, isLoading, isError } = useCategories()

  // Local state to manage the data displayed in the table for local updates/deletions.
  // We initialize it with the data from the API once it's loaded.
  const [localData, setLocalData] = useState<Category[]>([]);
  useEffect(() => {
    if (data) {
      setLocalData(data);
    }
  }, [data]);

  // Function to handle local deletion of a category
  // This removes the item from the local state but does not call the database.
  const handleDelete = useCallback((row: MRT_Row<Category>) => {
    console.log("Locally deleting category:", row.original.id);
    // Update the local state by filtering out the deleted row
    openModal(row.original as any)
    setLocalData((prevData) =>
      prevData.filter((category) => category.id !== row.original.id)
    );

  }, []);

  // // Function to handle updates, including the API call
  // const handleUpdate = useCallback() => {
  //   // const newName = prompt("Enter the new category name:", row.original.name);
  //   // if (newName !== null && newName.trim() !== "") {
  //   //   try {
  //   //     // Make the API call to update the category
  //   //     const response = await fetch(`/categories/${row.original.id}`, {
  //   //       method: "PUT", // Use PUT for a full replacement or PATCH for a partial update
  //   //       headers: {
  //   //         "Content-Type": "application/json",
  //   //       },
  //   //       body: JSON.stringify({ name: newName }),
  //   //     });

  //   //     if (!response.ok) {
  //   //       throw new Error("Failed to update category.");
  //   //     }

  //   //     // If the API call is successful, update the local state with the new name
  //   //     setLocalData((prevData) =>
  //   //       prevData.map((category) =>
  //   //         category.id === row.original.id
  //   //           ? {
  //   //             ...category,
  //   //             name: newName,
  //   //             updatedAt: new Date().toISOString(),
  //   //           } // Optionally update `updatedAt`
  //   //           : category
  //   //       )
  //   //     );

  //   //     showToast(true, "name updated successfully")
  //   //   } catch (error) {
  //   //     console.error("Error updating category:", error);
  //   //     showToast(false, "updating process fail try again later")
  //   //   }
  //   // }
  // }, []);


  // Inline edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const qc = useQueryClient()
  // Mutation for update
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      handleUpdate(id, name),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: ["subcategories"] });
      setEditId(null);
      setEditValue("");
      console.log("DATAAAAAAAAAA", data)
      setLocalData((prevData) =>
        prevData.map((category) =>
          category.id === variables.id
            ? {
              ...category,
              name: data["name"],
              updatedAt: data["updatedAt"],
            } // Optionally update `updatedAt`
            : category
        )
      );
      showToast(true, "name updated successfully")
    },
    onError: (error) => {
      console.error('Update failed:', error)
      showToast(false, "failed to update error")
    },
  });
  const { item, isOpen, openModal, closeModal } = useDeleteModal()

  const onConfirmDelete = async () => {
    try {
      // await deleteUser(item.id)
      // setUsers((p)=>{const val = p ? p?.filter((e)=>e.id.toString()!==item.id) : []
      // if(!val)return []
      // else return val
      // })

      showToast(true, `User ${item.name} deleted successfully`)
    } catch (err) {
      showToast(false, `Failed to delete user ${item.name}. \n        ${err}`);
    }
  }








  const columns = useMemo<MRT_ColumnDef<Category>[]>(
    () => [
      {
        header: "Sr. No.",
        accessorKey: "srNo",
        size: 50,
        Cell: ({ row }) => row.index + 1,
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorKey: "id",
        header: "Category ID",
        size: 200,
        Cell: ({ cell }) => {
          const fullId = cell.getValue<string>();
          const shortId = fullId ? `${fullId.slice(0, 5)}...` : "-";
          const handleCopy = () => {
            if (fullId) {
              navigator.clipboard
                .writeText(fullId)
                .then(() => alert(`Copied Category ID: ${fullId}`))
                .catch((err) => console.error("Failed to copy text: ", err));
            }
          };
          return (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span>{shortId}</span>
              <IconButton size="small" onClick={handleCopy} disabled={!fullId}>
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            </div>
          );
        },
      },
      {
        accessorKey: "CategoryName",
        header: "Category Name",
        size: 240,
        Cell: ({ row }) => {
          // If current row is in edit mode → show input
          console.log("DDDDDDD0", editId === row.original.id)
          if (editId === row.original.id) {
            return (
              <TextField
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  const id = row.original.id;
                  if (e.key === 'Enter') {
                    updateMutation.mutate({ id, name: editValue })
                  }
                }}
              />
            );
          }
          return row.original.name;
        },
      },
      // {
      //   accessorKey: "createdAt",
      //   header: "Created At",
      //   size: 150,
      //   Cell: ({ cell }) =>
      //     cell.getValue<string>()
      //       ? new Date(cell.getValue<string>()).toLocaleString()
      //       : "-",
      // },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 200,
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleString()
            : "-",
      },
      {
        id: "actions",
        header: "Actions",
        size: 200,
        Cell: ({ row }) => {
          const id = row.original.id;
          const isEditing = editId === id;
          return (
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {isEditing ? (
                <>
                  <IconButton
                    color="success"
                    size="small"
                    title="Save"
                    onClick={() =>
                      updateMutation.mutate({ id, name: editValue })
                    }
                  >
                    <CheckIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    color="info"
                    size="small"
                    title="Cancel"
                    onClick={() => {
                      setEditId(null);
                      setEditValue("");
                    }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </>
              ) : (
                <IconButton
                  color="primary"
                  size="small"
                  title="Edit"
                  onClick={() => {
                    setEditId(id);
                    setEditValue(row.original.name);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}

              {/* <IconButton
                color="error"
                size="small"
                title="Hide"
                onClick={() => handleDelete(row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton> */}
            </div>
          );
        },
      },
    ],
    [handleUpdate, handleDelete, editId, editValue, updateMutation.isPending]
  );

  const renderContent = () => {
    if (isError) {
      return (
        <Typography color="error" sx={{ p: 2, textAlign: "center" }}>
          Failed to load categories.
        </Typography>
      );
    }
    if ((!localData.length) && (!isLoading)) {
      return (
        <Typography sx={{ p: 2, textAlign: "center" }}>
          No categories found.
        </Typography>
      );
    }
    return (
      <MaterialReactTable
        columns={columns}
        data={localData}
        initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
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
          isLoading: isLoading
        }}
        muiSkeletonProps={{
          animation: "wave",

        }}
        muiCircularProgressProps={{
          style: {
            color: "#4F033D"
          }
        }}
        enableColumnResizing
      />
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category Table" />
      {renderContent()}
      <DeleteModal isOpen={isOpen} onConfirm={onConfirmDelete} onCancel={closeModal} deletingQuery='categories' deletingField={item?.name ?? ''} />
    </DefaultLayout>
  );
}
