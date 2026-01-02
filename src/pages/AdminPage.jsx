import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaChartLine, FaDollarSign, FaExclamationCircle,
  FaPlus, FaTrash, FaEdit, FaSearch, FaTimes,
  FaCalendarAlt, FaDumbbell
} from 'react-icons/fa';
import { supabase } from '../supabase/client';
import '../styles/AdminPage.css';

// Constante para los días
const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('clientes');
  const [loading, setLoading] = useState(false);

  // --- ESTADOS DE CLIENTES ---
  const [clients, setClients] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    full_name: '',
    email: '',
    plan: 'Pase libre',
    monthly_fee: '',
    status: 'Activo'
  });

  // --- ESTADOS DE RUTINAS ---
  const [routines, setRoutines] = useState([]);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [routineFormData, setRoutineFormData] = useState({
    id: null,
    client_id: '',
    name: '',
    goal: '',
    exercises: {} // { "Lunes": [...], "Martes": [...] }
  });

  // ==========================================
  // 1. CARGA DE DATOS (FETCH)
  // ==========================================

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'cliente')
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching clients:", error);
    else setClients(data);
    setLoading(false);
  };

  const fetchRoutines = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('routines')
      .select(`*, profiles(full_name)`)
      .order('created_at', { ascending: false });

    if (error) console.error("Error fetching routines:", error);
    else setRoutines(data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'clientes') fetchProfiles();
    if (activeTab === 'rutinas') {
      fetchProfiles(); // Necesitamos clientes para el select
      fetchRoutines();
    }
  }, [activeTab]);

  // ==========================================
  // 2. LÓGICA DE CLIENTES (Crear, Editar, Borrar)
  // ==========================================

  const handleOpenCreateClient = () => {
    setEditingClientId(null);
    setClientFormData({ full_name: '', email: '', plan: 'Pase libre', monthly_fee: '', status: 'Activo' });
    setShowClientModal(true);
  };

  const handleEditClient = (client) => {
    setEditingClientId(client.id);
    setClientFormData({
      full_name: client.full_name,
      email: client.email || '',
      plan: client.plan,
      monthly_fee: client.monthly_fee,
      status: client.status
    });
    setShowClientModal(true);
  };

  const handleDeleteClient = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) alert('Error: ' + error.message);
    else fetchProfiles();
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        full_name: clientFormData.full_name,
        email: clientFormData.email,
        plan: clientFormData.plan,
        monthly_fee: Number(clientFormData.monthly_fee),
        status: clientFormData.status,
        role: 'cliente'
      };

      if (editingClientId) {
        // Update
        const { error } = await supabase.from('profiles').update(payload).eq('id', editingClientId);
        if (error) throw error;
      } else {
        // Insert (con defaults)
        const { error } = await supabase.from('profiles').insert([{ ...payload, payment_due: true, created_at: new Date() }]);
        if (error) throw error;
      }
      setShowClientModal(false);
      fetchProfiles();
      alert(editingClientId ? 'Cliente actualizado' : 'Cliente creado');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  // ==========================================
  // 3. LÓGICA DE RUTINAS
  // ==========================================

  const handleNewRoutine = () => {
    const initialExercises = {};
    DAYS_OF_WEEK.forEach(day => initialExercises[day] = []);
    setRoutineFormData({
      id: null, client_id: '', name: '', goal: '', exercises: initialExercises
    });
    setSelectedDay('Lunes');
    setShowRoutineForm(true);
  };

  const handleEditRoutine = (routine) => {
    let loadedExercises = routine.exercises || {};
    // Asegurar estructura
    DAYS_OF_WEEK.forEach(day => {
      if (!loadedExercises[day]) loadedExercises[day] = [];
    });
    setRoutineFormData({
      id: routine.id,
      client_id: routine.client_id,
      name: routine.name,
      goal: routine.goal || '',
      exercises: loadedExercises
    });
    setSelectedDay('Lunes');
    setShowRoutineForm(true);
  };

  const saveRoutine = async () => {
    if (!routineFormData.client_id || !routineFormData.name) {
      alert("Selecciona un cliente y pon un nombre al plan.");
      return;
    }
    const payload = {
      client_id: routineFormData.client_id,
      name: routineFormData.name,
      goal: routineFormData.goal,
      exercises: routineFormData.exercises
    };

    let error;
    if (routineFormData.id) {
      const res = await supabase.from('routines').update(payload).eq('id', routineFormData.id);
      error = res.error;
    } else {
      const res = await supabase.from('routines').insert([payload]);
      error = res.error;
    }

    if (error) alert("Error: " + error.message);
    else {
      alert("Rutina guardada");
      setShowRoutineForm(false);
      fetchRoutines();
    }
  };

  const deleteRoutine = async (id) => {
    if (!window.confirm("¿Eliminar este plan?")) return;
    await supabase.from('routines').delete().eq('id', id);
    fetchRoutines();
  };

  // --- REGISTRAR PAGO ---
  const handleTogglePayment = async (client) => {
    // Si 'payment_due' es true, significa que DEBE. Al tocarlo, va a PAGAR.
    const isPaying = client.payment_due;

    const confirmMessage = isPaying
      ? `¿Confirmar pago de la cuota de ${client.full_name}?`
      : `¿Marcar a ${client.full_name} nuevamente como PENDIENTE de pago?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      const updateData = {
        // Invertimos el estado: Si debía (true) -> ahora no debe (false)
        payment_due: !isPaying,
        // Si está pagando, actualizamos la fecha a HOY. Si lo pasamos a pendiente, dejamos la fecha vieja o null.
        last_payment_date: isPaying ? new Date() : client.last_payment_date
      };

      const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', client.id);

      if (error) throw error;

      // Recargamos la lista para ver el cambio visualmente
      fetchProfiles();

    } catch (error) {
      alert('Error al registrar pago: ' + error.message);
    }
  };

  // --- Gestión de Ejercicios ---
  const addExerciseToDay = () => {
    const newEx = { id: Date.now(), name: '', sets: '', reps: '', rest: '', weight: '', notes: '' };
    const updated = { ...routineFormData.exercises };
    updated[selectedDay] = [...updated[selectedDay], newEx];
    setRoutineFormData({ ...routineFormData, exercises: updated });
  };

  const updateExercise = (id, field, value) => {
    const updated = { ...routineFormData.exercises };
    updated[selectedDay] = updated[selectedDay].map(ex => ex.id === id ? { ...ex, [field]: value } : ex);
    setRoutineFormData({ ...routineFormData, exercises: updated });
  };

  const removeExercise = (id) => {
    const updated = { ...routineFormData.exercises };
    updated[selectedDay] = updated[selectedDay].filter(ex => ex.id !== id);
    setRoutineFormData({ ...routineFormData, exercises: updated });
  };

  // ==========================================
  // 4. STATS Y RENDER
  // ==========================================
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Activo').length,
    monthlyIncome: clients.reduce((acc, curr) => acc + (curr.monthly_fee || 0), 0),
    pendingPayments: clients.filter(c => c.payment_due === true).length
  };

  // --- FUNCIÓN PARA CALCULAR VENCIMIENTO ---
  const isPaymentExpired = (dateString) => {
    if (!dateString) return true; // Si nunca pagó, está vencido
    const paymentDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today - paymentDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 30; // Devuelve true si pasaron más de 30 días
  };

  return (
    <div className="admin-container">
      <div className="admin-content">

        {/* HEADER */}
        <div className="admin-header">
          <div>
            <h1>Panel de Control</h1>
            <p className="subtitle">Gestión general del gimnasio</p>
          </div>
          {/* Botones Dinámicos */}
          {activeTab === 'clientes' && (
            <button className="btn-primary-admin" onClick={handleOpenCreateClient}>
              <FaPlus /> Nuevo Cliente
            </button>
          )}
          {activeTab === 'rutinas' && !showRoutineForm && (
            <button className="btn-primary-admin" onClick={handleNewRoutine}>
              <FaPlus /> Nuevo Plan
            </button>
          )}
          {activeTab === 'rutinas' && showRoutineForm && (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-cancel" onClick={() => setShowRoutineForm(false)}>Cancelar</button>
              <button className="btn-primary-admin" onClick={saveRoutine}>Guardar Cambios</button>
            </div>
          )}
        </div>

        {/* STATS (Ocultas si estamos editando rutina) */}
        {!showRoutineForm && (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-info"><span className="stat-label">Total Clientes</span><span className="stat-number">{stats.totalClients}</span></div>
              <div className="icon-box"><FaUsers className="stat-icon" /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info"><span className="stat-label">Activos</span><span className="stat-number active-color">{stats.activeClients}</span></div>
              <div className="icon-box active-bg"><FaChartLine className="stat-icon active-color" /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info"><span className="stat-label">Ingresos Mes</span><span className="stat-number income-color">${stats.monthlyIncome}</span></div>
              <div className="icon-box income-bg"><FaDollarSign className="stat-icon income-color" /></div>
            </div>
            <div className="stat-card">
              <div className="stat-info"><span className="stat-label">Pendientes</span><span className="stat-number danger-color">{stats.pendingPayments}</span></div>
              <div className="icon-box danger-bg"><FaExclamationCircle className="stat-icon danger-color" /></div>
            </div>
          </div>
        )}

        {/* NAVEGACIÓN TABS */}
        <div className="admin-tabs">
          {['clientes', 'rutinas', 'pagos'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab); setShowRoutineForm(false); }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ÁREA DE CONTENIDO */}
        <div className="tab-content-area">

          {/* === PESTAÑA 1: CLIENTES === */}
          {activeTab === 'clientes' && (
            <div className="clients-section animate-fade-in">
              <div className="section-header">
                <h2>Listado de Usuarios</h2>
                <div className="search-box"><FaSearch className="search-icon" /><input type="text" placeholder="Buscar..." /></div>
              </div>
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr><th>Usuario</th><th>Plan</th><th>Estado</th><th>Cuota</th><th>Pago</th><th>Último Pago</th><th style={{ textAlign: 'right' }}>Acciones</th></tr>
                  </thead>
                  <tbody>
                    {clients.map(client => {
                      // 1. CALCULAMOS EL ESTADO EN CADA FILA
                      const expired = isPaymentExpired(client.last_payment_date);
                      // El cliente "Debe" visualmente si: Supabase dice true O pasaron 30 días
                      const showAsDue = client.payment_due || expired;

                      return (
                        <tr key={client.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-avatar">{client.full_name?.charAt(0) || 'U'}</div>
                              <div>
                                <span className="user-name">{client.full_name}</span>
                                <span className="user-email">{client.email}</span>
                              </div>
                            </div>
                          </td>
                          <td><span className="badge plan-badge">{client.plan}</span></td>
                          <td>
                            <span className={`status-dot ${client.status === 'Activo' ? 'status-active' : 'status-inactive'}`}></span>
                            {client.status}
                          </td>
                          <td>${client.monthly_fee}</td>

                          {/* 2. CELDA DE ESTADO DE PAGO (INTELIGENTE) */}
                          <td>
                            {showAsDue ? (
                              // Mostramos rojo si debe O si venció
                              <span className="status-pill status-danger">
                                {client.payment_due ? 'Debe' : 'Vencido'}
                              </span>
                            ) : (
                              <span className="status-pill status-success">Al día</span>
                            )}
                          </td>

                          <td className="text-muted">{client.last_payment_date || '-'}</td>

                          <td className="actions-cell">
                            {/* 3. BOTÓN DE ACCIÓN (INTELIGENTE) */}
                            <button
                              // Si showAsDue es true (rojo/vencido), mostramos botón VERDE ($) para cobrar.
                              // Si está al día, mostramos botón ROJO (X) para cancelar.
                              className={`action-btn ${showAsDue ? 'pay' : 'undo'}`}
                              title={showAsDue ? "Registrar Pago" : "Deshacer Pago"}
                              onClick={() => handleTogglePayment(client)}
                            >
                              {showAsDue ? <FaDollarSign /> : <FaTimes />}
                            </button>

                            <button className="action-btn edit" onClick={() => handleEditClient(client)}>
                              <FaEdit />
                            </button>

                            <button className="action-btn delete" onClick={() => handleDeleteClient(client.id)}>
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {clients.length === 0 && (
                      <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No hay clientes.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* === PESTAÑA 2: RUTINAS === */}
          {activeTab === 'rutinas' && (
            <div className="routines-section animate-fade-in">

              {/* VISTA A: LISTA DE TARJETAS */}
              {!showRoutineForm && (
                <div>
                  <div className="section-header"><h2>Planes de Entrenamiento</h2></div>
                  {routines.map(routine => {
                    const ex = routine.exercises || {};
                    const activeDays = DAYS_OF_WEEK.filter(d => ex[d] && ex[d].length > 0).length;
                    const totalEx = DAYS_OF_WEEK.reduce((acc, d) => acc + (ex[d]?.length || 0), 0);

                    return (
                      <div className="routine-card" key={routine.id}>
                        <div className="routine-header">
                          <h3 className="routine-title">
                            {routine.name}
                            <span className="client-badge">{routine.profiles?.full_name || 'Sin Asignar'}</span>
                          </h3>
                          <div className="actions-cell">
                            <button className="action-btn edit" onClick={() => handleEditRoutine(routine)}><FaEdit /></button>
                            <button className="action-btn delete" onClick={() => deleteRoutine(routine.id)}><FaTrash /></button>
                          </div>
                        </div>
                        <p className="routine-goal">{routine.goal || 'Sin objetivo definido'}</p>
                        <div className="routine-meta">
                          <div className="meta-item"><FaCalendarAlt /> {activeDays} días activos</div>
                          <div className="meta-item"><FaDumbbell /> {totalEx} ejercicios</div>
                        </div>
                        <div className="week-preview">
                          {DAYS_OF_WEEK.map(day => (
                            <div key={day} className={`day-indicator ${(ex[day] && ex[day].length > 0) ? 'active-day' : ''}`}>
                              {day.substring(0, 3)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                  {routines.length === 0 && <p className="text-muted">No hay planes creados aún.</p>}
                </div>
              )}

              {/* VISTA B: FORMULARIO DE EDICIÓN */}
              {showRoutineForm && (
                <div className="routine-form-container">
                  <h3 className="form-section-title">{routineFormData.id ? 'Editar Plan de Entrenamiento' : 'Nuevo Plan de Entrenamiento'}</h3>

                  <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <label>Cliente</label>
                      <select className="form-select" value={routineFormData.client_id} onChange={(e) => setRoutineFormData({ ...routineFormData, client_id: e.target.value })}>
                        <option value="">Seleccionar Cliente...</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                      </select>
                    </div>
                    <div style={{ flex: 2 }}>
                      <label>Nombre del Plan</label>
                      <input type="text" className="form-input" placeholder="Ej: Plan de Fuerza 4 Semanas" value={routineFormData.name} onChange={(e) => setRoutineFormData({ ...routineFormData, name: e.target.value })} />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Objetivo del Plan</label>
                    <input type="text" className="form-input" placeholder="Ej: Aumento de masa muscular en tren superior" value={routineFormData.goal} onChange={(e) => setRoutineFormData({ ...routineFormData, goal: e.target.value })} />
                  </div>

                  <h3 className="form-section-title" style={{ marginTop: '2rem' }}>Planificación Semanal</h3>

                  {/* TABS DE DÍAS (Lunes, Martes...) */}
                  <div className="days-tabs">
                    {DAYS_OF_WEEK.map(day => {
                      const count = routineFormData.exercises[day]?.length || 0;
                      return (
                        <div key={day} className={`day-tab ${selectedDay === day ? 'selected' : ''}`} onClick={() => setSelectedDay(day)}>
                          {day}
                          {count > 0 && <span className="exercise-count-badge">{count}</span>}
                        </div>
                      )
                    })}
                  </div>

                  {/* LISTA DE EJERCICIOS DEL DÍA */}
                  <div className="day-content animate-fade-in">
                    <h4 style={{ color: 'white', marginBottom: '1rem' }}>{selectedDay}</h4>

                    {(routineFormData.exercises[selectedDay] || []).map((exercise, index) => (
                      <div className="exercise-card" key={exercise.id}>
                        <div className="exercise-header">
                          <h4>Ejercicio {index + 1}</h4>
                          <button className="delete-exercise-btn" onClick={() => removeExercise(exercise.id)}><FaTrash /></button>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-input" placeholder="Nombre del Ejercicio (Ej: Press Banca)" value={exercise.name} onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)} />
                        </div>
                        <div className="row-4-cols">
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>Series</label>
                            <input type="text" className="form-input" placeholder="4" value={exercise.sets} onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>Repeticiones</label>
                            <input type="text" className="form-input" placeholder="8-10" value={exercise.reps} onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>Descanso (s)</label>
                            <input type="text" className="form-input" placeholder="90" value={exercise.rest} onChange={(e) => updateExercise(exercise.id, 'rest', e.target.value)} />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.8rem' }}>Peso</label>
                            <input type="text" className="form-input" placeholder="70kg" value={exercise.weight} onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)} />
                          </div>
                        </div>
                        <div className="form-group">
                          <input type="text" className="form-input" placeholder="Notas" value={exercise.notes} onChange={(e) => updateExercise(exercise.id, 'notes', e.target.value)} />
                        </div>
                      </div>
                    ))}

                    <button className="btn-add-exercise" onClick={addExerciseToDay}>
                      <FaPlus /> Agregar Ejercicio
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* === PESTAÑA 3: PAGOS === */}
          {activeTab === 'pagos' && (
            <div className="empty-state animate-fade-in">
              <h3>Historial de Pagos</h3>
              <p>Aquí verás el flujo de caja detallado.</p>
            </div>
          )}
        </div>

        {/* ================= MODAL DE CLIENTE (Reutilizable) ================= */}
        {showClientModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingClientId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
                <button className="close-btn" onClick={() => setShowClientModal(false)}><FaTimes /></button>
              </div>
              <form onSubmit={handleClientSubmit}>
                <div className="form-group">
                  <label>Nombre Completo</label>
                  <input type="text" className="form-input" required value={clientFormData.full_name} onChange={(e) => setClientFormData({ ...clientFormData, full_name: e.target.value })} />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-input" value={clientFormData.email} onChange={(e) => setClientFormData({ ...clientFormData, email: e.target.value })} />
                </div>
                <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <label>Plan</label>
                    <select className="form-select" value={clientFormData.plan} onChange={(e) => setClientFormData({ ...clientFormData, plan: e.target.value })}>
                      <option value="2 días">2 días</option>
                      <option value="3 días">3 días</option>
                      <option value="Pase libre">Pase libre</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Cuota ($)</label>
                    <input type="number" className="form-input" required value={clientFormData.monthly_fee} onChange={(e) => setClientFormData({ ...clientFormData, monthly_fee: e.target.value })} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Estado</label>
                  <select className="form-select" value={clientFormData.status} onChange={(e) => setClientFormData({ ...clientFormData, status: e.target.value })}>
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="button" className="btn-cancel" onClick={() => setShowClientModal(false)}>Cancelar</button>
                  <button type="submit" className="btn-submit">{editingClientId ? 'Actualizar' : 'Guardar'}</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};