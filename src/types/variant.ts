import { BaseEntry } from "./baseEntry";
import { Product } from "./product";

export interface Variant extends BaseEntry {
  size: string; // Variant size (e.g., L, M, etc.)
  finish: string; // Finish can be null
  color: string; // Color can be null
  price: string; // Price stored as string (e.g., "999.99")
  stock: number; // Stock count
  
  productId: string; // Reference to Product
  Product: Product; // Nested product details
}
