import { Shift } from "../entities/Shift";

export interface IShiftRepository {
  create(shift: Shift): Promise<any>;
  close(shiftId: number, closingAmount: number, notes?: string): Promise<any>;
  findById(id: number): Promise<any | null>;
  findByIdWithSales(id: number): Promise<any | null>;
  findOpenShiftByUserId(userId: number): Promise<any | null>;
  findAllByUserId(userId: number): Promise<any[]>;
  findAll(): Promise<any[]>;
}
