import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Camera, FruitType, InventoryMovement } from '../types';

interface DataContextType {
  cameras: Camera[];
  fruitTypes: FruitType[];
  movements: InventoryMovement[];
  updateCamera: (camera: Camera) => void;
  addMovement: (movement: Omit<InventoryMovement, 'id' | 'date'>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockFruitTypes: FruitType[] = [
  { id: '1', name: 'Manzanas', color: '#EF4444' },
  { id: '2', name: 'Peras', color: '#10B981' },
  { id: '3', name: 'Naranjas', color: '#F97316' },
  { id: '4', name: 'Limones', color: '#EAB308' },
  { id: '5', name: 'Bananas', color: '#F59E0B' },
];

const mockCameras: Camera[] = [
  {
    id: '1',
    name: 'Cámara A1',
    totalCapacity: 50000,
    occupiedCapacity: 35000,
    status: 'operativa',
    temperature: 2,
    humidity: 85,
    contents: [
      { id: '1', fruitType: 'Manzanas', quantity: 15000, unit: 'kg', entryDate: '2024-01-15', expiryDate: '2024-04-15' },
      { id: '2', fruitType: 'Peras', quantity: 20000, unit: 'kg', entryDate: '2024-01-20', expiryDate: '2024-03-20' }
    ]
  },
  {
    id: '2',
    name: 'Cámara B2',
    totalCapacity: 40000,
    occupiedCapacity: 28000,
    status: 'operativa',
    temperature: 1,
    humidity: 90,
    contents: [
      { id: '3', fruitType: 'Naranjas', quantity: 18000, unit: 'kg', entryDate: '2024-01-10', expiryDate: '2024-05-10' },
      { id: '4', fruitType: 'Limones', quantity: 10000, unit: 'kg', entryDate: '2024-01-25', expiryDate: '2024-06-25' }
    ]
  },
  {
    id: '3',
    name: 'Cámara C3',
    totalCapacity: 60000,
    occupiedCapacity: 12000,
    status: 'mantenimiento',
    temperature: 0,
    humidity: 0,
    contents: [
      { id: '5', fruitType: 'Bananas', quantity: 12000, unit: 'kg', entryDate: '2024-02-01', expiryDate: '2024-02-15' }
    ]
  },
  {
    id: '4',
    name: 'Cámara D4',
    totalCapacity: 45000,
    occupiedCapacity: 45000,
    status: 'operativa',
    temperature: 3,
    humidity: 82,
    contents: [
      { id: '6', fruitType: 'Manzanas', quantity: 25000, unit: 'kg', entryDate: '2024-01-30', expiryDate: '2024-04-30' },
      { id: '7', fruitType: 'Peras', quantity: 20000, unit: 'kg', entryDate: '2024-02-05', expiryDate: '2024-04-05' }
    ]
  }
];

export function DataProvider({ children }: { children: ReactNode }) {
  const [cameras, setCameras] = useState<Camera[]>(mockCameras);
  const [fruitTypes] = useState<FruitType[]>(mockFruitTypes);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);

  const updateCamera = (updatedCamera: Camera) => {
    setCameras(prev => prev.map(cam => 
      cam.id === updatedCamera.id ? updatedCamera : cam
    ));
  };

  const addMovement = (movementData: Omit<InventoryMovement, 'id' | 'date'>) => {
    const newMovement: InventoryMovement = {
      ...movementData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    setMovements(prev => [newMovement, ...prev]);
  };

  return (
    <DataContext.Provider value={{
      cameras,
      fruitTypes,
      movements,
      updateCamera,
      addMovement
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}