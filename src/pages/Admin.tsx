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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Trash2, LogIn, LogOut, ArrowLeft, MessageCircle, Mail, Plus, Edit } from "lucide-react";
import { Link } from "react-router-dom";
import ProductAdminForm, { ProductRow, CATEGORIES } from "@/components/ProductAdminForm";

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

  // Estados do Produto
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductRow | null>(null);

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

  const { data: reservations = [], isLoading: loadingReservations } = useQuery({
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

  const { data: adminProducts = [], isLoading: loadingProducts } = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as ProductRow[];
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

  const handleDeleteReservation = async (id: string) => {
    if (!confirm("Tem certeza que deseja cancelar esta reserva?")) return;
    const { error } = await supabase.from("reservations").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir reserva.");
      return;
    }
    toast.success("Reserva cancelada e item liberado.");
    queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este produto? As reservas associadas a ele também serão excluídas.")) return;
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir produto.");
      return;
    }
    toast.success("Produto excluído com sucesso.");
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["admin-reservations"] });
    queryClient.invalidateQueries({ queryKey: ["products"] });
  };

  const openNewProductForm = () => {
    setProductToEdit(null);
    setProductFormOpen(true);
  };

  const openEditProductForm = (product: ProductRow) => {
    setProductToEdit(product);
    setProductFormOpen(true);
  };

  const getCategoryLabel = (catValue: string) => {
    const cat = CATEGORIES.find(c => c.value === catValue);
    return cat ? cat.label : catValue;
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
          </TabsList>

          <TabsContent value="reservas">
            {loadingReservations ? (
              <p className="text-muted-foreground text-center py-10">Carregando...</p>
            ) : reservations.length === 0 ? (
              <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card">
                Nenhuma reserva realizada ainda.
              </p>
            ) : (
              <div className="rounded-lg border bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Presente</TableHead>
                      <TableHead>Quantidade</TableHead>
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
                            onClick={() => handleDeleteReservation(r.id)}
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
          </TabsContent>

          <TabsContent value="mensagens">
            {loadingReservations ? (
              <p className="text-muted-foreground text-center py-10">Carregando...</p>
            ) : reservations.filter(r => r.message && r.message.trim() !== "").length === 0 ? (
              <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card">
                Nenhuma mensagem deixada pelos convidados ainda.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {reservations
                  .filter(r => r.message && r.message.trim() !== "")
                  .map(r => (
                  <div key={r.id + 'msg'} className="p-4 rounded-lg border bg-card shadow-sm flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-medium text-primary flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        {r.guest_name}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(r.created_at).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-sm italic text-foreground mb-4 flex-grow">"{r.message}"</p>
                    <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                      Referente ao presente: <span className="font-medium">{r.products?.name ?? "—"}</span> ({r.quantity}x)
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="produtos">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Produtos Cadastrados</h2>
              <Button onClick={openNewProductForm} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Produto
              </Button>
            </div>

            {loadingProducts ? (
              <p className="text-muted-foreground text-center py-10">Carregando...</p>
            ) : adminProducts.length === 0 ? (
              <p className="text-muted-foreground text-center py-10 border rounded-lg bg-card">
                Nenhum produto cadastrado no enxoval.
              </p>
            ) : (
              <div className="rounded-lg border bg-card overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-center">Total</TableHead>
                      <TableHead className="text-center">Reservados</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminProducts.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell className="font-medium">{p.name}</TableCell>
                        <TableCell className="text-sm">{getCategoryLabel(p.category)}</TableCell>
                        <TableCell className="text-center text-sm">{p.quantity_total}</TableCell>
                        <TableCell className="text-center text-sm font-semibold">
                          {p.quantity_reserved}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openEditProductForm(p)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteProduct(p.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <ProductAdminForm 
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        product={productToEdit}
      />
    </div>
  );
};

export default Admin;
