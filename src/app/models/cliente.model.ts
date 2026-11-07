export interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string | null;
  activo: boolean;
}

export type ClienteCreate = Omit<Cliente, 'id' | 'telefono' | 'activo'> & {
  telefono?: string | null;
  activo?: boolean;
};

export type ClienteUpdate = Partial<ClienteCreate>;

