import { useQuery } from "@tanstack/react-query";

export type Subcategory = {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
  Category?: { id: string; name: string }; // include ke saath aa sakta hai
};

export function useSubcategories() {
  return useQuery<Subcategory[], Error>({
    queryKey: ["subcategories"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://31.97.61.201/api/"}subcategories`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      const data = await res.json();
      return data.data;
    },
    staleTime: 60 * 1000,
  });
}
