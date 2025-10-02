import { apiClient } from "../../../api/lib/apiClient";

export type Ticket = {
  id: string;
  userId: string;
  title: string;
  description: string;
  qrValue: string;
  ticketType: "qr-report";
  status: boolean;
  is_active: boolean;
  createdAt: string;
  updatedAt: string;
};

// ✅ Get all tickets
export const getAllTickets = async (
  page = 1,
  limit = 100
): Promise<Ticket[]> => {
  try {
    const res = await apiClient.get(`/tickets?page=${page}&limit=${limit}`);
    return res.data.data;
  } catch (err: any) {
    console.error("Failed to fetch tickets:", err);
    throw new Error(err?.response?.data?.message || "Failed to fetch tickets");
  }
};

// ✅ Get ticket by ID
export const getTicketById = async (ticketId: string): Promise<Ticket> => {
  try {
    const res = await apiClient.get(`/tickets/${ticketId}`);
    return res.data.data;
  } catch (err: any) {
    console.error(`Failed to fetch ticket ${ticketId}:`, err);
    throw new Error(err?.response?.data?.message || "Failed to fetch ticket");
  }
};

// ✅ Create ticket
export const createTicket = async (ticketData: {
  userId: string;
  title: string;
  description: string;
  ticketType?: "qr-report";
  status?: boolean;
}): Promise<Ticket> => {
  try {
    const res = await apiClient.post("/tickets", ticketData);
    return res.data.data;
  } catch (err: any) {
    console.error("Failed to create ticket:", err);
    throw new Error(err?.response?.data?.message || "Failed to create ticket");
  }
};

// ✅ Toggle ticket status
export const toggleTicketStatus = async (ticketId: string): Promise<Ticket> => {
  try {
    const res = await apiClient.patch(`/tickets/${ticketId}/status`);
    return res.data.data;
  } catch (err: any) {
    console.error(`Failed to toggle status for ticket ${ticketId}:`, err);
    throw new Error(
      err?.response?.data?.message || "Failed to update ticket status"
    );
  }
};

// ✅ Delete single ticket
export const deleteTicket = async (ticketId: string): Promise<Ticket> => {
  try {
    const res = await apiClient.delete(`/tickets/ticket/${ticketId}`);
    return res.data.data;
  } catch (err: any) {
    console.error(`Failed to delete ticket ${ticketId}:`, err);
    throw new Error(err?.response?.data?.message || "Failed to delete ticket");
  }
};

// ✅ Bulk delete tickets
export const deleteMultipleTickets = async (
  ids: string[]
): Promise<Ticket[]> => {
  try {
    const res = await apiClient.delete("/tickets", { data: { ids } });
    return res.data.data;
  } catch (err: any) {
    console.error("Failed to bulk delete tickets:", err);
    throw new Error(err?.response?.data?.message || "Failed to delete tickets");
  }
};
