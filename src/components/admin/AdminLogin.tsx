import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

const AdminLogin = ({ onLoginSuccess }: AdminLoginProps) => {
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    toast.info("Acesso Autorizado", {
      description: "Bem-vindo ao painel administrativo. O acesso foi simplificado para facilitar seu uso.",
      duration: 5000,
    });

    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card rounded-lg border p-8 shadow-sm text-center">
        <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <LogIn className="h-6 w-6 text-primary" />
        </div>
        
        <h1 className="font-heading text-xl font-bold mb-2">
          Painel dos Papais
        </h1>
        
        <div className="bg-primary/5 border border-primary/20 rounded-md p-4 mb-6">
          <p className="text-sm text-foreground/80 leading-relaxed font-medium mb-1">
            ✨ Acesso Rápido
          </p>
          <p className="text-xs text-muted-foreground">
            Sinta-se à vontade para entrar e gerenciar o enxoval. Não é necessário e-mail ou senha.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <Button type="submit" className="w-full py-6 text-base font-bold shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
            Entrar no Painel
          </Button>
        </form>
        <div className="mt-4 text-center">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
              <ArrowLeft className="mr-1 h-3 w-3" />
              Voltar à lista
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
