import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MessageCircle, Mail } from "lucide-react";
import type { Reservation } from "./types";

const AdminReservations = () => {
  const { data: reservations = [], isLoading: loadingReservations } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*, products(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Reservation[];
    },
  });

  if (loadingReservations) {
    return <p className="text-muted-foreground text-center py-10">Carregando...</p>;
  }

  if (reservations.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card">
        Nenhuma reserva realizada ainda.
      </p>
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Presente</TableHead>
            <TableHead>Quantidade</TableHead>
            <TableHead>Convidado</TableHead>
            <TableHead>WhatsApp</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Mensagem</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservations.map((r) => (
            <TableRow key={r.id}>
              <TableCell className="font-medium text-sm">
                {r.products?.name ?? "—"}
              </TableCell>
              <TableCell className="text-sm">{r.quantity}</TableCell>
              <TableCell className="text-sm">{r.guest_name}</TableCell>
              <TableCell className="text-sm">{r.guest_whatsapp}</TableCell>
              <TableCell className="text-sm">
                <span className="flex items-center gap-1">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  {r.guest_email}
                </span>
              </TableCell>
              <TableCell className="text-sm max-w-[200px]">
                {r.message ? (
                  <span className="flex items-start gap-1">
                    <MessageCircle className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                    <span className="line-clamp-2">{r.message}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                {new Date(r.created_at).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminReservations;
