import React, { useState } from 'react';
import { Plus, Filter, Search } from 'lucide-react';
import { CameraCard } from './CameraCard';
import { CameraDetail } from './CameraDetail';
import { useData } from '../../context/DataContext';
import { Camera } from '../../types';

export function Dashboard() {
  const { cameras } = useData();
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredCameras = cameras.filter(camera => {
    const matchesSearch = camera.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || camera.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatsSummary = () => {
    const total = cameras.length;
    const operational = cameras.filter(c => c.status === 'operativa').length;
    const maintenance = cameras.filter(c => c.status === 'mantenimiento').length;
    const outOfService = cameras.filter(c => c.status === 'fuera_servicio').length;
    const totalCapacity = cameras.reduce((sum, c) => sum + c.totalCapacity, 0);
    const totalOccupied = cameras.reduce((sum, c) => sum + c.occupiedCapacity, 0);

    return { total, operational, maintenance, outOfService, totalCapacity, totalOccupied };
  };

  const stats = getStatsSummary();

  if (selectedCamera) {
    return (
      <CameraDetail
        camera={selectedCamera}
        onBack={() => setSelectedCamera(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Cámaras</h1>
          <p className="text-gray-600">Gestión y monitoreo de cámaras frigoríficas</p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Cámara
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Cámaras</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-blue-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Operativas</p>
              <p className="text-2xl font-bold text-green-600">{stats.operational}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En Mantenimiento</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.maintenance}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-yellow-600 rounded"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Ocupación Total</p>
              <p className="text-2xl font-bold text-purple-600">
                {((stats.totalOccupied / stats.totalCapacity) * 100).toFixed(0)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 bg-purple-600 rounded"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar cámaras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              >
                <option value="all">Todos los estados</option>
                <option value="operativa">Operativa</option>
                <option value="mantenimiento">En Mantenimiento</option>
                <option value="fuera_servicio">Fuera de Servicio</option>
              </select>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Mostrando {filteredCameras.length} de {cameras.length} cámaras
          </p>
        </div>
      </div>

      {/* Camera Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCameras.map((camera) => (
          <CameraCard
            key={camera.id}
            camera={camera}
            onClick={() => setSelectedCamera(camera)}
          />
        ))}
      </div>

      {filteredCameras.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron cámaras</h3>
          <p className="text-gray-600">Prueba con diferentes filtros o términos de búsqueda</p>
        </div>
      )}
    </div>
  );
}