export interface Product {
  product_id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  category_name: string;
  image_url: string;
  sku: string;
  createdAt: string;
  sales: number;
  revenue: number;
  rating: {
    rate: number | 0;
    count: number | 0;
  };
}