export interface CrearVentaDTO {
  clienteId: number;
  productos: {
    id: number;
    cantidad: number;
    precio: number;
  }[];
}

export interface VentaResponseDTO {
  id: number;
  clienteId: number;
  total: number;
  fecha: Date;
  detalles: {
    id: number;
    productoId: number;
    cantidad: number;
    precioUnit: number;
  }[];
}
