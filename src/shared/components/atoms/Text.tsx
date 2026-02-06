import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/utils";

const textVariants = cva("transition-colors", {
  variants: {
    variant: {
      big: "font-nunito",
      title: "font-nunito font-bold",
      subtitle: "font-nunito font-semibold",
      base: "font-raleway",
      custom: "",
    },
    color: {
      primary: "text-primary",
      black: "text-black",
      contrast: "text-contrast",
      shopcontrast: "text-shopcontrast",
      error: "text-red-500",
      success: "text-green-300",
      warning: "text-yellow-200",
      grey: "text-muted-foreground",
      custom: "",
    },
    size: {
      xs: "text-xs md:text-xs",
      sm: "text-sm md:text-sm",
      md: "text-base md:text-md",
      lg: "text-lg md:text-lg",
      xl: "text-xl md:text-2xl",
      "14": "text-[12px] md:text-[14px]",
      custom: "",
    },
  },
  defaultVariants: {
    variant: "base",
    color: "primary",
    size: "md",
  },
});

export interface TextProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";
  // En React 19, definimos ref dentro de las props si queremos tiparlo
  ref?: React.Ref<HTMLElement>;
}

export const Text = ({
  className,
  variant,
  color,
  size,
  as: Comp = "p",
  ref, // 👈 Accedemos directamente a ref
  ...props
}: TextProps) => {
  return (
    <Comp
      // @ts-expect-error - Sigue siendo útil por la naturaleza polimórfica del componente
      ref={ref}
      className={cn(textVariants({ variant, color, size, className }))}
      {...props}
    />
  );
};
