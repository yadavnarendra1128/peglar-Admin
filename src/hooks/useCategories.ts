// src/hooks/useCategories.ts
import { useQuery } from "@tanstack/react-query";
import { fetchCategory } from "@/api/services/base.service";
type Category = {
  id: string; // Assuming 'id' is a string for a UUID
  name: string;
  createdAt: string;
  updatedAt: string;
};

export const useCategories = () => {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: fetchCategory, // fetchCategory already returns Category[]
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
