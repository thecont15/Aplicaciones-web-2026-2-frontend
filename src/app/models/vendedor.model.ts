export interface Vendedor {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  activo: boolean;
}

export type VendedorCreate = Omit<Vendedor, 'id' | 'telefono' | 'activo'> & {
  telefono?: string | null;
  activo?: boolean;
};

export type VendedorUpdate = Partial<VendedorCreate>;
