import { useQuery } from "@tanstack/react-query";
import { getAllProductQr } from "@/api/services/qr.service";
import { QrCode } from "@/types/qrCode";

export const useProductsQr = (page=1,limit=10) => {
  return useQuery<{total:number,data:QrCode[]}, Error>({
    queryFn: ()=>getAllProductQr(page,limit),
    queryKey: ["prdouctsqr"],
    // staleTime: 60 * 1000,
  });
};
