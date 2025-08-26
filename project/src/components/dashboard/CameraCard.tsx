import React from 'react';
import { Thermometer, Droplets, AlertCircle, CheckCircle, Wrench } from 'lucide-react';
import { Camera } from '../../types';

interface CameraCardProps {
  camera: Camera;
  onClick: () => void;
}

export function CameraCard({ camera, onClick }: CameraCardProps) {
  const occupancyPercentage = (camera.occupiedCapacity / camera.totalCapacity) * 100;

  const getStatusColor = () => {
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

  const getStatusIcon = () => {
    switch (camera.status) {
      case 'operativa':
        return <CheckCircle className="w-4 h-4" />;
      case 'mantenimiento':
        return <Wrench className="w-4 h-4" />;
      case 'fuera_servicio':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCapacityColor = () => {
    if (occupancyPercentage >= 90) return 'bg-red-500';
    if (occupancyPercentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 transform hover:-translate-y-1"
    >
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{camera.name}</h3>
          <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor()}`}>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="capitalize">{camera.status.replace('_', ' ')}</span>
            </div>
          </div>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Ocupación</span>
            <span>{occupancyPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${getCapacityColor()}`}
              style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{camera.occupiedCapacity.toLocaleString()} kg</span>
            <span>{camera.totalCapacity.toLocaleString()} kg</span>
          </div>
        </div>

        {/* Environmental conditions */}
        {camera.status === 'operativa' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Temperatura</p>
                <p className="font-medium text-sm">{camera.temperature}°C</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Humedad</p>
                <p className="font-medium text-sm">{camera.humidity}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Content preview */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 mb-2">Contenido:</p>
          {camera.contents.length > 0 ? (
            <div className="space-y-1">
              {camera.contents.slice(0, 2).map((content, index) => (
                <div key={content.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">{content.fruitType}</span>
                  <span className="font-medium">{content.quantity.toLocaleString()} {content.unit}</span>
                </div>
              ))}
              {camera.contents.length > 2 && (
                <p className="text-xs text-gray-500">+{camera.contents.length - 2} más...</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Cámara vacía</p>
          )}
        </div>
      </div>
    </div>
  );
}