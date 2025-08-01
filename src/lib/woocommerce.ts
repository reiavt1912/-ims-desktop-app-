// WooCommerce API integration utilities

export interface WooCommerceConfig {
  storeUrl: string;
  consumerKey: string;
  consumerSecret: string;
}

export interface WooCommerceProduct {
  id: number;
  name: string;
  sku: string;
  price: string;
  stock_quantity: number;
  manage_stock: boolean;
  images: Array<{ src: string }>;
  variations: number[];
  status: string;
}

export interface WooCommerceVariation {
  id: number;
  sku: string;
  price: string;
  stock_quantity: number;
  attributes: Array<{ name: string; option: string }>;
}

export interface WooCommerceOrder {
  id: number;
  status: string;
  line_items: Array<{
    product_id: number;
    variation_id: number;
    quantity: number;
    sku: string;
  }>;
  date_created: string;
}

class WooCommerceAPI {
  private config: WooCommerceConfig;
  private baseUrl: string;

  constructor(config: WooCommerceConfig) {
    this.config = config;
    this.baseUrl = `${config.storeUrl}/wp-json/wc/v3`;
  }

  private getAuthHeaders(): HeadersInit {
    const auth = btoa(`${this.config.consumerKey}:${this.config.consumerSecret}`);
    return {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    };
  }

  async getProducts(): Promise<WooCommerceProduct[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }

  async getProductVariations(productId: number): Promise<WooCommerceVariation[]> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/variations`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch variations: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching variations:', error);
      throw error;
    }
  }

  async updateProductStock(productId: number, stockQuantity: number): Promise<WooCommerceProduct> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          stock_quantity: stockQuantity,
          manage_stock: true,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update product stock: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating product stock:', error);
      throw error;
    }
  }

  async updateVariationStock(
    productId: number, 
    variationId: number, 
    stockQuantity: number
  ): Promise<WooCommerceVariation> {
    try {
      const response = await fetch(`${this.baseUrl}/products/${productId}/variations/${variationId}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify({
          stock_quantity: stockQuantity,
          manage_stock: true,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update variation stock: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating variation stock:', error);
      throw error;
    }
  }

  async getOrders(status: string = 'completed'): Promise<WooCommerceOrder[]> {
    try {
      const response = await fetch(`${this.baseUrl}/orders?status=${status}`, {
        headers: this.getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch orders: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/system_status`, {
        headers: this.getAuthHeaders(),
      });
      
      return response.ok;
    } catch (error) {
      console.error('Error testing connection:', error);
      return false;
    }
  }
}

export default WooCommerceAPI;