import { useQuery } from "@tanstack/react-query";
import { getAllWithdrawals } from "@/api/services/withdrawal.service";
type Withdrawal = {
  id: string;
  userId: string;
  amount: string;
  status: string;
  referenceNo: string;
  upiId: string;
  createdAt: string;
  updatedAt: string;
};

const useWithdrawals = () => {
  return useQuery<Withdrawal[], Error>({
    queryKey: ["withdrawals"],
    queryFn: getAllWithdrawals,
    // staleTime: 60 * 1000 * 5,
  });
};
export default useWithdrawals;
