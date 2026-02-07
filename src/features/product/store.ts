import { create } from "zustand";
import { IProduct } from "./types";

interface ProductStore {
  selectedProduct: IProduct | null;
  isOpen: boolean;
  openDetails: (product: IProduct) => void;
  closeDetails: () => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  isOpen: false,
  openDetails: (product) => set({ selectedProduct: product, isOpen: true }),
  closeDetails: () => set({ isOpen: false, selectedProduct: null }),
}));
