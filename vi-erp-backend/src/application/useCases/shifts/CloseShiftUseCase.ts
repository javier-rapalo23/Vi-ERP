import { IShiftRepository } from "../../../core/repositories/IShiftRepository";

export class CloseShiftUseCase {
  constructor(private shiftRepository: IShiftRepository) {}

  async execute(shiftId: number, closingAmount: number, notes?: string) {
    const shift = await this.shiftRepository.findByIdWithSales(shiftId);

    if (!shift) {
      throw new Error("Turno no encontrado");
    }

    if (shift.status === "CLOSED") {
      throw new Error("Este turno ya está cerrado");
    }

    return this.shiftRepository.close(shiftId, closingAmount, notes);
  }
}
