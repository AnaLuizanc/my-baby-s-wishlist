import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "./ProductCard";
import { Pill, Shirt, BedDouble, Baby, Bath, Sun } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Database } from "@/integrations/supabase/types";
import type { CartItem } from "@/hooks/useCart";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Enums"]["product_category"];

const categoryConfig: Record<
  Category,
  { label: string; icon: React.ReactNode; color: string }
> = {
  farmacia_cuidados: {
    label: "Farmácia e Cuidados",
    icon: <Pill className="h-5 w-5" />,
    color: "bg-baby-cream",
  },
  roupas: {
    label: "Roupas",
    icon: <Shirt className="h-5 w-5" />,
    color: "bg-baby-canary",
  },
  quarto_passeio: {
    label: "Quarto e Passeio",
    icon: <BedDouble className="h-5 w-5" />,
    color: "bg-baby-gold",
  },
  amamentacao: {
    label: "Amamentação",
    icon: <Baby className="h-5 w-5" />,
    color: "bg-baby-honey",
  },
  banho: {
    label: "Banho",
    icon: <Bath className="h-5 w-5" />,
    color: "bg-baby-sunshine",
  },
};

const categoryOrder: Category[] = [
  "farmacia_cuidados",
  "roupas",
  "quarto_passeio",
  "amamentacao",
  "banho",
];

interface CategoryAccordionProps {
  products: Product[];
  cartItems: CartItem[];
  onAddToCart: (id: string, name: string, quantity: number, maxAvailable: number) => void;
}

const CategoryAccordion = ({ products, cartItems, onAddToCart }: CategoryAccordionProps) => {
  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  const getCartQty = (productId: string) =>
    cartItems.find((c) => c.productId === productId)?.quantity ?? 0;

  return (
    <Accordion
      type="multiple"
      defaultValue={grouped.map((g) => g.category)}
      className="space-y-3"
    >
      {grouped.map(({ category, items }) => {
        const config = categoryConfig[category];
        const totalQty = items.reduce((sum, i) => sum + i.quantity_total, 0);
        const reservedQty = items.reduce((sum, i) => sum + i.quantity_reserved, 0);
        const progressPercent = totalQty > 0 ? Math.round((reservedQty / totalQty) * 100) : 0;

        return (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg overflow-hidden bg-card"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3 flex-1">
                <span
                  className={`flex items-center justify-center rounded-full p-2 ${config.color}`}
                >
                  {config.icon}
                </span>
                <div className="flex flex-col items-start flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-base">
                      {config.label}
                    </span>
                    <Sun className="h-3 w-3 text-primary opacity-50" />
                  </div>
                  <div className="flex items-center gap-2 w-full mt-1">
                    <Progress value={progressPercent} className="h-2 flex-1 max-w-[120px]" />
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {reservedQty}/{totalQty} reservados
                    </span>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {items.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    description={product.description}
                    imageUrl={product.image_url}
                    quantityTotal={product.quantity_total}
                    quantityReserved={product.quantity_reserved}
                    purchaseLink={product.purchase_link}
                    cartQuantity={getCartQty(product.id)}
                    onAddToCart={onAddToCart}
                  />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default CategoryAccordion;
