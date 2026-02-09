import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IProduct } from "./types";

interface ProductStore {
  selectedProduct: IProduct | null;
  isOpen: boolean;
  history: IProduct[];
  openOnlySheet: (product: IProduct) => void;
  addToHistory: (product: IProduct) => void;
  removeFromHistory: (productId: string) => void;
  closeDetails: () => void;
  clearHistory: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      selectedProduct: null,
      isOpen: false,
      history: [],
      openOnlySheet: (product: IProduct) =>
        set({ selectedProduct: product, isOpen: true }),
      addToHistory: (product) =>
        set((state) => {
          const cleanHistory = state.history.filter((p) => p.id !== product.id);
          return { history: [product, ...cleanHistory].slice(0, 15) };
        }),
      removeFromHistory: (productId: string) =>
        set((state) => ({
          history: state.history.filter((p) => p.id !== productId),
        })),
      closeDetails: () => set({ isOpen: false }),

      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "product-scanner-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ history: state.history }),
    },
  ),
);
