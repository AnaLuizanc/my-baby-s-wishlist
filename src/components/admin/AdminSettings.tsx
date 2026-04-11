import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";

const AdminSettings = () => {
  const queryClient = useQueryClient();
  const [headerTitle, setHeaderTitle] = useState("");

  const { data: currentTitle, isLoading } = useQuery({
    queryKey: ["settings", "header_title"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "header_title")
        .maybeSingle();

      if (error) throw error;
      return data?.value || "Enxoval do Neném de Ana Flávia e Gabriel🍼";
    },
  });

  useEffect(() => {
    if (currentTitle) {
      setHeaderTitle(currentTitle);
    }
  }, [currentTitle]);

  const updateSettingMutation = useMutation({
    mutationFn: async (newValue: string) => {
      // First try to select to see if it exists
      const { data } = await supabase
        .from("settings")
        .select("key")
        .eq("key", "header_title")
        .maybeSingle();

      let error;
      if (data) {
        // Update existing
        const res = await supabase
          .from("settings")
          .update({ value: newValue })
          .eq("key", "header_title");
        error = res.error;
      } else {
        // Insert new
        const res = await supabase
          .from("settings")
          .insert({ key: "header_title", value: newValue });
        error = res.error;
      }

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast.success("Configurações salvas com sucesso!");
    },
    onError: (error) => {
      console.error("Error updating settings:", error);
      toast.error("Erro ao salvar as configurações.");
    },
  });

  const handleSave = () => {
    if (!headerTitle.trim()) {
      toast.error("O título não pode estar vazio.");
      return;
    }
    updateSettingMutation.mutate(headerTitle);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-heading font-bold mb-4">Configurações Gerais</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="headerTitle">Título do Cabeçalho (Página Inicial)</Label>
            <Input
              id="headerTitle"
              value={headerTitle}
              onChange={(e) => setHeaderTitle(e.target.value)}
              placeholder="Ex: Enxoval do Neném"
            />
            <p className="text-sm text-muted-foreground">
              Este é o título principal que aparece em destaque na página inicial.
            </p>
          </div>

          <Button 
            onClick={handleSave} 
            disabled={updateSettingMutation.isPending}
            className="w-full sm:w-auto"
          >
            {updateSettingMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
