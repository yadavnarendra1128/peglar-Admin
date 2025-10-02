import { getAllTickets, Ticket } from "@/api/services/qr-ticket.service";
import page from "@/app/admin/variant/page";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTickets = (page=1,limit=100) => {
  return useQuery<Ticket[], Error>({
    queryKey: ["tickets", page, limit],
    queryFn: ()=>getAllTickets(page, limit),
  });
};

