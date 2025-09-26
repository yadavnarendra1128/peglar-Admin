"use client";

import { useQuery } from "@tanstack/react-query";
import { Product,getAllProducts } from "../../api/services/product.service";

export const useProducts = () => {
  return useQuery<Product[], Error>({
    queryKey: ["products"],
    queryFn: getAllProducts,
    // Caches data for 5 minutes
    staleTime: 1000 * 60 * 5,
    // Prevents refetching every time the window is focused
    refetchOnWindowFocus: false,
  });
};
