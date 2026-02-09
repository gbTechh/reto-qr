import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductImage } from "./ProductImage";

vi.mock("next/image", () => ({
  default: ({
    onLoadingComplete,
    ...props
  }: React.ComponentProps<"img"> & { onLoadingComplete?: () => void }) => {
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
    return <img {...props} onLoad={onLoadingComplete} />;
  },
}));

describe("ProductImage Component", () => {
  const defaultProps = {
    src: "https://ejemplo.com/foto.jpg",
    alt: "Producto de prueba",
  };

  it("debería mostrar el estado de carga (skeleton) inicialmente", () => {
    render(<ProductImage {...defaultProps} />);

    expect(screen.getByText("Cargando...")).toBeInTheDocument();

    const img = screen.getByRole("img");
    expect(img).toHaveClass("opacity-0");
  });

  it("debería mostrar la imagen y ocultar el skeleton al terminar de cargar", () => {
    render(<ProductImage {...defaultProps} />);

    const img = screen.getByRole("img");

    fireEvent.load(img);

    expect(screen.queryByText("Cargando...")).not.toBeInTheDocument();

    expect(img).toHaveClass("opacity-100");
    expect(img).toHaveAttribute("src", defaultProps.src);
  });

  it("debería mostrar la imagen de fallback si ocurre un error", () => {
    render(<ProductImage {...defaultProps} />);

    const img = screen.getByRole("img");

    fireEvent.error(img);

    expect(img).toHaveAttribute("src", "/images/no_image_dark.webp");

    expect(screen.queryByText("Cargando...")).not.toBeInTheDocument();
  });
});
