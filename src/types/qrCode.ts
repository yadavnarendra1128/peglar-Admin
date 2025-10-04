import { BackendUser } from "@/api/services/base.service";

export type QrCode = {
    id: string;
    product_id: string;
    qr_value: string;
    batch_no: string;
    is_scanned: boolean;
    is_redeemed: boolean;
    scanned_by: string | BackendUser;
    scanned_at: string;
    redeemed_at: string;
    createdAt: string;
    updatedAt: string;
    reward_amount:string;
    couponcode_expiry:string
};