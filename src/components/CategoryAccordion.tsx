import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "./ProductCard";
import { Pill, Shirt, BedDouble, Baby, Bath } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Product = Database["public"]["Tables"]["products"]["Row"];
type Category = Database["public"]["Enums"]["product_category"];

const categoryConfig: Record<
  Category,
  { label: string; icon: React.ReactNode; color: string }
> = {
  farmacia_cuidados: {
    label: "Farmácia e Cuidados",
    icon: <Pill className="h-5 w-5" />,
    color: "bg-baby-mint",
  },
  roupas: {
    label: "Roupas",
    icon: <Shirt className="h-5 w-5" />,
    color: "bg-baby-pink",
  },
  quarto_passeio: {
    label: "Quarto e Passeio",
    icon: <BedDouble className="h-5 w-5" />,
    color: "bg-baby-blue",
  },
  amamentacao: {
    label: "Amamentação",
    icon: <Baby className="h-5 w-5" />,
    color: "bg-baby-peach",
  },
  banho: {
    label: "Banho",
    icon: <Bath className="h-5 w-5" />,
    color: "bg-baby-lavender",
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
  onReserve: (id: string) => void;
}

const CategoryAccordion = ({ products, onReserve }: CategoryAccordionProps) => {
  const grouped = categoryOrder
    .map((cat) => ({
      category: cat,
      items: products.filter((p) => p.category === cat),
    }))
    .filter((g) => g.items.length > 0);

  return (
    <Accordion
      type="multiple"
      defaultValue={grouped.map((g) => g.category)}
      className="space-y-3"
    >
      {grouped.map(({ category, items }) => {
        const config = categoryConfig[category];
        const totalItems = items.length;
        const reservedItems = items.filter(
          (i) => i.quantity_reserved >= i.quantity_total
        ).length;

        return (
          <AccordionItem
            key={category}
            value={category}
            className="border rounded-lg overflow-hidden bg-card"
          >
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <span
                  className={`flex items-center justify-center rounded-full p-2 ${config.color}`}
                >
                  {config.icon}
                </span>
                <span className="font-heading font-bold text-base">
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground">
                  ({reservedItems}/{totalItems} reservados)
                </span>
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
                    onReserve={onReserve}
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
