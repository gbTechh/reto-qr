import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IProduct } from "./types";

interface ProductStore {
  selectedProduct: IProduct | null;
  isOpen: boolean;
  history: IProduct[]; // El historial vive aquí
  openDetails: (product: IProduct) => void;
  closeDetails: () => void;
  clearHistory: () => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      selectedProduct: null,
      isOpen: false,
      history: [],

      openDetails: (product) =>
        set((state) => {
          const cleanHistory = state.history.filter((p) => p.id !== product.id);

          const newHistory = [product, ...cleanHistory].slice(0, 15);

          return {
            selectedProduct: product,
            isOpen: true,
            history: newHistory,
          };
        }),

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
