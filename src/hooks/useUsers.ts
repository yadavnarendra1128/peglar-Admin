// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendUser,
  createSubcategory,
  CreateSubcategoryDto,
  getAllCustomers,getAllDealers,
  Subcategory,
  loginApi,
  type LoginDto,
  type LoginResponse,
  getAllCarpenters,
} from '@/api/services/base.service';

export const useCustomers = () => {
  return useQuery<BackendUser[], Error>({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
    // staleTime: 60 * 1000,
  });
};

export const useCarpenters= () => {
  return useQuery<BackendUser[], Error>({
    queryKey: ["carpenters"],
    queryFn: getAllCarpenters,
    // staleTime: 60 * 1000,
  });
};

export const useDealers= () => {
  return useQuery<BackendUser[], Error>({
    queryKey: ["dealers"],
    queryFn: getAllDealers,
    // staleTime: 60 * 1000,
  });
};

export const useCreateSubcategory = () => {
  const qc = useQueryClient();

  return useMutation<Subcategory, Error, CreateSubcategoryDto>({
    mutationFn: createSubcategory,
    onSuccess: () => {
      // Invalidate any list queries so newly created item reflects
      qc.invalidateQueries({ queryKey: ["subcategories"] });
    },
  });
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, LoginDto>({
    mutationFn: loginApi,
  });
};

