import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Package, TrendingUp, Upload, Plus } from "lucide-react";
import ProductTable from "@/components/inventory/ProductTable";
import { useToast } from "@/hooks/use-toast";

// Mock data for demo
const mockProducts = [
  {
    id: 1,
    name: "Vintage Denim Jacket",
    sku: "VDJ-001",
    stockQuantity: 5,
    lowStockThreshold: 10,
    price: 45.99,
    image: "/placeholder.svg",
    variant: "Medium, Blue",
    status: "active" as const,
    wooProductId: "123"
  },
  {
    id: 2,
    name: "Silver Chain Necklace",
    sku: "SCN-002", 
    stockQuantity: 25,
    lowStockThreshold: 15,
    price: 29.99,
    image: "/placeholder.svg",
    variant: "18inch",
    status: "active" as const,
    wooProductId: "124"
  },
  {
    id: 3,
    name: "Floral Summer Dress",
    sku: "FSD-003",
    stockQuantity: 2,
    lowStockThreshold: 5,
    price: 39.99,
    image: "/placeholder.svg",
    variant: "Large, Pink",
    status: "active" as const,
    wooProductId: "125"
  }
];

const Index = () => {
  const [products] = useState(mockProducts);
  const { toast } = useToast();

  const lowStockItems = products.filter(p => p.stockQuantity <= p.lowStockThreshold);
  const totalProducts = products.length;
  const totalStock = products.reduce((sum, p) => sum + p.stockQuantity, 0);

  const handleCSVImport = () => {
    toast({
      title: "CSV Import",
      description: "CSV import feature coming soon!",
    });
  };

  const handleWooCommerceSync = () => {
    toast({
      title: "WooCommerce Sync",
      description: "Syncing with WooCommerce store...",
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
          <p className="text-muted-foreground">Manage your clothing and jewelry inventory</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCSVImport} variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={handleWooCommerceSync} variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Sync WooCommerce
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">Active inventory items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stock</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStock}</div>
            <p className="text-xs text-muted-foreground">Units in inventory</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{lowStockItems.length}</div>
            <p className="text-xs text-muted-foreground">Need restocking</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts
            </CardTitle>
            <CardDescription>
              These items need immediate restocking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map((product) => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-destructive/10 rounded-lg">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">SKU: {product.sku}</p>
                  </div>
                  <Badge variant="destructive">
                    {product.stockQuantity} left
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Product Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product Inventory</CardTitle>
          <CardDescription>
            Manage your product catalog and stock levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductTable products={products} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
