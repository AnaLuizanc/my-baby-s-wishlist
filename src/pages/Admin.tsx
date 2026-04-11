import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminReservations from "@/components/admin/AdminReservations";
import AdminMessages from "@/components/admin/AdminMessages";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminSettings from "@/components/admin/AdminSettings";

const Admin = () => {
  const [session, setSession] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(!!session);
      setAuthLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(!!session);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (session) {
      const loginTime = sessionStorage.getItem("adminLoginTime");
      const now = Date.now();
      const THIRTY_MINUTES = 30 * 60 * 1000;

      if (!loginTime) {
        sessionStorage.setItem("adminLoginTime", now.toString());
        timeoutId = setTimeout(async () => {
          await supabase.auth.signOut();
          sessionStorage.removeItem("adminLoginTime");
          toast.info("Sessão expirada", { description: "Sua seção no painel admin expirou após 30 minutos de segurança." });
        }, THIRTY_MINUTES);
      } else {
        const elapsed = now - parseInt(loginTime, 10);
        if (elapsed > THIRTY_MINUTES) {
          supabase.auth.signOut().then(() => {
            sessionStorage.removeItem("adminLoginTime");
            toast.info("Sessão expirada", { description: "Sua seção de segurança expirou." });
          });
        } else {
          timeoutId = setTimeout(async () => {
            await supabase.auth.signOut();
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin onLoadingChange={setAuthLoading} />;
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
        <Tabs defaultValue="reservas" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="reservas">Reservas</TabsTrigger>
            <TabsTrigger value="produtos">Produtos no Enxoval</TabsTrigger>
            <TabsTrigger value="mensagens">Mensagens</TabsTrigger>
            <TabsTrigger value="configuracoes">Configurações</TabsTrigger>
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

          <TabsContent value="configuracoes">
            <AdminSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
