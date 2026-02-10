export interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // Parent category
  subCategory: string; // Child category (required)
  description: string;
  specifications?: string;
  images: string[];
  featured: boolean;
  available: boolean;
  // Product variations
  sizes?: string[]; // For cables
  colors?: string[]; // For outdoor lights
  lightingTemperatures?: string[]; // For outdoor lights
  voltageRating?: string; // For cables
  thickness?: string; // For cables
  usageType?: string; // For cables
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  date: string;
  status: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name: string;
}
