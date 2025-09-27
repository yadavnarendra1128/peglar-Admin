"use client";

import { useMemo, useState } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSubcategory,
  updateSubcategory,
} from "@/api/services/subcategory.service";
import { useCategories } from "@/hooks/useCategories";
import { useSubcategories } from "@/hooks/useSubcategories";
import showToast from "@/api/lib/showToast";
import DeleteModal from "@/components/Admin/ConfirmDeleteModal/ConfirmDeleteModal";
import { useDeleteModal } from "@/context/DeleteModalContext";

// Define the Category interface locally
// interface Category {
//   id: string;
//   name: string;
// }

type TableRow = {
  subcategoryId: string;
  subcategoryName: string;
  categoryId: string;
  categoryName: string;
  createdAt: string;
};

export default function SubcategoriesPage() {
  const qc = useQueryClient();


  const { item, isOpen, openModal, closeModal } = useDeleteModal()

  // Fetch subcategories
  const {
    data: subcategories = [],
    isLoading: subsLoading,
    isError: subsError,
    error: subsErrObj,
  } = useSubcategories()

  // Fetch categories
  const { data: categories = [],
    isLoading: catsLoading,
    isError: catsError,
    error: catsErrObj, } = useCategories()

  // Local hide state for "delete" action
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());

  // Inline edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  // Mutation for update
  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      updateSubcategory(id, { name }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subcategories"] });
      setEditId(null);
      setEditValue("");
      showToast(true, "name updated successfully")
    },
    onError: () => {
      showToast(false, "fail to update name try again")
    }
  });

  // Category map
  const categoryMap = useMemo(() => {
    const m = new Map<string, string>();
    categories.forEach((c) => m.set(c.id, c.name));
    return m;
  }, [categories]);

  // Table data
  const tableData: TableRow[] = useMemo(() => {
    return subcategories
      .filter((s) => !hiddenIds.has(s.id))
      .map((s) => ({
        subcategoryId: s.id,
        subcategoryName: s.name,
        categoryId: s.categoryId,
        categoryName: categoryMap.get(s.categoryId) ?? "-",
        createdAt: new Date(s.createdAt).toLocaleString(),
      }));
  }, [subcategories, categoryMap, hiddenIds]);

  const columns = useMemo<MRT_ColumnDef<TableRow>[]>(() => {
    return [
      {
        id: "srno",
        header: "Sr. No.",
        size: 70,
        enableSorting: false,
        enableColumnActions: false,
        Cell: ({ row, table }) => {
          const { pageIndex, pageSize } = table.getState().pagination;
          return pageIndex * pageSize + row.index + 1;
        },
      },
      { accessorKey: "categoryName", header: "Category Name", size: 220 },
      {
        accessorKey: "subcategoryName",
        header: "Subcategory Name",
        size: 240,
        Cell: ({ row }) => {
          // If current row is in edit mode → show input
          if (editId === row.original.subcategoryId) {
            return (
              <TextField
                size="small"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
              />
            );
          }
          return row.original.subcategoryName;
        },
      },
      // { accessorKey: "categoryId", header: "Category ID", size: 260 },
      // { accessorKey: "subcategoryId", header: "Subcategory ID", size: 260 },
      // { accessorKey: "createdAt", header: "Created At", size: 200 },
      {
        id: "actions",
        header: "Actions",
        size: 150,
        Cell: ({ row }) => {
          const id = row.original.subcategoryId;
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
                    setEditValue(row.original.subcategoryName);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              )}

              {/* <IconButton
                color="error"
                size="small"
                title="Hide"
                onClick={() => handleHide(row)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton> */}
            </div>
          );
        },
      },
    ];
  }, [editId, editValue, updateMutation.isPending]);

  const handleHide = (row: MRT_Row<TableRow>) => {
    openModal(row.original as any)
    const id = row.original.subcategoryId;
    setHiddenIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };


  const onConfirmDelete = async () => {
    await deleteMutation.mutateAsync(item.id)
  }

  // Mutation for update
  const deleteMutation = useMutation({
    mutationFn: ({ id }: { id: string }) =>
      deleteSubcategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subcategories"] });
      showToast(true, `User ${item.name} deleted successfully`)
    },
    onError: (err) => {
      showToast(false, `Failed to delete user ${item.subcategoryName}. \n ${err}`)
    }
  });






  if (subsLoading || catsLoading) {
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Subcategories" />
        <p className="p-4">Loading…</p>
      </DefaultLayout>
    );
  }

  if (subsError || catsError) {
    const message =
      (subsErrObj as Error)?.message ||
      (catsErrObj as Error)?.message ||
      "Failed to load subcategories or categories.";
    return (
      <DefaultLayout>
        <Breadcrumb pageName="Subcategories" />
        <p className="p-4 text-red-600">{message}</p>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Subcategories" />
      <MaterialReactTable
        columns={[...columns]}
        data={tableData}
        initialState={{ pagination: { pageSize: 5, pageIndex: 0 } }}
        enableColumnResizing
        state={{
          isLoading: subsLoading
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
      <DeleteModal isOpen={isOpen} onConfirm={onConfirmDelete} onCancel={closeModal} deletingQuery='subcategories' deletingField={item?.subcategoryName ?? ''} />
    </DefaultLayout>
  );
}
