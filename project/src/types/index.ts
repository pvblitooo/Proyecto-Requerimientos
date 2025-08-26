export interface User {
  id: string;
  username: string;
  role: 'administrador' | 'operador';
  email?: string;
}

export interface Camera {
  id: string;
  name: string;
  totalCapacity: number;
  occupiedCapacity: number;
  status: 'operativa' | 'mantenimiento' | 'fuera_servicio';
  temperature: number;
  humidity: number;
  contents: CameraContent[];
}

export interface CameraContent {
  id: string;
  fruitType: string;
  quantity: number;
  unit: 'kg' | 'ton';
  entryDate: string;
  expiryDate: string;
}

export interface FruitType {
  id: string;
  name: string;
  color: string;
}

export interface InventoryMovement {
  id: string;
  type: 'entrada' | 'salida' | 'movimiento';
  cameraOrigin?: string;
  cameraDestination?: string;
  fruitType: string;
  quantity: number;
  unit: 'kg' | 'ton';
  date: string;
  operator: string;
  notes?: string;
}