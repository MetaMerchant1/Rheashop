import type {
  Product,
  Category,
  ProductImage,
  Order,
  OrderItem,
  Address,
  User,
  Review,
} from "@/generated/prisma";

export type ProductWithCategory = Product & {
  category: Category;
  images: ProductImage[];
};

export type ProductWithDetails = Product & {
  category: Category;
  images: ProductImage[];
  reviews: (Review & { user: Pick<User, "id" | "name" | "image"> })[];
};

export type OrderWithDetails = Order & {
  items: (OrderItem & { product: Product })[];
  address: Address;
  user: Pick<User, "id" | "name" | "email">;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number | null;
  image: string;
  quantity: number;
  stock: number;
};

export type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "id"> & { quantity?: number }) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};
