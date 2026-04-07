import { useState, useEffect } from "react";
import CategoryAccordion from "@/components/CategoryAccordion";
import ReservationModal from "@/components/ReservationModal";
import CartBar from "@/components/CartBar";
import { useCart } from "@/hooks/useCart";
import { Baby, ShieldCheck, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MOCK_PRODUCTS } from "@/data/mockData";

const Index = () => {
  const cart = useCart();
  const [showCheckout, setShowCheckout] = useState(false);
  const [theme, setTheme] = useState(() => {
    return document.documentElement.classList.contains("dark") ? "dark" : "light";
  });

  const toggleTheme = () => {
    if (theme === "light") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  };

  const products = MOCK_PRODUCTS;
  const isLoading = false;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="relative overflow-hidden bg-gradient-to-br from-baby-cream via-baby-canary to-baby-honey py-12 px-4 text-center transition-colors duration-500">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: theme === "light" 
            ? "radial-gradient(circle at 20% 50%, hsl(var(--baby-sunshine)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--baby-gold)) 0%, transparent 50%)"
            : "radial-gradient(circle at 20% 50%, hsl(var(--baby-canary)) 0%, transparent 50%), radial-gradient(circle at 80% 50%, hsl(var(--primary)) 0%, transparent 50%)"
        }} />
        
        {/* Toggle Button */}
        <div className="absolute top-4 right-4 z-20">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full bg-background/50 hover:bg-background/80 border-0 backdrop-blur" aria-label="Alternar tema">
            {theme === "light" ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
          </Button>
        </div>

        {/* Decorations */}
        {theme === "light" ? (
          <>
            <Sun className="absolute top-4 left-6 h-8 w-8 text-primary opacity-25" />
            <Sun className="absolute top-8 right-10 h-6 w-6 text-primary opacity-20" />
            <Sun className="absolute bottom-4 left-1/4 h-5 w-5 text-primary opacity-15" />
          </>
        ) : (
          <>
            <Moon className="absolute top-4 left-6 h-8 w-8 text-primary opacity-25" />
            <Moon className="absolute top-8 right-10 h-6 w-6 text-primary opacity-20" />
            <Moon className="absolute bottom-4 left-1/4 h-5 w-5 text-primary opacity-15" />
          </>
        )}

        <div className="relative z-10 container max-w-2xl mx-auto">
          <div className="inline-flex items-center justify-center rounded-full bg-card/80 backdrop-blur p-4 mb-4 shadow-sm">
            <Baby className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold text-foreground mb-2">
            Enxoval do Neném 🍼
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto transition-colors">
            Escolha os presentes da nossa lista e adicione ao carrinho.
            Sua presença já é o maior presente! {theme === "light" ? "☀️" : "🌙"}
          </p>
        </div>
      </header>

      {/* Content */}
      <main className="container max-w-3xl mx-auto py-6 px-4">
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-8 shadow-sm">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Versão de Demonstração
          </h3>
          <p className="text-sm text-foreground/80 mt-1">
            Esta é uma cópia estática do sistema criada para exibição. Sinta-se à vontade para gerenciar reservas, editar produtos e navegar no painel de administrador tranquilamente sem afetar dados reais!
          </p>
        </div>

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
            cartItems={cart.items}
            onAddToCart={cart.addItem}
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

      {/* Cart Bar */}
      <CartBar
        items={cart.items}
        totalItems={cart.totalItems}
        onRemove={cart.removeItem}
        onCheckout={() => setShowCheckout(true)}
      />

      {/* Reservation Modal */}
      <ReservationModal
        open={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cart.items}
        onRemoveItem={cart.removeItem}
        onSuccess={() => {
          cart.clearCart();
        }}
      />
    </div>
  );
};

export default Index;
