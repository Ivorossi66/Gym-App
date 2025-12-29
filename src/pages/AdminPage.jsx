import React, { useState } from 'react';
import { FaUsers, FaChartLine, FaDollarSign, FaExclamationCircle, FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
import '../styles/AdminPage.css';
import '../index.css';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('clientes'); // Controla qué sección vemos

  // --- DATOS DE EJEMPLO (MOCKS) ---
  // Estos datos luego vendrán de tu base de datos Supabase
  const stats = {
    totalClients: 12,
    activeClients: 9,
    monthlyIncome: 45000,
    pendingPayments: 3
  };

  const [clients, setClients] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@gmail.com', plan: 'Premium', status: 'Activo', paid: true, lastPayment: '2025-12-01' },
    { id: 2, name: 'María García', email: 'maria@hotmail.com', plan: 'Básico', status: 'Activo', paid: true, lastPayment: '2025-12-05' },
    { id: 3, name: 'Carlos Ruiz', email: 'carlos@yahoo.com', plan: 'Estándar', status: 'Inactivo', paid: false, lastPayment: '2025-10-10' },
  ]);

  return (
    <div className="admin-container">
      <div className="admin-content">

        {/* --- HEADER --- */}
        <div className="admin-header">
          <h1>Panel de Administración</h1>
          <button className="btn btn-success">
            + Nuevo Cliente
          </button>
        </div>

        {/* --- STATS CARDS (Tarjetas de arriba) --- */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Clientes</span>
              <span className="stat-number">{stats.totalClients}</span>
            </div>
            <FaUsers className="stat-icon" />
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Clientes Activos</span>
              <span className="stat-number active-color">{stats.activeClients}</span>
            </div>
            <FaChartLine className="stat-icon active-color" />
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Ingresos del Mes</span>
              <span className="stat-number income-color">${stats.monthlyIncome}</span>
            </div>
            <FaDollarSign className="stat-icon income-color" />
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Pagos Atrasados</span>
              <span className="stat-number danger-color">{stats.pendingPayments}</span>
            </div>
            <FaExclamationCircle className="stat-icon danger-color" />
          </div>
        </div>

        {/* --- TABS DE NAVEGACIÓN --- */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'clientes' ? 'active' : ''}`}
            onClick={() => setActiveTab('clientes')}
          >
            Clientes
          </button>
          <button
            className={`tab-btn ${activeTab === 'rutinas' ? 'active' : ''}`}
            onClick={() => setActiveTab('rutinas')}
          >
            Rutinas
          </button>
          <button
            className={`tab-btn ${activeTab === 'pagos' ? 'active' : ''}`}
            onClick={() => setActiveTab('pagos')}
          >
            Pagos
          </button>
        </div>

        {/* --- CONTENIDO DINÁMICO --- */}
        <div className="tab-content">

          {/* VISTA DE CLIENTES */}
          {activeTab === 'clientes' && (
            <div className="clients-section">
              <div className="section-header">
                <h2>Gestión de Clientes</h2>
                {/* Este botón abrirá el modal más adelante */}
                <button className="btn-primary-admin">
                  <FaPlus /> Nuevo Cliente
                </button>
              </div>

              {/* Tabla de Clientes */}
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Email</th>
                      <th>Plan</th>
                      <th>Estado</th>
                      <th>Pago al Día</th>
                      <th>Último Pago</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td>{client.name}</td>
                        <td className="text-muted">{client.email}</td>
                        <td><span className={`badge plan-${client.plan.toLowerCase()}`}>{client.plan}</span></td>
                        <td>
                          {/* Bolita de estado (verde/gris) */}
                          <span className={`status-dot ${client.status === 'Activo' ? 'status-active' : 'status-inactive'}`}></span>
                          {client.status}
                        </td>
                        <td>
                          {client.paid ? (
                            <span className="tag-success">Sí</span>
                          ) : (
                            <span className="tag-danger">No</span>
                          )}
                        </td>
                        <td>{client.lastPayment}</td>
                        <td className="actions-cell">
                          <button className="action-btn edit" title="Editar"><FaEdit /></button>
                          <button className="action-btn delete" title="Eliminar"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VISTA DE RUTINAS (Placeholder por ahora) */}
          {activeTab === 'rutinas' && (
            <div className="empty-state">
              <h3>Gestor de Rutinas</h3>
              <p>Aquí construiremos el creador de rutinas en el siguiente paso.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}