import { MOCK_RESERVATIONS } from "@/data/mockData";
import { MessageCircle } from "lucide-react";
import type { Reservation } from "./types";

const AdminMessages = () => {
  const reservations = MOCK_RESERVATIONS;
  const loadingReservations = false;

  if (loadingReservations) {
    return <p className="text-muted-foreground text-center py-10">Carregando...</p>;
  }

  const messages = reservations.filter(r => r.message && r.message.trim() !== "");

  if (messages.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card">
        Nenhuma mensagem deixada pelos convidados ainda.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {messages.map((r) => (
        <div key={r.id + 'msg'} className="p-4 rounded-lg border bg-card shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div className="font-medium text-primary flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              {r.guest_name}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(r.created_at).toLocaleDateString("pt-BR")}
            </span>
          </div>
          <p className="text-sm italic text-foreground mb-4 flex-grow">"{r.message}"</p>
          <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
            Referente ao presente: <span className="font-medium">{r.products?.name ?? "—"}</span> ({r.quantity}x)
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminMessages;
