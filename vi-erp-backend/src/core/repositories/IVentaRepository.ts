import { Sale } from "../entities/Venta";

export type SalesHistoryFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  customer?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
};

export type SaleCustomer = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
};

export type SaleDetailProduct = {
  id: number;
  name: string;
  code: string | null;
};

export type SaleDetail = {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  product: SaleDetailProduct | null;
};

export type SaleResult = {
  id: number;
  invoiceNumber: string | null;
  date: Date;
  total: number;
  status: string;
  paymentMethod: string;
  invoiceSnapshot: unknown;
  customer: SaleCustomer | null;
  details: SaleDetail[];
};

export type SalesHistoryResult = {
  data: SaleResult[];
  summary: {
    totalSales: number;
    totalAmount: number;
    totalItemsSold: number;
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type PeriodTotals = {
  today: { count: number; total: number };
  thisWeek: { count: number; total: number };
  thisMonth: { count: number; total: number };
};

export interface ISaleRepository {
  create(sale: Sale): Promise<SaleResult>;
  findAll(filters?: SalesHistoryFilters): Promise<SalesHistoryResult>;
  findById(id: number): Promise<SaleResult | null>;
  getTotalsByPeriod(): Promise<PeriodTotals>;
}