import { IShiftRepository } from "../../../core/repositories/IShiftRepository";
import { Shift } from "../../../core/entities/Shift";

export class OpenShiftUseCase {
  constructor(private shiftRepository: IShiftRepository) {}

  async execute(userId: number, openingAmount: number) {
    // Check if user has an open shift already
    const existingOpenShift = await this.shiftRepository.findOpenShiftByUserId(userId);
    if (existingOpenShift) {
      throw new Error("El usuario ya tiene un turno abierto");
    }

    const shift = new Shift(userId, openingAmount);
    return this.shiftRepository.create(shift);
  }
}
