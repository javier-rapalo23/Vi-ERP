export interface CreateSaleDTO {
  customerId: number;
  paymentMethod: "CASH" | "TRANSFER" | "CARD";
  products: {
    id: number;
    quantity: number;
    price: number;
  }[];
}

export interface SaleResponseDTO {
  id: number;
  invoiceNumber: string;
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
