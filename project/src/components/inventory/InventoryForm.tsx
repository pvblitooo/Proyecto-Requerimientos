import React, { useState } from 'react';
import { Plus, Minus, ArrowLeftRight, X } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

type MovementType = 'entrada' | 'salida' | 'movimiento';

interface InventoryFormProps {
  type: MovementType;
  onClose: () => void;
}

export function InventoryForm({ type, onClose }: InventoryFormProps) {
  const { cameras, fruitTypes, addMovement, updateCamera } = useData();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    cameraOrigin: '',
    cameraDestination: '',
    fruitType: '',
    quantity: '',
    unit: 'kg' as 'kg' | 'ton',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFormTitle = () => {
    switch (type) {
      case 'entrada': return 'Nueva Entrada de Inventario';
      case 'salida': return 'Nueva Salida de Inventario';
      case 'movimiento': return 'Nuevo Movimiento Interno';
    }
  };

  const getFormIcon = () => {
    switch (type) {
      case 'entrada': return <Plus className="w-6 h-6" />;
      case 'salida': return <Minus className="w-6 h-6" />;
      case 'movimiento': return <ArrowLeftRight className="w-6 h-6" />;
    }
  };

  const getFormColor = () => {
    switch (type) {
      case 'entrada': return 'bg-green-600';
      case 'salida': return 'bg-red-600';
      case 'movimiento': return 'bg-blue-600';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fruitType) {
      newErrors.fruitType = 'Selecciona un tipo de fruta';
    }

    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      newErrors.quantity = 'Ingresa una cantidad válida';
    }

    if (type === 'entrada' && !formData.cameraDestination) {
      newErrors.cameraDestination = 'Selecciona una cámara de destino';
    }

    if (type === 'salida' && !formData.cameraOrigin) {
      newErrors.cameraOrigin = 'Selecciona una cámara de origen';
    }

    if (type === 'movimiento') {
      if (!formData.cameraOrigin) {
        newErrors.cameraOrigin = 'Selecciona una cámara de origen';
      }
      if (!formData.cameraDestination) {
        newErrors.cameraDestination = 'Selecciona una cámara de destino';
      }
      if (formData.cameraOrigin === formData.cameraDestination) {
        newErrors.cameraDestination = 'La cámara de destino debe ser diferente';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const quantity = parseFloat(formData.quantity);
      const quantityInKg = formData.unit === 'ton' ? quantity * 1000 : quantity;

      // Create movement record
      addMovement({
        type,
        cameraOrigin: formData.cameraOrigin || undefined,
        cameraDestination: formData.cameraDestination || undefined,
        fruitType: formData.fruitType,
        quantity,
        unit: formData.unit,
        operator: user?.username || 'Unknown',
        notes: formData.notes || undefined
      });

      // Update camera contents based on movement type
      if (type === 'entrada' && formData.cameraDestination) {
        const camera = cameras.find(c => c.id === formData.cameraDestination);
        if (camera) {
          const existingContentIndex = camera.contents.findIndex(
            c => c.fruitType === formData.fruitType
          );

          if (existingContentIndex >= 0) {
            camera.contents[existingContentIndex].quantity += quantityInKg;
          } else {
            camera.contents.push({
              id: Date.now().toString(),
              fruitType: formData.fruitType,
              quantity: quantityInKg,
              unit: 'kg',
              entryDate: new Date().toISOString().split('T')[0],
              expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            });
          }

          camera.occupiedCapacity += quantityInKg;
          updateCamera(camera);
        }
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const operationalCameras = cameras.filter(c => c.status === 'operativa');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className={`${getFormColor()} text-white p-6 rounded-t-2xl`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {getFormIcon()}
              <h2 className="text-xl font-semibold">{getFormTitle()}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Camera Origin */}
          {(type === 'salida' || type === 'movimiento') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cámara de Origen
              </label>
              <select
                value={formData.cameraOrigin}
                onChange={(e) => setFormData({ ...formData, cameraOrigin: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.cameraOrigin ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar cámara...</option>
                {operationalCameras.map((camera) => (
                  <option key={camera.id} value={camera.id}>
                    {camera.name} ({camera.occupiedCapacity.toLocaleString()} kg ocupados)
                  </option>
                ))}
              </select>
              {errors.cameraOrigin && (
                <p className="text-red-600 text-sm mt-1">{errors.cameraOrigin}</p>
              )}
            </div>
          )}

          {/* Camera Destination */}
          {(type === 'entrada' || type === 'movimiento') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cámara de Destino
              </label>
              <select
                value={formData.cameraDestination}
                onChange={(e) => setFormData({ ...formData, cameraDestination: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.cameraDestination ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar cámara...</option>
                {operationalCameras
                  .filter(camera => camera.id !== formData.cameraOrigin)
                  .map((camera) => {
                    const availableSpace = camera.totalCapacity - camera.occupiedCapacity;
                    return (
                      <option key={camera.id} value={camera.id}>
                        {camera.name} ({availableSpace.toLocaleString()} kg disponibles)
                      </option>
                    );
                  })}
              </select>
              {errors.cameraDestination && (
                <p className="text-red-600 text-sm mt-1">{errors.cameraDestination}</p>
              )}
            </div>
          )}

          {/* Fruit Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Fruta
            </label>
            <select
              value={formData.fruitType}
              onChange={(e) => setFormData({ ...formData, fruitType: e.target.value })}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.fruitType ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar fruta...</option>
              {fruitTypes.map((fruit) => (
                <option key={fruit.id} value={fruit.name}>
                  {fruit.name}
                </option>
              ))}
            </select>
            {errors.fruitType && (
              <p className="text-red-600 text-sm mt-1">{errors.fruitType}</p>
            )}
          </div>

          {/* Quantity and Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                  errors.quantity ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="0.00"
              />
              {errors.quantity && (
                <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unidad
              </label>
              <select
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value as 'kg' | 'ton' })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              >
                <option value="kg">Kilogramos</option>
                <option value="ton">Toneladas</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notas (Opcional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Información adicional sobre el movimiento..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 text-white rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getFormColor()}`}
            >
              {isSubmitting ? 'Procesando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}