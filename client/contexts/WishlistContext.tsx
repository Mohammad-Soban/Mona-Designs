import { createContext, useContext, useReducer, ReactNode } from "react";

export interface WishlistItem {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  rating: number;
}

interface WishlistState {
  items: WishlistItem[];
}

type WishlistAction =
  | { type: "ADD_ITEM"; payload: WishlistItem }
  | { type: "REMOVE_ITEM"; payload: { id: number } }
  | { type: "CLEAR_WISHLIST" };

const wishlistReducer = (state: WishlistState, action: WishlistAction): WishlistState => {
  switch (action.type) {
    case "ADD_ITEM": {
      const existingItemIndex = state.items.findIndex(item => item.id === action.payload.id);
      
      if (existingItemIndex >= 0) {
        // Item already in wishlist, don't add again
        return state;
      }

      return { ...state, items: [...state.items, action.payload] };
    }

    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id),
      };

    case "CLEAR_WISHLIST":
      return { ...state, items: [] };

    default:
      return state;
  }
};

interface WishlistContextType {
  state: WishlistState;
  wishlistItems: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(wishlistReducer, {
    items: [],
  });

  const addItem = (item: WishlistItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  };

  const removeItem = (id: number) => {
    dispatch({ type: "REMOVE_ITEM", payload: { id } });
  };

  const clearWishlist = () => {
    dispatch({ type: "CLEAR_WISHLIST" });
  };

  const isInWishlist = (id: number) => {
    return state.items.some(item => item.id === id);
  };

  const getWishlistCount = () => {
    return state.items.length;
  };

  const value = {
    state,
    wishlistItems: state.items,
    addItem,
    removeItem,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }

  // Ensure wishlistItems is always an array
  return {
    ...context,
    wishlistItems: context.wishlistItems || []
  };
};
