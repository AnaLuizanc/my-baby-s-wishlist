import { ShoppingCart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CartItem } from "@/hooks/useCart";

interface CartBarProps {
  items: CartItem[];
  totalItems: number;
  onRemove: (productId: string) => void;
  onCheckout: () => void;
}

const CartBar = ({ items, totalItems, onRemove, onCheckout }: CartBarProps) => {
  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg animate-fade-in">
      <div className="container max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto">
            <ShoppingCart className="h-5 w-5 text-primary shrink-0" />
            <div className="flex gap-1.5 overflow-x-auto">
              {items.map((item) => (
                <span
                  key={item.productId}
                  className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground text-xs rounded-full px-2 py-1 whitespace-nowrap"
                >
                  {item.productName} {item.quantity > 1 && `(${item.quantity})`}
                  <button
                    onClick={() => onRemove(item.productId)}
                    className="hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <Button size="sm" onClick={onCheckout} className="shrink-0">
            Reservar ({totalItems})
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartBar;
