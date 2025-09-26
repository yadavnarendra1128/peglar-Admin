import { useQuery } from "@tanstack/react-query";
import { getAllProductQr } from "@/api/services/qr.service";
import { QrCode } from "@/types/qrCode";

export const useProductsQr = () => {
  return useQuery<QrCode[], Error>({
    queryFn: getAllProductQr,
    queryKey: ["prdouctsqr"],
    // staleTime: 60 * 1000,
  });
};
