// src/hooks/useUsers.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BackendUser,
  createSubcategory,
  CreateSubcategoryDto,
  getAllUsers,
  Subcategory,
  loginApi,
  type LoginDto,
  type LoginResponse,
} from '@/api/services/base.service';
import { useEffect } from "react";
import { getAllCarpenters } from "../../api/services/base.service";

export const useUsers = () => {
  return useQuery<BackendUser[], Error>({
    queryKey: ["users"],
    queryFn: getAllUsers,
    staleTime: 60 * 1000,
  });
};

export const useCarpenters= () => {
  return useQuery<BackendUser[], Error>({
    queryKey: ["carpenters"],
    queryFn: getAllCarpenters,
    staleTime: 60 * 1000,
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

