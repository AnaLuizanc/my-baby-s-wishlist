import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CATEGORIES = [
  { value: "farmacia_cuidados", label: "Farmácia e Cuidados" },
  { value: "roupas", label: "Roupas" },
  { value: "quarto_passeio", label: "Quarto e Passeio" },
  { value: "amamentacao", label: "Amamentação" },
  { value: "banho", label: "Banho" }
] as const;

export type ProductRow = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  category: string;
  quantity_total: number;
  quantity_reserved: number;
  purchase_link: string | null;
};

const formSchema = z.object({
  name: z.string().min(2, "Nome é obrigatório"),
  description: z.string().optional().nullable(),
  image_url: z.string().url("URL inválida").optional().or(z.literal("")).nullable(),
  category: z.string().min(1, "Categoria é obrigatória"),
  quantity_total: z.coerce.number().min(1, "A quantidade deve ser pelo menos 1"),
  purchase_link: z.string().url("URL inválida").optional().or(z.literal("")).nullable()
});

type FormValues = z.infer<typeof formSchema>;

type ProductAdminFormProps = {
  open: boolean;
  onClose: () => void;
  product?: ProductRow | null; // se nulo, modo criação
};

export default function ProductAdminForm({ open, onClose, product }: ProductAdminFormProps) {
  const isEditing = !!product;

  const { register, handleSubmit, control, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      category: "farmacia_cuidados",
      quantity_total: 1,
      purchase_link: ""
    }
  });

  useEffect(() => {
    if (open) {
      if (product) {
        reset({
          name: product.name,
          description: product.description || "",
          image_url: product.image_url || "",
          category: product.category,
          quantity_total: product.quantity_total,
          purchase_link: product.purchase_link || ""
        });
      } else {
        reset({
          name: "",
          description: "",
          image_url: "",
          category: "farmacia_cuidados",
          quantity_total: 1,
          purchase_link: ""
        });
      }
    }
  }, [open, product, reset]);

  const onSubmit = async (data: FormValues) => {
    toast.info("Demonstração", {
      description: "As funções de Salvar/Editar Banco de Dados estão desabilitadas. Se estivesse rodando, o produto seria perfeitamente processado!",
      duration: 6000
    });

    if (isEditing) {
      toast.success("Produto atualizado com sucesso!");
    } else {
      toast.success("Produto adicionado com sucesso!");
    }

    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Produto" : "Novo Produto"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Produto *</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Opcional. Ex: Cor azul, marca X..."
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Categoria *</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity_total">Quantidade Total *</Label>
              <Input
                id="quantity_total"
                type="number"
                min="1"
                {...register("quantity_total")}
              />
              {errors.quantity_total && <p className="text-xs text-destructive">{errors.quantity_total.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">Link da Imagem</Label>
            <Input id="image_url" type="url" {...register("image_url")} placeholder="https://..." />
            {errors.image_url && <p className="text-xs text-destructive">{errors.image_url.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchase_link">Link de Compra</Label>
            <Input id="purchase_link" type="url" {...register("purchase_link")} placeholder="https://..." />
            {errors.purchase_link && <p className="text-xs text-destructive">{errors.purchase_link.message}</p>}
          </div>

          <div className="pt-4 flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
