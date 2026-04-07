import { ExternalLink, Gift, Check, Sun, Moon, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  quantityTotal: number;
  quantityReserved: number;
  purchaseLink?: string | null;
  cartQuantity: number;
  onAddToCart: (id: string, name: string, quantity: number, maxAvailable: number) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  imageUrl,
  quantityTotal,
  quantityReserved,
  purchaseLink,
  cartQuantity,
  onAddToCart,
}: ProductCardProps) => {
  const remaining = quantityTotal - quantityReserved - cartQuantity;
  const isFullyReserved = remaining <= 0 && cartQuantity === 0;
  const isInCart = cartQuantity > 0;
  const maxAvailable = quantityTotal - quantityReserved;
  const [selectQty, setSelectQty] = useState(1);

  const handleAdd = () => {
    if (remaining <= 0) return;
    const qty = Math.min(selectQty, remaining);
    onAddToCart(id, name, qty, maxAvailable);
    setSelectQty(1);
  };

  return (
    <div
      className={`group relative rounded-lg border bg-card p-4 transition-all duration-300 animate-fade-in flex flex-col justify-between h-full ${
        isFullyReserved ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {/* Sun decoration */}
      <Sun className="absolute top-2 right-2 h-4 w-4 text-primary opacity-30 dark:hidden" />
      <Moon className="absolute top-2 right-2 h-4 w-4 text-primary opacity-30 hidden dark:block" />

      {/* Image */}
      {imageUrl && (
        <div className="mb-3 overflow-hidden rounded-md aspect-square bg-muted">
          <img
            src={imageUrl}
            alt={name}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Content */}
      <h3 className="font-heading font-bold text-foreground text-sm leading-tight mb-1">
        {name}
      </h3>

      {description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
          {description}
        </p>
      )}

      {/* Quantity badge */}
      {quantityTotal > 1 && (
        <Badge variant="secondary" className="mb-2 text-xs">
          {Math.max(remaining, 0)}/{quantityTotal} disponíveis
        </Badge>
      )}

      {/* In cart indicator */}
      {isInCart && (
        <Badge className="mb-2 text-xs bg-primary text-primary-foreground">
          {cartQuantity} no carrinho
        </Badge>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        {isFullyReserved ? (
          <Button disabled size="sm" className="w-full bg-accent text-accent-foreground">
            <Check className="mr-1 h-3 w-3" />
            Reservado
          </Button>
        ) : remaining <= 0 ? (
          <Button disabled size="sm" className="w-full bg-accent text-accent-foreground">
            <Check className="mr-1 h-3 w-3" />
            No carrinho
          </Button>
        ) : (
          <>
            {maxAvailable > 1 && (
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setSelectQty(Math.max(1, selectQty - 1))}
                  disabled={selectQty <= 1}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="text-sm font-medium w-6 text-center">{selectQty}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setSelectQty(Math.min(remaining, selectQty + 1))}
                  disabled={selectQty >= remaining}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            )}
            <Button size="sm" className="w-full" onClick={handleAdd}>
              <Gift className="mr-1 h-3 w-3" />
              Adicionar
            </Button>
          </>
        )}

        {purchaseLink && (
          <a
            href={purchaseLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="mr-1 h-3 w-3" />
            Onde comprar
          </a>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
