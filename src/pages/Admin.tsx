import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, LogIn, LogOut, ArrowLeft, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

type Reservation = {
  id: string;
  product_id: string;
  guest_name: string;
  guest_whatsapp: string;
  guest_email: string;
  message: string | null;
  quantity: number;
  created_at: string;
  products: { name: string } | null;
};

const Admin = () => {
  const queryClient = useQueryClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["admin-reservations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reservations")
        .select("*, products(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Reservation[];
    },
    enabled: session,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error("Credenciais inválidas.");
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir reserva.");
      return;
    }
    toast.success("Reserva cancelada e item liberado.");
    queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-card rounded-lg border p-6 shadow-sm">
          <h1 className="font-heading text-xl font-bold mb-1 text-center">
            Painel dos Papais
          </h1>
          <p className="text-sm text-muted-foreground text-center mb-6">
            Faça login para gerenciar as reservas
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
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card px-4 py-4">
        <div className="container max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-lg font-bold">Painel dos Papais</h1>
            <p className="text-xs text-muted-foreground">
              {reservations.length} reserva(s) realizada(s)
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

      <main className="container max-w-4xl mx-auto py-6 px-4">
        {isLoading ? (
          <p className="text-muted-foreground text-center py-10">Carregando...</p>
        ) : reservations.length === 0 ? (
          <p className="text-muted-foreground text-center py-10">
            Nenhuma reserva realizada ainda.
          </p>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Presente</TableHead>
                  <TableHead>Qtd</TableHead>
                  <TableHead>Convidado</TableHead>
                  <TableHead>WhatsApp</TableHead>
                  <TableHead>E-mail</TableHead>
                  <TableHead>Mensagem</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium text-sm">
                      {r.products?.name ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">{r.quantity}</TableCell>
                    <TableCell className="text-sm">{r.guest_name}</TableCell>
                    <TableCell className="text-sm">{r.guest_whatsapp}</TableCell>
                    <TableCell className="text-sm">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {r.guest_email}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm max-w-[200px]">
                      {r.message ? (
                        <span className="flex items-start gap-1">
                          <MessageCircle className="h-3 w-3 mt-0.5 text-primary shrink-0" />
                          <span className="line-clamp-2">{r.message}</span>
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.created_at).toLocaleDateString("pt-BR")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(r.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </main>
    </div>
  );
};

export default Admin;
