export interface IProduct {
  id: string;
  image: string;
  name: string;
  brand: string;
  price: number;
  category: string;
}

export interface IOpenFoodFactsResponse {
  code: string;
  status: number;
  status_verbose: string;
  product?: {
    product_name?: string;
    brands?: string;
    image_front_small_url?: string;
    categories_tags?: string[];
  };
}
