import logger from "../../config/logger";

export class EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<boolean> {
    try {
      // TODO: Implementar con un servicio real como SendGrid, Mailgun, etc.
      logger.info(`📧 Email enviado a ${to}: ${subject}`);
      console.log(`\n📧 Simulated Email:\nTo: ${to}\nSubject: ${subject}\nBody: ${body}\n`);
      return true;
    } catch (error) {
      logger.error("Error al enviar email:", error);
      return false;
    }
  }

  async sendVentaConfirmation(email: string, ventaId: number): Promise<boolean> {
    const subject = `Confirmación de Venta #${ventaId}`;
    const body = `Su venta #${ventaId} ha sido registrada exitosamente.`;
    return this.sendEmail(email, subject, body);
  }
}
