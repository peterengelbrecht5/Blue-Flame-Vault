import { createContext, useContext, useState, useEffect, useMemo, useCallback, ReactNode } from "react";
import { CartItem, Product, Order, SEED_PRODUCTS, getCart, saveCart, getOrders, saveOrders } from "./data-store";

interface CartContextValue {
  items: CartItem[];
  orders: Order[];
  itemCount: number;
  total: number;
  addItem: (productId: string) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (address: string) => Promise<Order>;
  getProduct: (id: string) => Product | undefined;
  refreshOrders: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [cart, ords] = await Promise.all([getCart(), getOrders()]);
    setItems(cart);
    setOrders(ords);
  }

  const getProduct = useCallback((id: string) => SEED_PRODUCTS.find(p => p.id === id), []);

  const addItem = useCallback((productId: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === productId);
      const next = existing
        ? prev.map(i => i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { productId, quantity: 1 }];
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => {
      const next = prev.filter(i => i.productId !== productId);
      saveCart(next);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    if (qty <= 0) return removeItem(productId);
    setItems(prev => {
      const next = prev.map(i => i.productId === productId ? { ...i, quantity: qty } : i);
      saveCart(next);
      return next;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    saveCart([]);
  }, []);

  const placeOrder = useCallback(async (address: string): Promise<Order> => {
    const orderItems = items.map(i => ({
      product: SEED_PRODUCTS.find(p => p.id === i.productId)!,
      quantity: i.quantity,
    })).filter(i => i.product);

    const order: Order = {
      id: "ORD-" + Date.now().toString(36).toUpperCase(),
      items: orderItems,
      total: orderItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
      status: "Processing",
      date: new Date().toISOString(),
      trackingNumber: "BF" + Math.random().toString(36).substr(2, 8).toUpperCase(),
      shippingAddress: address,
    };

    const updated = [order, ...orders];
    setOrders(updated);
    await saveOrders(updated);
    clearCart();
    return order;
  }, [items, orders, clearCart]);

  const refreshOrders = useCallback(async () => {
    const ords = await getOrders();
    setOrders(ords);
  }, []);

  const itemCount = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const total = useMemo(() => items.reduce((sum, i) => {
    const p = SEED_PRODUCTS.find(pr => pr.id === i.productId);
    return sum + (p ? p.price * i.quantity : 0);
  }, 0), [items]);

  const value = useMemo(() => ({
    items, orders, itemCount, total, addItem, removeItem, updateQuantity, clearCart, placeOrder, getProduct, refreshOrders,
  }), [items, orders, itemCount, total, addItem, removeItem, updateQuantity, clearCart, placeOrder, getProduct, refreshOrders]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
