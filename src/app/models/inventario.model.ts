export interface Inventario {
  id: string;
  sku: string;
  nombre_producto: string;
  descripcion: string | null;
  categoria: string | null;
  precio: number;
  cantidad: number;
  stock_minimo: number;
  activo: boolean;
}

export type InventarioCreate = Omit<
  Inventario,
  'id' | 'descripcion' | 'categoria' | 'cantidad' | 'stock_minimo' | 'activo'
> & {
  descripcion?: string | null;
  categoria?: string | null;
  cantidad?: number;
  stock_minimo?: number;
  activo?: boolean;
};

export type InventarioUpdate = Partial<InventarioCreate>;
