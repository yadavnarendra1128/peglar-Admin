"use client";

import { useMemo, useCallback, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
} from "material-react-table";
import DefaultLayout from "@/components/Admin/Layouts/DefaultLaout";
import Breadcrumb from "@/components/Admin/Breadcrumbs/Breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { CircularProgress, Typography, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { fetchCategory } from "../../../../../api/services/base.service";

// Updated type definition for the category data
type Category = {
  id: string; // Assuming 'id' is a string for a UUID
  name: string;
  createdAt: string;
  updatedAt: string;
};

export default function GuruTable() {
  // Use React Query to fetch data from the API
  const { data, isLoading, isError } = useQuery<{ data: Category[] }, unknown, Category[]>({
    queryKey: ["categoriesData"],
    queryFn: fetchCategory,
  });
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
    setLocalData((prevData) =>
      prevData.filter((category) => category.id !== row.original.id)
    );
  }, []);

  // Function to handle updates, including the API call
  const handleUpdate = useCallback(async (row: MRT_Row<Category>) => {
    const newName = prompt("Enter the new category name:", row.original.name);
    if (newName !== null && newName.trim() !== "") {
      try {
        // Make the API call to update the category
        const response = await fetch(`/categories/${row.original.id}`, {
          method: "PUT", // Use PUT for a full replacement or PATCH for a partial update
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newName }),
        });

        if (!response.ok) {
          throw new Error("Failed to update category.");
        }

        // If the API call is successful, update the local state with the new name
        setLocalData((prevData) =>
          prevData.map((category) =>
            category.id === row.original.id
              ? {
                ...category,
                name: newName,
                updatedAt: new Date().toISOString(),
              } // Optionally update `updatedAt`
              : category
          )
        );

        alert("Category updated successfully!");
      } catch (error) {
        console.error("Error updating category:", error);
        alert("Failed to update category. Please try again.");
      }
    }
  }, []);

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
        size: 140,
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
      { accessorKey: "name", header: "Category Name", size: 150 },
      {
        accessorKey: "createdAt",
        header: "Created At",
        size: 150,
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleString()
            : "-",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        size: 150,
        Cell: ({ cell }) =>
          cell.getValue<string>()
            ? new Date(cell.getValue<string>()).toLocaleString()
            : "-",
      },
      {
        id: "actions",
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <div style={{ display: "flex", gap: "1.5rem" }}>
            <IconButton onClick={() => handleUpdate(row)}>
              <EditIcon style={{ color: "#6b7280" }} />
            </IconButton>
            <IconButton onClick={() => handleDelete(row)}>
              <DeleteIcon style={{ color: "#6b7280" }} />
            </IconButton>
          </div>
        ),
      },
    ],
    [handleUpdate, handleDelete]
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
      />
    );
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Category Table" />
      {renderContent()}
    </DefaultLayout>
  );
}
