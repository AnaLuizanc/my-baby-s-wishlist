import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ArrowLeft, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminReservations from "@/components/admin/AdminReservations";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminProducts from "@/components/admin/AdminProducts";

const Admin = () => {
  const [session, setSession] = useState<boolean>(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (session) {
      const loginTime = sessionStorage.getItem("adminLoginTime");
      const now = Date.now();
      const THIRTY_MINUTES = 30 * 60 * 1000;

      if (!loginTime) {
        sessionStorage.setItem("adminLoginTime", now.toString());
        timeoutId = setTimeout(() => {
          setSession(false);
          sessionStorage.removeItem("adminLoginTime");
          toast.info("Sessão expirada", { description: "Sua seção no painel admin expirou após 30 minutos de segurança." });
        }, THIRTY_MINUTES);
      } else {
        const elapsed = now - parseInt(loginTime, 10);
        if (elapsed > THIRTY_MINUTES) {
          setSession(false);
          sessionStorage.removeItem("adminLoginTime");
          toast.info("Sessão expirada", { description: "Sua seção de segurança expirou." });
        } else {
          timeoutId = setTimeout(() => {
            setSession(false);
            sessionStorage.removeItem("adminLoginTime");
            toast.info("Sessão expirada", { description: "Sua seção no painel admin expirou após 30 minutos." });
          }, THIRTY_MINUTES - elapsed);
        }
      }
    } else {
      sessionStorage.removeItem("adminLoginTime");
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [session]);

  const handleLogout = () => {
    setSession(false);
  };

  if (!session) {
    return <AdminLogin onLoginSuccess={() => setSession(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-4 mb-4">
        <div className="container max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-lg font-bold">Painel dos Papais</h1>
            <p className="text-xs text-muted-foreground">
              Área de gerenciamento
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/">
              <Button variant="outline" size="sm">
                <ArrowLeft className="mr-1 h-3 w-3" />
                Lista
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1 h-3 w-3" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-primary/10 border-l-4 border-primary p-4 rounded-r-lg mb-8 shadow-sm">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Versão de Demonstração (Portifólio)
          </h3>
          <p className="text-sm text-foreground/80 mt-1">
            Esta é uma cópia estática do sistema criada para exibição. Sinta-se à vontade para gerenciar reservas, editar produtos e navegar no painel de administrador tranquilamente sem afetar dados reais!
          </p>
        </div>
        <Tabs defaultValue="reservas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="produtos">Produtos no Enxoval</TabsTrigger>
            <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
          </TabsList>

          <TabsContent value="reservas">
            <AdminReservations />
          </TabsContent>

          <TabsContent value="mensagens">
            <AdminMessages />
          </TabsContent>

          <TabsContent value="produtos">
            <AdminProducts />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
