// UPI details type
type UpiDetails = {
  upiId: string;
};

// Main user type
export interface User {
  id: string; // UUID
  name: string;
  email: string;
  phone: string;
  language: string;

  dealerName: string | null;
  companyDetails: string | null;
  aadhar: string | null;
  panDetail: string | null;
  distributorName: string | null;

  profession: string | null;
  profileImg: string | null;
  userType: "dealer" | "distributor" | "admin" | string; // extend as needed
  password: string | null;

  upiDetails: UpiDetails | null;

  fcm: string | null; // Firebase Cloud Messaging token

  lifetime_earning: string; // stored as string (e.g. "1000.00")
  wallet_balance: string; // stored as string (e.g. "0.00")

  isVerified: boolean;

  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
}
