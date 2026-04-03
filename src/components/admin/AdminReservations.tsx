import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { MessageCircle, Mail, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { MOCK_RESERVATIONS } from "@/data/mockData";

const AdminReservations = () => {
  const [reservationToDelete, setReservationToDelete] = useState<string | null>(null);

  const reservations = MOCK_RESERVATIONS;
  const loadingReservations = false;

  const executeDeleteReservation = () => {
    toast.info("Demonstração de Portifólio", {
      description: "Operação de exclusão bloqueada na versão de demonstração.",
      duration: 6000,
    });
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
              Tem certeza que deseja cancelar esta reserva? Esta ação não pode ser desfeita e o produto voltará a ficar disponível para outros convidados. (Modo Portifólio demonstrativo)
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
