import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, MessageCircle, Mail } from "lucide-react";
import type { Reservation } from "./types";

const AdminReservations = () => {
  const queryClient = useQueryClient();
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

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

  const executeDeleteReservation = async () => {
    if (!reservationToDelete) return;
    const { error } = await supabase.from("reservations").delete().eq("id", reservationToDelete);
    if (error) {
      toast.error("Erro ao excluir reserva.");
      return;
    }
    toast.success("Reserva cancelada e item liberado.");
    queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    setReservationToDelete(null);
  };

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
    <>
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
              <TableHead></TableHead>
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
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setReservationToDelete(r.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={!!reservationToDelete} onOpenChange={(open) => !open && setReservationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar reserva?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita e o produto voltará a ficar disponível para outros convidados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Voltar</AlertDialogCancel>
            <AlertDialogAction onClick={executeDeleteReservation} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Sim, cancelar reserva
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminReservations;
