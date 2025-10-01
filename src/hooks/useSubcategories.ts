import { getSubcategories,Subcategory } from "@/api/services/subcategory.service";
import { useQuery } from "@tanstack/react-query";

// export type Subcategory = {
//   id: string;
//   name: string;
//   categoryId: string;
//   createdAt: string;
//   updatedAt: string; is_active:boolean;
//   Category?: { id: string; name: string }; // include ke saath aa sakta hai
// };

export function useSubcategories() {
  return useQuery<Subcategory[], Error>({
    queryKey: ["subcategories"],
    queryFn:getSubcategories
  });
}
