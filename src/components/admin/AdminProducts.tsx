import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Trash2, Plus, Edit } from "lucide-react";
import ProductAdminForm, { ProductRow, CATEGORIES } from "@/components/ProductAdminForm";
import { MOCK_PRODUCTS } from "@/data/mockData";

const AdminProducts = () => {
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<ProductRow | null>(null);
  const [productSearch, setProductSearch] = useState("");

  const adminProducts = MOCK_PRODUCTS;
  const loadingProducts = false;

  const handleDeleteProduct = (id: string) => {
    toast.success("Produto excluído com sucesso!");
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

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-lg font-medium">Produtos Cadastrados</h2>
        <div className="flex w-full sm:w-auto items-center gap-2">
          <Input
            placeholder="Pesquisar produto..."
            value={productSearch}
            onChange={(e) => setProductSearch(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={openNewProductForm} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Adicionar Produto
          </Button>
        </div>
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
              {adminProducts
                .filter(p => !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase()))
                .map((p) => (
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

      <ProductAdminForm
        open={productFormOpen}
        onClose={() => setProductFormOpen(false)}
        product={productToEdit}
      />
    </>
  );
};

export default AdminProducts;
