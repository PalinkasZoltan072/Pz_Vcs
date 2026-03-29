import React, { createContext, useContext, useState, type ReactNode } from 'react';

interface CartItem {
  id: number;
  nev: string;
  ar: number;
  meret: number;
  mennyiseg: number;
  kep: string;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, meret: number) => void;
  clearCart: () => void;          // ← ÚJ
  cartCount: number;
  totalSum: number;               // ← ÚJ (CartSheet-ből idehozva)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => {
      // Megnézzük, van-e már ilyen cipő (ID és Méret is egyezik)
      const existingItem = prev.find(
        (item) => item.id === newItem.id && item.meret === newItem.meret
      );

      // Ha van, akkor map-pel végigmegyünk, és CSAK annak a mennyiségét növeljük egy ÚJ objektumban mert amugy a strictmdoe miatt 2ször adna hozzá kövinek mert a biztonsag kedveert a react 2szer futtatja így nem 1+1=2db lenne hanem 3db
      if (existingItem) {
        return prev.map((item) =>
          item.id === newItem.id && item.meret === newItem.meret
            ? { ...item, mennyiseg: item.mennyiseg + newItem.mennyiseg }
            : item
        );
      }
      
      // Ha még nincs, simán betesszük a lista végére
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: number, meret: number) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.meret === meret)));
  };

  const clearCart = () => setCart([]);   // ← ÚJ

  const cartCount = cart.reduce((sum, item) => sum + item.mennyiseg, 0);
  const totalSum = cart.reduce((sum, item) => sum + item.ar * item.mennyiseg, 0); // ← ÚJ

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, totalSum }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};