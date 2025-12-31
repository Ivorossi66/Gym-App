import React, { useState, useEffect } from 'react';
import { FaUsers, FaChartLine, FaDollarSign, FaExclamationCircle, FaPlus, FaTrash, FaEdit, FaSearch } from 'react-icons/fa';
// import { supabase } from '../supabase/client'; // Descomenta cuando conectes
import '../styles/AdminPage.css';

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('clientes');
  const [loading, setLoading] = useState(false);

  // --- DATOS DE EJEMPLO (MOCKS) ---
  // Úsalos para ver el diseño hasta que conectes el useEffect de abajo
  const [clients, setClients] = useState([
    { id: 1, full_name: 'Juan Pérez', email: 'juan@gmail.com', plan: 'Premium', role: 'cliente', paid: true, last_payment: '2025-12-01' },
    { id: 2, full_name: 'María García', email: 'maria@hotmail.com', plan: 'Básico', role: 'cliente', paid: true, last_payment: '2025-12-05' },
    { id: 3, full_name: 'Carlos Ruiz', email: 'carlos@yahoo.com', plan: 'Estándar', role: 'admin', paid: false, last_payment: '2025-10-10' },
  ]);

  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.paid).length,
    monthlyIncome: 45000, // Esto luego se calcula sumando pagos
    pendingPayments: clients.filter(c => !c.paid).length
  };

  /* --- LÓGICA SUPABASE (Descomentar luego) ---
  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (data) setClients(data);
      setLoading(false);
    };
    fetchProfiles();
  }, []);
  */

  return (
    <div className="admin-container">
      <div className="admin-content">

        {/* --- HEADER --- */}
        <div className="admin-header">
          <div>
            <h1>Panel de Control</h1>
            <p className="subtitle">Gestión general del gimnasio</p>
          </div>
          <button className="btn-primary-admin">
            <FaPlus /> Nuevo Cliente
          </button>
        </div>

        {/* --- STATS CARDS --- */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Total Clientes</span>
              <span className="stat-number">{stats.totalClients}</span>
            </div>
            <div className="icon-box">
                <FaUsers className="stat-icon" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Activos</span>
              <span className="stat-number active-color">{stats.activeClients}</span>
            </div>
            <div className="icon-box active-bg">
                <FaChartLine className="stat-icon active-color" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Ingresos Mes</span>
              <span className="stat-number income-color">${stats.monthlyIncome}</span>
            </div>
            <div className="icon-box income-bg">
                <FaDollarSign className="stat-icon income-color" />
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-info">
              <span className="stat-label">Pendientes</span>
              <span className="stat-number danger-color">{stats.pendingPayments}</span>
            </div>
            <div className="icon-box danger-bg">
                <FaExclamationCircle className="stat-icon danger-color" />
            </div>
          </div>
        </div>

        {/* --- TABS --- */}
        <div className="admin-tabs">
          {['clientes', 'rutinas', 'pagos'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* --- CONTENIDO DINÁMICO --- */}
        <div className="tab-content-area">
          
          {/* VISTA DE CLIENTES */}
          {activeTab === 'clientes' && (
            <div className="clients-section animate-fade-in">
              <div className="section-header">
                <h2>Listado de Usuarios</h2>
                <div className="search-box">
                    <FaSearch className="search-icon"/>
                    <input type="text" placeholder="Buscar por nombre..." />
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Plan</th>
                      <th>Rol</th>
                      <th>Estado Pago</th>
                      <th>Fecha Pago</th>
                      <th style={{textAlign: 'right'}}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map(client => (
                      <tr key={client.id}>
                        <td>
                            <div className="user-cell">
                                <div className="user-avatar">{client.full_name?.charAt(0) || 'U'}</div>
                                <div>
                                    <span className="user-name">{client.full_name || 'Sin Nombre'}</span>
                                    <span className="user-email">{client.email}</span>
                                </div>
                            </div>
                        </td>
                        <td>
                            <span className="badge plan-badge">{client.plan || 'Free'}</span>
                        </td>
                        <td>
                             {/* Lógica visual para distinguir admins */}
                            <span className={`role-text ${client.role === 'admin' ? 'role-admin' : ''}`}>
                                {client.role}
                            </span>
                        </td>
                        <td>
                          {client.paid ? (
                            <span className="status-pill status-success">Al día</span>
                          ) : (
                            <span className="status-pill status-danger">Pendiente</span>
                          )}
                        </td>
                        <td className="text-muted">{client.last_payment || '-'}</td>
                        <td className="actions-cell">
                          <button className="action-btn edit"><FaEdit /></button>
                          <button className="action-btn delete"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'rutinas' && (
            <div className="empty-state animate-fade-in">
              <h3>Gestor de Rutinas</h3>
              <p>Selecciona un cliente para asignarle una rutina nueva.</p>
              <button className="btn-secondary-admin">Crear Rutina General</button>
            </div>
          )}
          
          {activeTab === 'pagos' && (
             <div className="empty-state animate-fade-in">
             <h3>Historial de Pagos</h3>
             <p>Aquí verás el flujo de caja detallado.</p>
           </div>
          )}

        </div>
      </div>
    </div>
  );
};