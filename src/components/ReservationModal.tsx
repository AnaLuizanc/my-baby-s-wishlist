import { useState, useEffect } from "react";
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
import { Heart, Sun, Trash2 } from "lucide-react";
import type { CartItem } from "@/hooks/useCart";

interface ReservationModalProps {
  open: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (productId: string) => void;
  onSuccess: () => void;
}

const ReservationModal = ({
  open,
  onClose,
  cartItems,
  onRemoveItem,
  onSuccess,
}: ReservationModalProps) => {
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && cartItems.length === 0) {
      onClose();
    }
  }, [open, cartItems.length, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !whatsapp.trim() || !email.trim()) {
      toast.error("Por favor, preencha nome, WhatsApp e e-mail.");
      return;
    }

    if (whatsapp.replace(/\D/g, "").length < 10) {
      toast.error("Informe um número de WhatsApp válido.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast.error("Informe um e-mail válido.");
      return;
    }

    if (cartItems.length === 0) return;

    setLoading(true);
    try {
      const reservations = cartItems.map((item) => ({
        product_id: item.productId,
        guest_name: name.trim(),
        guest_whatsapp: whatsapp.trim(),
        guest_email: email.trim(),
        message: message.trim() || null,
        quantity: item.quantity,
      }));

      const { error } = await supabase.from("reservations").insert(reservations);

      if (error) {
        if (error.message.includes("no longer available")) {
          toast.error("Um ou mais itens já foram totalmente reservados!");
        } else {
          toast.error("Erro ao reservar. Tente novamente.");
        }
        console.error(error);
        return;
      }

      toast.success("Reserva realizada com sucesso! 🎉");
      setName("");
      setWhatsapp("");
      setEmail("");
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
            <Heart className="h-5 w-5 text-primary" />
            Finalizar Reserva
            <Sun className="h-4 w-4 text-primary opacity-50" />
          </DialogTitle>
          <DialogDescription className="pt-2 text-left">
            Você está reservando {cartItems.length} item(ns):
            <div className="mt-3 max-h-40 overflow-y-auto space-y-2 pr-2">
              {cartItems.map((i) => (
                <div key={i.productId} className="flex justify-between items-center bg-muted/50 p-2 rounded-md border text-left">
                  <span className="text-foreground text-sm font-medium line-clamp-1">
                    {i.productName} <span className="text-muted-foreground whitespace-nowrap">{i.quantity > 1 ? ` (×${i.quantity})` : ""}</span>
                  </span>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => onRemoveItem(i.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
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
            <Label htmlFor="email">E-mail *</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
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
