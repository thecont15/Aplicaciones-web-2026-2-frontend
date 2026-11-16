export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  activo: boolean;
}

export type ProductoCreate = Omit<Producto, 'id' | 'descripcion' | 'stock' | 'activo'> & {
  descripcion?: string | null;
  stock?: number;
  activo?: boolean;
};

export type ProductoUpdate = Partial<ProductoCreate>;
