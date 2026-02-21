export interface CreateSaleDTO {
  customerId: number;
  products: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

export interface SaleResponseDTO {
  id: number;
  customerId: number;
  total: number;
  date: Date;
  details: {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
}
