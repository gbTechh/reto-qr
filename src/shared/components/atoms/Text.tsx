import { cn } from "@/shared/utils";
import { cva, VariantProps } from "class-variance-authority";

const textVariants = cva("transition-colors", {
  variants: {
    variant: {
      big: "font-inter font-bold",
      title: "font-inter font-bold",
      subtitle: "font-inter font-semibold",
      base: "font-raleway",
      custom: "",
    },
    size: {
      sm: "text-sm",
      md: "text-md",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      big: "text-3xl",
      custom: "",
    },

    color: {
      primary: "text-primary",
      contrast: "text-contrast",
      shopcontrast: "text-shopcontrast",
      grey: "text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "base",
    size: "sm",
    color: "primary",
  },
});

export interface TextProps
  extends
    Omit<React.HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof textVariants> {
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div";

  ref?: React.Ref<HTMLElement>;
}

export const Text = ({
  className,
  variant,
  size,
  as: Comp = "p",
  ref,
  ...props
}: TextProps) => {
  return (
    <Comp
      // @ts-expect-error - Sigue siendo útil por la naturaleza polimórfica del componente

      ref={ref}
      className={cn(textVariants({ variant, size, className }))}
      {...props}
    />
  );
};
