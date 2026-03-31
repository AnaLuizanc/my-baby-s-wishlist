import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  productName: string;
  onSuccess: () => void;
}

const ReservationModal = ({
  open,
  onClose,
  productId,
  productName,
  onSuccess,
}: ReservationModalProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !whatsapp.trim()) {
      toast.error("Por favor, preencha seu nome e WhatsApp.");
      return;
    }

    if (whatsapp.replace(/\D/g, "").length < 10) {
      toast.error("Informe um número de WhatsApp válido.");
      return;
    }

    if (!productId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from("reservations").insert({
        product_id: productId,
        guest_name: name.trim(),
        guest_whatsapp: whatsapp.trim(),
        message: message.trim() || null,
      });

      if (error) {
        if (error.message.includes("no longer available")) {
          toast.error("Este item já foi totalmente reservado!");
        } else {
          toast.error("Erro ao reservar. Tente novamente.");
        }
        console.error(error);
        return;
      }

      toast.success("Reserva realizada com sucesso! 🎉");
      setName("");
      setWhatsapp("");
      setMessage("");
      onSuccess();
      onClose();
    } catch {
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-heading">
            <Heart className="h-5 w-5 text-secondary" />
            Reservar Presente
          </DialogTitle>
          <DialogDescription>
            Você está reservando: <strong>{productName}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Seu nome *</Label>
            <Input
              id="name"
              placeholder="Ex: Maria Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp *</Label>
            <Input
              id="whatsapp"
              placeholder="(11) 99999-9999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              maxLength={20}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Mensagem para os papais{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Escreva uma mensagem carinhosa..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Reservando..." : "Confirmar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReservationModal;
