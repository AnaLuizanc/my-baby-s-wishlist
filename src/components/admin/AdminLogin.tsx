import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface AdminLoginProps {
  onLoadingChange: (loading: boolean) => void;
}

const AdminLogin = ({ onLoadingChange }: AdminLoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    onLoadingChange(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Credenciais inválidas.");
      onLoadingChange(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-card rounded-lg border p-6 shadow-sm">
        <h1 className="font-heading text-xl font-bold mb-1 text-center">
          Painel dos Papais
        </h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Faça login para gerenciar o enxoval
        </p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            <LogIn className="mr-2 h-4 w-4" />
            Entrar
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
