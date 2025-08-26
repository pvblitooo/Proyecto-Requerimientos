import React, { useState } from 'react';
import { Plus, Minus, ArrowLeftRight, History, FileText } from 'lucide-react';
import { InventoryForm } from './InventoryForm';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

type MovementType = 'entrada' | 'salida' | 'movimiento';

export function InventoryManagement() {
  const { movements } = useData();
  const { user } = useAuth();
  const [showForm, setShowForm] = useState<MovementType | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMovementTypeColor = (type: MovementType) => {
    switch (type) {
      case 'entrada': return 'bg-green-100 text-green-700 border-green-200';
      case 'salida': return 'bg-red-100 text-red-700 border-red-200';
      case 'movimiento': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getMovementTypeIcon = (type: MovementType) => {
    switch (type) {
      case 'entrada': return <Plus className="w-4 h-4" />;
      case 'salida': return <Minus className="w-4 h-4" />;
      case 'movimiento': return <ArrowLeftRight className="w-4 h-4" />;
    }
  };

  const getMovementDescription = (movement: any) => {
    switch (movement.type) {
      case 'entrada':
        return `Entrada a ${movement.cameraDestination}`;
      case 'salida':
        return `Salida de ${movement.cameraOrigin}`;
      case 'movimiento':
        return `De ${movement.cameraOrigin} a ${movement.cameraDestination}`;
    }
  };

  const canPerformAction = (action: string) => {
    if (user?.role === 'administrador') return true;
    if (user?.role === 'operador') {
      return ['entrada', 'salida', 'movimiento'].includes(action);
    }
    return false;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Registra movimientos de entrada, salida y transferencias</p>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => canPerformAction('entrada') && setShowForm('entrada')}
          disabled={!canPerformAction('entrada')}
          className={`bg-white p-6 rounded-xl border-2 border-dashed border-green-300 hover:border-green-500 transition-all duration-200 text-left group ${
            !canPerformAction('entrada') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nueva Entrada</h3>
              <p className="text-sm text-gray-600">Registrar ingreso de fruta</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => canPerformAction('salida') && setShowForm('salida')}
          disabled={!canPerformAction('salida')}
          className={`bg-white p-6 rounded-xl border-2 border-dashed border-red-300 hover:border-red-500 transition-all duration-200 text-left group ${
            !canPerformAction('salida') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
              <Minus className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Nueva Salida</h3>
              <p className="text-sm text-gray-600">Registrar retiro de fruta</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => canPerformAction('movimiento') && setShowForm('movimiento')}
          disabled={!canPerformAction('movimiento')}
          className={`bg-white p-6 rounded-xl border-2 border-dashed border-blue-300 hover:border-blue-500 transition-all duration-200 text-left group ${
            !canPerformAction('movimiento') ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              <ArrowLeftRight className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Movimiento Interno</h3>
              <p className="text-sm text-gray-600">Transferir entre cámaras</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Movements */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <History className="w-6 h-6 text-gray-600" />
              <h3 className="text-lg font-semibold text-gray-900">Movimientos Recientes</h3>
            </div>
            {user?.role === 'administrador' && (
              <button className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4" />
                <span>Generar Reporte</span>
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          {movements.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fruta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operador
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {movements.slice(0, 10).map((movement) => (
                  <tr key={movement.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getMovementTypeColor(movement.type)}`}>
                        {getMovementTypeIcon(movement.type)}
                        <span className="capitalize">{movement.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-900">
                      {getMovementDescription(movement)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {movement.fruitType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {movement.quantity.toLocaleString()} {movement.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {movement.operator}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {formatDate(movement.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No hay movimientos registrados</p>
              <p className="text-sm mt-2">Los movimientos aparecerán aquí una vez que los registres</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <InventoryForm
          type={showForm}
          onClose={() => setShowForm(null)}
        />
      )}
    </div>
  );
}