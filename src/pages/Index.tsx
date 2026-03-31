import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategoryAccordion from "@/components/CategoryAccordion";
import ReservationModal from "@/components/ReservationModal";
import { Baby, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  const queryClient = useQueryClient();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-baby-mint via-baby-blue to-baby-pink py-12 px-4 text-center">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "radial-gradient(circle at 20% 50%, hsl(var(--baby-peach)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--baby-lavender)) 0%, transparent 50%)"
        }} />
        <div className="relative z-10 container max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center rounded-full bg-card/80 backdrop-blur p-4 mb-4 shadow-sm">
            <Baby className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Chá de Bebê 🍼
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Escolha um presente da nossa lista e reserve para evitar duplicatas.
            Sua presença já é o maior presente!
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl mx-auto py-6 px-4">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-pulse text-muted-foreground">
              Carregando lista de presentes...
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            <Baby className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p>A lista de presentes ainda está sendo preparada.</p>
            <p className="text-sm">Volte em breve! 💛</p>
          </div>
        ) : (
          <CategoryAccordion
            products={products}
            onReserve={(id) => setSelectedProductId(id)}
          />
        )}
      </main>

      {/* Admin link */}
      <footer className="text-center pb-8">
        <Link to="/admin">
          <Button variant="ghost" size="sm" className="text-muted-foreground text-xs">
            <ShieldCheck className="mr-1 h-3 w-3" />
            Painel dos Papais
          </Button>
        </Link>
      </footer>

      {/* Reservation Modal */}
      <ReservationModal
        open={!!selectedProductId}
        onClose={() => setSelectedProductId(null)}
        productId={selectedProductId}
        productName={selectedProduct?.name ?? ""}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["products"] });
        }}
      />
    </div>
  );
};

export default Index;
