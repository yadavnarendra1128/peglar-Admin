import { apiClient } from "../lib/apiClient";
import { getUserById } from "./base.service";

// ============ Withdrawals ============
export const getAllWithdrawals = async () => {
  const res = await apiClient.get("/withdrawal/withdrawals");
  console.log(res.data, "withdrawals data");
  return res.data;
};

export const sendPayment = async (
  userId: string,
  upiId: string,
  amount: number
) => {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("user not found");
    }
    if (upiId !== user.upiDetails?.upiId) throw new Error("user not found");

    console.log('got here',user.name,upiId)
    const payload = {
      amount: 1,
      payment_mode: "UPI",
      transcation_note: "testing",
      beneficiaryName: user.name,
      upi: upiId,
    };
    console.log("SUCCESSS", payload);
    const payoutResponse = await apiClient.post("/payout", payload)
    console.log(payoutResponse)
    return payoutResponse
  } catch (e) {
    console.log(e);
  }
};
