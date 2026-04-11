import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

const AdminSettings = () => {
  const [headerTitle, setHeaderTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Simulate network request for demonstration
    const timer = setTimeout(() => {
      const savedTitle = localStorage.getItem("demo_header_title");
      setHeaderTitle(savedTitle || "Enxoval do Neném 🍼");
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = () => {
    if (!headerTitle.trim()) {
      toast.error("O título não pode estar vazio.");
      return;
    }
    
    setIsSaving(true);
    // Simulate network request
    setTimeout(() => {
      localStorage.setItem("demo_header_title", headerTitle);
      
      // Dispatch a custom event so Index.tsx can update the title immediately
      window.dispatchEvent(new Event("settings_updated"));
      
      setIsSaving(false);
      toast.success("Configurações salvas com sucesso!");
    }, 500);
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
            disabled={isSaving}
            className="w-full sm:w-auto"
          >
            {isSaving ? (
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
