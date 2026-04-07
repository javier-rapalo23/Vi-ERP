import { Sale } from "../entities/Venta";

export type SalesHistoryFilters = {
  dateFrom?: Date;
  dateTo?: Date;
  customer?: string;
  status?: string;
  minAmount?: number;
  maxAmount?: number;
};

export type PeriodTotals = {
  today: { count: number; total: number };
  thisWeek: { count: number; total: number };
  thisMonth: { count: number; total: number };
};

export interface ISaleRepository {
  create(sale: Sale): Promise<any>;
  findAll(filters?: SalesHistoryFilters): Promise<any[]>;
  findById(id: number): Promise<any | null>;
  getTotalsByPeriod(): Promise<PeriodTotals>;
}