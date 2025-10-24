import { createContext, useContext, useReducer, ReactNode, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  size: string;
  color?: string;
  quantity: number;
  category: string;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: { id: number; size: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; size: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += action.payload.quantity;
        return { ...state, items: updatedItems };
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => !(item.id === action.payload.id && item.size === action.payload.size)
        ),
      };

    case "UPDATE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id && item.size === action.payload.size
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "TOGGLE_CART":
      return { ...state, isOpen: !state.isOpen };

    case "OPEN_CART":
      return { ...state, isOpen: true };

    case "CLOSE_CART":
      return { ...state, isOpen: false };

    default:
      return state;
  }
};

interface CartContextType {
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (id: number, size: string) => void;
  updateQuantity: (id: number, size: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });
  const { state: authState } = useAuth();

  // Load cart from database when user logs in
  useEffect(() => {
    if (authState.user) {
      loadCartFromDatabase();
    } else {
      // Clear cart when user logs out
      dispatch({ type: "CLEAR_CART" });
    }
  }, [authState.user]);

  const loadCartFromDatabase = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/orders/cart", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.cart.items.length > 0) {
          // Convert database cart items to frontend format
          const dbItems = data.cart.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            category: item.category,
          }));
          
          // Replace local cart with database cart
          dispatch({ type: "CLEAR_CART" });
          dbItems.forEach((item: CartItem) => {
            dispatch({ type: "ADD_ITEM", payload: item });
          });
        }
      }
    } catch (error) {
      console.error("Failed to load cart from database:", error);
    }
  };

  const addItem = async (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    
    // Sync with database if user is logged in
    if (authState.user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch("/api/orders/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            productId: item.id.toString(),
            qty: item.quantity,
            size: item.size,
            color: item.color,
          }),
        });
      } catch (error) {
        console.error("Failed to sync cart with database:", error);
      }
    }
  };

  const removeItem = async (id: number, size: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id, size } });
    
    // Sync with database if user is logged in
    if (authState.user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        // Find the cart item ID from database
        const cartItem = state.items.find(item => item.id === id && item.size === size);
        if (cartItem) {
          await fetch(`/api/orders/cart/item/${cartItem.id}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
        }
      } catch (error) {
        console.error("Failed to sync cart removal with database:", error);
      }
    }
  };

  const updateQuantity = async (id: number, size: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id, size);
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, size, quantity } });
      
      // Sync with database if user is logged in
      if (authState.user) {
        try {
          const token = localStorage.getItem("token");
          if (!token) return;

          const cartItem = state.items.find(item => item.id === id && item.size === size);
          if (cartItem) {
            await fetch(`/api/orders/cart/item/${cartItem.id}`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ qty: quantity }),
            });
          }
        } catch (error) {
          console.error("Failed to sync cart update with database:", error);
        }
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });
    
    // Sync with database if user is logged in
    if (authState.user) {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        await fetch("/api/orders/cart", {
          method: "DELETE",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
      } catch (error) {
        console.error("Failed to sync cart clear with database:", error);
      }
    }
  };

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const openCart = () => {
    dispatch({ type: "OPEN_CART" });
  };

  const closeCart = () => {
    dispatch({ type: "CLOSE_CART" });
  };

  const getCartTotal = () => {
    return state.items.reduce((total, item) => {
      const price = parseInt(item.price.replace(/[^\d]/g, ""));
      return total + price * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    getCartTotal,
    getCartItemsCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
