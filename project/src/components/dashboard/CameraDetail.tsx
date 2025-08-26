import React from 'react';
import { ArrowLeft, Thermometer, Droplets, Calendar, Package } from 'lucide-react';
import { Camera } from '../../types';
import { useData } from '../../context/DataContext';

interface CameraDetailProps {
  camera: Camera;
  onBack: () => void;
}

export function CameraDetail({ camera, onBack }: CameraDetailProps) {
  const { fruitTypes } = useData();
  const occupancyPercentage = (camera.occupiedCapacity / camera.totalCapacity) * 100;

  const getFruitColor = (fruitName: string) => {
    const fruit = fruitTypes.find(f => f.name === fruitName);
    return fruit?.color || '#6B7280';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusBadgeColor = () => {
    switch (camera.status) {
      case 'operativa':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'mantenimiento':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'fuera_servicio':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">{camera.name}</h1>
            <div className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusBadgeColor()}`}>
              <span className="capitalize">{camera.status.replace('_', ' ')}</span>
            </div>
          </div>
          <p className="text-gray-600">Información detallada de la cámara</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Capacidad Total</p>
              <p className="text-xl font-bold text-gray-900">
                {camera.totalCapacity.toLocaleString()} kg
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Ocupada</p>
              <p className="text-xl font-bold text-purple-600">
                {occupancyPercentage.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>

        {camera.status === 'operativa' && (
          <>
            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Thermometer className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Temperatura</p>
                  <p className="text-xl font-bold text-blue-600">{camera.temperature}°C</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Humedad</p>
                  <p className="text-xl font-bold text-cyan-600">{camera.humidity}%</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Capacity Chart */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Espacio</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-48 h-48">
              <svg className="transform -rotate-90 w-48 h-48">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="#3B82F6"
                  strokeWidth="16"
                  fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - occupancyPercentage / 100)}`}
                  className="transition-all duration-500 ease-in-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">{occupancyPercentage.toFixed(0)}%</p>
                  <p className="text-sm text-gray-600">Ocupado</p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Espacio ocupado:</span>
              <span className="font-medium">{camera.occupiedCapacity.toLocaleString()} kg</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Espacio libre:</span>
              <span className="font-medium">{(camera.totalCapacity - camera.occupiedCapacity).toLocaleString()} kg</span>
            </div>
          </div>
        </div>

        {/* Fruit Distribution */}
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución de Frutas</h3>
          {camera.contents.length > 0 ? (
            <div className="space-y-4">
              {camera.contents.map((content, index) => {
                const percentage = (content.quantity / camera.occupiedCapacity) * 100;
                return (
                  <div key={content.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: getFruitColor(content.fruitType) }}
                        />
                        <span className="font-medium text-gray-900">{content.fruitType}</span>
                      </div>
                      <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: getFruitColor(content.fruitType)
                        }}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      {content.quantity.toLocaleString()} {content.unit}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No hay contenido en esta cámara</p>
            </div>
          )}
        </div>
      </div>

      {/* Content Details Table */}
      <div className="bg-white rounded-xl border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Detalle de Contenido</h3>
        </div>
        <div className="overflow-x-auto">
          {camera.contents.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Fruta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cantidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Ingreso
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha de Vencimiento
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {camera.contents.map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getFruitColor(content.fruitType) }}
                        />
                        <span className="font-medium text-gray-900">{content.fruitType}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {content.quantity.toLocaleString()} {content.unit}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(content.entryDate)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(content.expiryDate)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Package className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>No hay contenido registrado en esta cámara</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}