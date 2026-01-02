import React, { useState, useEffect } from 'react';
import { 
  FaUsers, FaChartLine, FaDollarSign, FaExclamationCircle, 
  FaPlus, FaTrash, FaEdit, FaSearch, FaTimes, 
  FaCalendarAlt, FaDumbbell 
} from 'react-icons/fa';
import { supabase } from '../supabase/client'; 
import '../styles/AdminPage.css';

const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Función auxiliar para fechas
const isPaymentExpired = (dateString) => {
  if (!dateString) return true; 
  const paymentDate = new Date(dateString);
  const today = new Date();
  const diffTime = Math.abs(today - paymentDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays > 30; 
};

export const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('clientes');
  const [loading, setLoading] = useState(false);
  
  // --- CLIENTES ---
  const [clients, setClients] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [editingClientId, setEditingClientId] = useState(null);
  const [clientFormData, setClientFormData] = useState({
    full_name: '', email: '', plan: 'Pase libre', monthly_fee: '', status: 'Activo'
  });

  // --- RUTINAS ---
  const [routines, setRoutines] = useState([]);
  const [showRoutineForm, setShowRoutineForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Lunes');
  const [routineFormData, setRoutineFormData] = useState({
    id: null, client_id: '', name: '', goal: '', exercises: {} 
  });

  // --- PAGOS ---
  const [payments, setPayments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    client_id: '',
    amount: '',
    method: 'Efectivo',
    date: new Date().toISOString().split('T')[0] 
  });

  // ==========================================
  // 1. CARGA DE DATOS
  // ==========================================

  const fetchProfiles = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').eq('role', 'cliente').order('created_at', { ascending: false });
    if (error) console.error(error);
    else setClients(data);
    setLoading(false);
  };

  const fetchRoutines = async () => {
    const { data, error } = await supabase.from('routines').select(`*, profiles(full_name)`).order('created_at', { ascending: false });
    if (error) console.error(error);
    else setRoutines(data);
  };

  const fetchPayments = async () => {
    const { data, error } = await supabase
      .from('payments')
      .select(`*, profiles(full_name)`)
      .order('date', { ascending: false }); 
    
    if (error) console.error(error);
    else setPayments(data);
  };

  useEffect(() => {
    if (activeTab === 'clientes') fetchProfiles();
    if (activeTab === 'rutinas') { fetchProfiles(); fetchRoutines(); }
    if (activeTab === 'pagos') { fetchProfiles(); fetchPayments(); }
  }, [activeTab]);

  // ==========================================
  // 2. LÓGICA CLIENTES
  // ==========================================
  const handleClientSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...clientFormData, monthly_fee: Number(clientFormData.monthly_fee), role: 'cliente' };
      if (editingClientId) {
        await supabase.from('profiles').update(payload).eq('id', editingClientId);
      } else {
        await supabase.from('profiles').insert([{ ...payload, payment_due: true, created_at: new Date() }]);
      }
      setShowClientModal(false);
      fetchProfiles();
    } catch (error) { alert(error.message); }
  };

  const handleDeleteClient = async (id) => {
    if (window.confirm('¿Eliminar cliente?')) {
      await supabase.from('profiles').delete().eq('id', id);
      fetchProfiles();
    }
  };

  // ==========================================
  // 3. LÓGICA RUTINAS
  // ==========================================
  const saveRoutine = async () => {
    if (!routineFormData.client_id || !routineFormData.name) return alert("Faltan datos.");
    const payload = { ...routineFormData };
    
    if (routineFormData.id) await supabase.from('routines').update(payload).eq('id', routineFormData.id);
    else await supabase.from('routines').insert([payload]);
    
    setShowRoutineForm(false);
    fetchRoutines();
  };

  const deleteRoutine = async (id) => {
    if (window.confirm("¿Eliminar plan?")) {
      await supabase.from('routines').delete().eq('id', id);
      fetchRoutines();
    }
  };

  // ==========================================
  // 4. LÓGICA PAGOS
  // ==========================================
  
  const handleRegisterPayment = async (e) => {
    e.preventDefault();
    try {
        const { error: payError } = await supabase.from('payments').insert([{
            client_id: paymentFormData.client_id,
            amount: Number(paymentFormData.amount),
            method: paymentFormData.method,
            date: paymentFormData.date
        }]);
        if (payError) throw payError;

        const { error: profileError } = await supabase.from('profiles').update({
            payment_due: false, 
            last_payment_date: paymentFormData.date
        }).eq('id', paymentFormData.client_id);

        if (profileError) throw profileError;

        alert("Pago registrado y cliente actualizado correctamente.");
        setShowPaymentModal(false);
        fetchPayments();
        setPaymentFormData({ client_id: '', amount: '', method: 'Efectivo', date: new Date().toISOString().split('T')[0] });

    } catch (error) {
        alert("Error al registrar pago: " + error.message);
    }
  };

  const handlePaymentClientChange = (e) => {
      const clientId = e.target.value;
      const client = clients.find(c => c.id === clientId);
      setPaymentFormData({
          ...paymentFormData,
          client_id: clientId,
          amount: client ? client.monthly_fee : ''
      });
  };

  // --- GESTIÓN DE EJERCICIOS ---
  const handleNewRoutine = () => {
    const initialExercises = {}; DAYS_OF_WEEK.forEach(d => initialExercises[d] = []);
    setRoutineFormData({ id: null, client_id: '', name: '', goal: '', exercises: initialExercises });
    setSelectedDay('Lunes'); setShowRoutineForm(true);
  };
  const handleEditRoutine = (r) => { 
      let loaded = r.exercises || {}; DAYS_OF_WEEK.forEach(d => { if(!loaded[d]) loaded[d]=[] });
      setRoutineFormData({ id:r.id, client_id:r.client_id, name:r.name, goal:r.goal||'', exercises:loaded });
      setSelectedDay('Lunes'); setShowRoutineForm(true);
  };
  const addExerciseToDay = () => {
      const newEx = { id: Date.now(), name: '', sets: '', reps: '', rest: '', weight: '', notes: '' };
      const updated = { ...routineFormData.exercises }; updated[selectedDay] = [...updated[selectedDay], newEx];
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


  // STATS
  const stats = {
    totalClients: clients.length,
    activeClients: clients.filter(c => c.status === 'Activo').length, 
    monthlyIncome: payments
        .filter(p => p.date.startsWith(new Date().toISOString().slice(0, 7))) 
        .reduce((acc, curr) => acc + (curr.amount || 0), 0),
    pendingPayments: clients.filter(c => c.payment_due === true || isPaymentExpired(c.last_payment_date)).length
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
          {activeTab === 'clientes' && (
              <button className="btn-primary-admin" onClick={() => { setEditingClientId(null); setClientFormData({full_name:'', email:'', plan:'Pase libre', monthly_fee:'', status:'Activo'}); setShowClientModal(true); }}>
                <FaPlus /> Nuevo Cliente
              </button>
          )}
          {activeTab === 'rutinas' && !showRoutineForm && (
              <button className="btn-primary-admin" onClick={handleNewRoutine}><FaPlus /> Nuevo Plan</button>
          )}
          {activeTab === 'rutinas' && showRoutineForm && (
              <div style={{display:'flex', gap:'1rem'}}>
                  <button className="btn-cancel" onClick={() => setShowRoutineForm(false)}>Cancelar</button>
                  <button className="btn-primary-admin" onClick={saveRoutine}>Guardar Cambios</button>
              </div>
          )}
          {activeTab === 'pagos' && (
              <button className="btn-primary-admin" onClick={() => setShowPaymentModal(true)}>
                <FaPlus /> Registrar Pago
              </button>
          )}
        </div>

        {/* STATS */}
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
            <div className="stat-info"><span className="stat-label">Ingresos Reales (Mes)</span><span className="stat-number income-color">${stats.monthlyIncome}</span></div>
            <div className="icon-box income-bg"><FaDollarSign className="stat-icon income-color" /></div>
          </div>
          <div className="stat-card">
            <div className="stat-info"><span className="stat-label">Deudores</span><span className="stat-number danger-color">{stats.pendingPayments}</span></div>
            <div className="icon-box danger-bg"><FaExclamationCircle className="stat-icon danger-color" /></div>
          </div>
        </div>
        )}

        {/* TABS */}
        <div className="admin-tabs">
          {['clientes', 'rutinas', 'pagos'].map((tab) => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => { setActiveTab(tab); setShowRoutineForm(false); }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="tab-content-area">
          
          {/* === 1. CLIENTES === */}
          {activeTab === 'clientes' && (
            <div className="clients-section animate-fade-in">
               <div className="section-header"><h2>Listado de Usuarios</h2></div>
               <div className="table-responsive">
                <table className="admin-table">
                  <thead><tr><th>Usuario</th><th>Plan</th><th>Estado</th><th>Cuota</th><th>Pago</th><th>Último Pago</th><th style={{textAlign:'right'}}>Acciones</th></tr></thead>
                  <tbody>
                    {clients.map(client => {
                      const expired = isPaymentExpired(client.last_payment_date);
                      const showAsDue = client.payment_due || expired;
                      return (
                        <tr key={client.id}>
                          <td><div className="user-cell"><div className="user-avatar">{client.full_name?.charAt(0) || 'U'}</div><div><span className="user-name">{client.full_name}</span><span className="user-email">{client.email}</span></div></div></td>
                          <td><span className="badge plan-badge">{client.plan}</span></td>
                          <td><span className={`status-dot ${client.status === 'Activo' ? 'status-active' : 'status-inactive'}`}></span>{client.status}</td>
                          <td>${client.monthly_fee}</td>
                          <td>{showAsDue ? <span className="status-pill status-danger">Debe</span> : <span className="status-pill status-success">Al día</span>}</td>
                          <td>{client.last_payment_date || '-'}</td>
                          <td className="actions-cell">
                            <button className="action-btn edit" onClick={() => {setEditingClientId(client.id); setClientFormData(client); setShowClientModal(true)}}><FaEdit /></button>
                            <button className="action-btn delete" onClick={() => handleDeleteClient(client.id)}><FaTrash /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
               </div>
            </div>
          )}

          {/* === 2. RUTINAS === */}
          {activeTab === 'rutinas' && (
            <div className="routines-section animate-fade-in">
               {!showRoutineForm ? (
                 // Lista de rutinas
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
                                <p className="routine-goal">{routine.goal}</p>
                                
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
                    {routines.length === 0 && <p className="text-muted">No hay planes.</p>}
                 </div>
               ) : (
                 // Formulario Rutinas
                 <div className="routine-form-container">
                    <h3 className="form-section-title">{routineFormData.id ? 'Editar Plan' : 'Nuevo Plan'}</h3>
                    <div className="form-group" style={{display:'flex', gap:'1rem'}}>
                         <div style={{flex:1}}>
                             <label>Cliente</label>
                             <select className="form-select" value={routineFormData.client_id} onChange={(e)=>setRoutineFormData({...routineFormData, client_id:e.target.value})}>
                                 <option value="">Seleccionar...</option>
                                 {clients.map(c=><option key={c.id} value={c.id}>{c.full_name}</option>)}
                             </select>
                         </div>
                         <div style={{flex:2}}><label>Nombre</label><input className="form-input" value={routineFormData.name} onChange={(e)=>setRoutineFormData({...routineFormData, name:e.target.value})}/></div>
                    </div>
                    <div className="form-group"><label>Objetivo</label><input className="form-input" value={routineFormData.goal} onChange={(e)=>setRoutineFormData({...routineFormData, goal:e.target.value})}/></div>
                    
                    <div className="days-tabs">
                        {DAYS_OF_WEEK.map(day => (
                            <div key={day} className={`day-tab ${selectedDay === day ? 'selected' : ''}`} onClick={()=>setSelectedDay(day)}>
                                {day} {routineFormData.exercises[day]?.length > 0 && <span className="exercise-count-badge">{routineFormData.exercises[day].length}</span>}
                            </div>
                        ))}
                    </div>
                    <div className="day-content">
                        <h4 style={{color:'white', marginBottom:'1rem'}}>{selectedDay}</h4>
                        {(routineFormData.exercises[selectedDay] || []).map((ex) => (
                             <div className="exercise-card" key={ex.id}>
                                <div className="exercise-header"><h4>{ex.name || 'Nuevo Ejercicio'}</h4><button className="delete-exercise-btn" onClick={()=>removeExercise(ex.id)}><FaTrash/></button></div>
                                <div className="form-group"><input className="form-input" placeholder="Nombre Ejercicio" value={ex.name} onChange={(e)=>updateExercise(ex.id,'name',e.target.value)}/></div>
                                <div className="row-4-cols">
                                    <div><label>Series</label><input className="form-input" value={ex.sets} onChange={(e)=>updateExercise(ex.id,'sets',e.target.value)}/></div>
                                    <div><label>Reps</label><input className="form-input" value={ex.reps} onChange={(e)=>updateExercise(ex.id,'reps',e.target.value)}/></div>
                                    <div><label>Descanso</label><input className="form-input" value={ex.rest} onChange={(e)=>updateExercise(ex.id,'rest',e.target.value)}/></div>
                                    <div><label>Peso</label><input className="form-input" value={ex.weight} onChange={(e)=>updateExercise(ex.id,'weight',e.target.value)}/></div>
                                </div>
                                <div className="form-group"><input className="form-input" placeholder="Notas" value={ex.notes} onChange={(e)=>updateExercise(ex.id,'notes',e.target.value)}/></div>
                             </div>
                        ))}
                        <button className="btn-add-exercise" onClick={addExerciseToDay}><FaPlus/> Agregar Ejercicio</button>
                    </div>
                 </div>
               )}
            </div>
          )}

          {/* === 3. PAGOS (SIN PLAN) === */}
          {activeTab === 'pagos' && (
             <div className="payments-section animate-fade-in">
                <div className="section-header">
                    <h2>Registro de Pagos</h2>
                </div>
                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Método</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map(pay => (
                                <tr key={pay.id}>
                                    <td>{pay.date}</td>
                                    <td><span className="user-name">{pay.profiles?.full_name || 'Desconocido'}</span></td>
                                    <td style={{color: '#2ecc71', fontWeight:'bold'}}>${pay.amount}</td>
                                    <td>{pay.method}</td>
                                </tr>
                            ))}
                            {payments.length === 0 && <tr><td colSpan="4" style={{textAlign:'center', padding:'2rem'}}>No hay pagos registrados aún.</td></tr>}
                        </tbody>
                    </table>
                </div>
             </div>
          )}

        </div>

        {/* MODAL NUEVO PAGO */}
        {showPaymentModal && (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Registrar Nuevo Pago</h3>
                        <button className="close-btn" onClick={() => setShowPaymentModal(false)}><FaTimes /></button>
                    </div>
                    <form onSubmit={handleRegisterPayment}>
                        <div className="form-group">
                            <label>Cliente</label>
                            <select 
                                className="form-select" 
                                required
                                value={paymentFormData.client_id} 
                                onChange={handlePaymentClientChange}
                            >
                                <option value="">Seleccionar Cliente...</option>
                                {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
                            </select>
                        </div>
                        
                        <div className="form-group" style={{display:'flex', gap:'1rem'}}>
                            <div style={{flex:1}}>
                                <label>Fecha</label>
                                <input 
                                    type="date" 
                                    className="form-input" 
                                    required
                                    value={paymentFormData.date}
                                    onChange={(e) => setPaymentFormData({...paymentFormData, date: e.target.value})}
                                />
                            </div>
                            <div style={{flex:1}}>
                                <label>Monto ($)</label>
                                <input 
                                    type="number" 
                                    className="form-input" 
                                    required
                                    placeholder="Ej: 15000"
                                    value={paymentFormData.amount}
                                    onChange={(e) => setPaymentFormData({...paymentFormData, amount: e.target.value})}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Método de Pago</label>
                            <select 
                                className="form-select" 
                                value={paymentFormData.method}
                                onChange={(e) => setPaymentFormData({...paymentFormData, method: e.target.value})}
                            >
                                <option value="Efectivo">Efectivo</option>
                                <option value="Transferencia">Transferencia</option>
                            </select>
                        </div>

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={() => setShowPaymentModal(false)}>Cancelar</button>
                            <button type="submit" className="btn-submit">Confirmar Pago</button>
                        </div>
                    </form>
                </div>
            </div>
        )}

        {/* MODAL CLIENTE */}
        {showClientModal && (
           <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header"><h3>{editingClientId ? 'Editar' : 'Nuevo'} Cliente</h3><button className="close-btn" onClick={()=>setShowClientModal(false)}><FaTimes/></button></div>
              <form onSubmit={handleClientSubmit}>
                 <div className="form-group"><label>Nombre</label><input className="form-input" required value={clientFormData.full_name} onChange={(e)=>setClientFormData({...clientFormData, full_name:e.target.value})}/></div>
                 <div className="form-group"><label>Email</label><input className="form-input" value={clientFormData.email} onChange={(e)=>setClientFormData({...clientFormData, email:e.target.value})}/></div>
                 <div className="form-group" style={{display:'flex', gap:'1rem'}}>
                    <div style={{flex:1}}><label>Plan</label><select className="form-select" value={clientFormData.plan} onChange={(e)=>setClientFormData({...clientFormData, plan:e.target.value})}><option value="2 días">2 días</option><option value="3 días">3 días</option><option value="Pase libre">Pase libre</option></select></div>
                    <div style={{flex:1}}><label>Cuota</label><input type="number" className="form-input" value={clientFormData.monthly_fee} onChange={(e)=>setClientFormData({...clientFormData, monthly_fee:e.target.value})}/></div>
                 </div>
                 <div className="form-group"><label>Estado</label><select className="form-select" value={clientFormData.status} onChange={(e)=>setClientFormData({...clientFormData, status:e.target.value})}><option value="Activo">Activo</option><option value="Inactivo">Inactivo</option></select></div>
                 <div className="modal-actions"><button type="button" className="btn-cancel" onClick={()=>setShowClientModal(false)}>Cancelar</button><button type="submit" className="btn-submit">Guardar</button></div>
              </form>
            </div>
           </div>
        )}

      </div>
    </div>
  );
};