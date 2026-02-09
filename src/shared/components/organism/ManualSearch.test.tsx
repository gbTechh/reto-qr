import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ManualSearch } from "./ManualSearch";
import { useProductQuery } from "@/shared/hooks/useProductQuery";
import type { IProduct } from "@/features/product/types";

vi.mock("@/shared/hooks/useProductQuery");

const mockOpenOnlySheet = vi.fn();
const mockAddToHistory = vi.fn();

interface MockStore {
  openOnlySheet: (product: IProduct) => void;
  addToHistory: (product: IProduct) => void;
}

vi.mock("@/features/product/store", () => ({
  useProductStore: <T,>(selector: (state: MockStore) => T) => {
    const state: MockStore = {
      openOnlySheet: mockOpenOnlySheet,
      addToHistory: mockAddToHistory,
    };
    return selector(state);
  },
}));

type ProductQueryReturn = ReturnType<typeof useProductQuery>;

describe("ManualSearch Component", () => {
  const useProductQueryMock = vi.mocked(useProductQuery);

  beforeEach(() => {
    vi.clearAllMocks();

    const defaultState = {
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ProductQueryReturn;

    useProductQueryMock.mockReturnValue(defaultState);
  });

  const openDialog = () => {
    const trigger = screen.getByText(/Ingresar código manual/i);
    fireEvent.click(trigger);
  };

  it("debería abrir el diálogo al hacer clic en el botón", () => {
    render(<ManualSearch />);
    expect(
      screen.queryByPlaceholderText(/Ej: 7501055363803/i),
    ).not.toBeInTheDocument();

    openDialog();

    expect(
      screen.getByPlaceholderText(/Ej: 7501055363803/i),
    ).toBeInTheDocument();
  });

  it("debería mostrar error de validación si el código es inválido", async () => {
    render(<ManualSearch />);
    openDialog();

    const input = screen.getByPlaceholderText(/Ej: 7501055363803/i);
    const button = screen.getByText("Buscar Producto");

    fireEvent.change(input, { target: { value: "123" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Ha ocurrido un problema/i)).toBeInTheDocument();
    });
  });

  it("debería disparar la búsqueda al presionar ENTER con un código válido", async () => {
    useProductQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ProductQueryReturn);

    render(<ManualSearch />);
    openDialog();

    const input = screen.getByPlaceholderText(/Ej: 7501055363803/i);
    const validCode = "7501055363803";

    fireEvent.change(input, { target: { value: validCode } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter", charCode: 13 });

    expect(screen.getByText("Buscando...")).toBeInTheDocument();
  });

  it("debería abrir el sheet y guardar en historial cuando la data llega exitosamente", () => {
    const mockData: IProduct = {
      id: "1",
      name: "Producto Test",
      price: 100,
      image: "https://ejemplo.com/img.jpg",
      brand: "Marca Test",
      category: "Categoría Test",
    };

    useProductQueryMock.mockReturnValue({
      data: mockData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
    } as unknown as ProductQueryReturn);

    vi.useFakeTimers();

    render(<ManualSearch />);

    expect(mockOpenOnlySheet).toHaveBeenCalledWith(mockData);

    vi.advanceTimersByTime(500);
    expect(mockAddToHistory).toHaveBeenCalledWith(mockData);

    vi.useRealTimers();
  });
});
