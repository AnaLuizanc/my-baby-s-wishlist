import { ExternalLink, Gift, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  quantityTotal: number;
  quantityReserved: number;
  purchaseLink?: string | null;
  onReserve: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  description,
  imageUrl,
  quantityTotal,
  quantityReserved,
  purchaseLink,
  onReserve,
}: ProductCardProps) => {
  const isFullyReserved = quantityReserved >= quantityTotal;
  const remaining = quantityTotal - quantityReserved;

  return (
    <div
      className={`group relative rounded-lg border bg-card p-4 transition-all duration-300 animate-fade-in ${
        isFullyReserved ? "opacity-60" : "hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
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
        <Badge
          variant="secondary"
          className="mb-2 text-xs"
        >
          {remaining}/{quantityTotal} disponíveis
        </Badge>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-2 mt-auto">
        {isFullyReserved ? (
          <Button disabled size="sm" className="w-full bg-baby-mint text-foreground">
            <Check className="mr-1 h-3 w-3" />
            Reservado
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full"
            onClick={() => onReserve(id)}
          >
            <Gift className="mr-1 h-3 w-3" />
            Reservar
          </Button>
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
