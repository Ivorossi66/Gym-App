import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase/client';
import { FaSignOutAlt, FaDumbbell, FaRunning } from 'react-icons/fa';
import '../styles/ClientPage.css'; // Asegúrate de importar el CSS nuevo

const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

export const ClientPage = () => {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [routine, setRoutine] = useState(null);
  const [selectedDay, setSelectedDay] = useState('Lunes');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. Obtener usuario actual
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // 2. Obtener Perfil (Nombre, Plan, Deudas)
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        setProfile(profileData);

        // 3. Obtener Rutina asignada
        // Buscamos la primera rutina que tenga este client_id
        const { data: routineData } = await supabase
          .from('routines')
          .select('*')
          .eq('client_id', user.id)
          .limit(1) // Asumimos 1 rutina activa por ahora
          .single();

        if (routineData) {
            setRoutine(routineData);
            
            // Opcional: Seleccionar el día actual automáticamente
            const todayIndex = new Date().getDay(); // 0 = Domingo, 1 = Lunes...
            const mapDays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            // Si el día actual existe en tu array DAYS, úsalo, si no Lunes
            const currentDayName = mapDays[todayIndex];
            if(DAYS.includes(currentDayName)) setSelectedDay(currentDayName);
        }

      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  if (loading) return <div className="client-container"><h2>Cargando tu perfil...</h2></div>;

  return (
    <div className="client-container">
      <div className="client-content">
        
        {/* --- HEADER --- */}
        <div className="client-header" style={{display: 'flex', justifyContent:'space-between', alignItems:'center'}}>
            <div>
                <h1>Hola, <span>{profile?.full_name?.split(' ')[0] || 'Atleta'}</span></h1>
                <p style={{color: '#B1A7A6'}}>Vamos a entrenar hoy.</p>
            </div>
            <button onClick={handleLogout} className="btn-cancel" style={{fontSize:'0.9rem'}}>
                <FaSignOutAlt /> Salir
            </button>
        </div>

        {/* --- ESTADO DEL USUARIO --- */}
        <div className="status-grid">
            <div className="status-card">
                <span className="status-label">Tu Plan</span>
                <span className="status-value">{profile?.plan || 'Sin Plan'}</span>
            </div>
            <div className="status-card">
                <span className="status-label">Estado</span>
                <span className={`status-value ${profile?.status === 'Activo' ? 'status-ok' : 'status-warn'}`}>
                    {profile?.status || '-'}
                </span>
            </div>
            <div className="status-card">
                <span className="status-label">Cuota</span>
                {/* Lógica: Si payment_due es FALSE, está pagado (OK) */}
                <span className={`status-value ${!profile?.payment_due ? 'status-ok' : 'status-warn'}`}>
                    {!profile?.payment_due ? 'Al Día' : 'Vencida'}
                </span>
            </div>
        </div>

        {/* --- RUTINA --- */}
        <div className="routine-section">
            <h2>Tu Rutina Actual</h2>
            
            {!routine ? (
                <div className="routine-viewer" style={{textAlign:'center', padding:'3rem'}}>
                    <FaRunning style={{fontSize:'3rem', color:'var(--color-tercero)', marginBottom:'1rem'}}/>
                    <p>Aún no tienes una rutina asignada.</p>
                    <small>Habla con tu entrenador para que cargue tu plan.</small>
                </div>
            ) : (
                <div className="routine-viewer">
                    <div className="routine-info">
                        <h3 style={{color:'white', margin:0}}>{routine.name}</h3>
                        <p className="routine-goal-text">{routine.goal}</p>
                    </div>

                    {/* Selector de Días */}
                    <div className="client-days-tabs">
                        {DAYS.map(day => {
                            const hasEx = routine.exercises?.[day]?.length > 0;
                            return (
                                <div 
                                    key={day}
                                    className={`client-day-tab ${selectedDay === day ? 'active' : ''}`}
                                    onClick={() => setSelectedDay(day)}
                                    style={{opacity: hasEx ? 1 : 0.5}} // Opaco si no tiene ejercicios
                                >
                                    {day}
                                </div>
                            )
                        })}
                    </div>

                    {/* Lista de Ejercicios */}
                    <div className="day-exercises animate-fade-in">
                        <h4 style={{marginBottom:'1rem', color:'var(--color-sexto)'}}>{selectedDay}</h4>
                        
                        {(!routine.exercises?.[selectedDay] || routine.exercises[selectedDay].length === 0) ? (
                            <p style={{color:'gray', fontStyle:'italic'}}>Hoy es día de descanso (o no hay ejercicios cargados).</p>
                        ) : (
                            routine.exercises[selectedDay].map((ex, i) => (
                                <div className="client-exercise-card" key={i}>
                                    <div className="ex-header">
                                        <span className="ex-name">{ex.name}</span>
                                        <FaDumbbell style={{color:'var(--color-tercero)'}}/>
                                    </div>
                                    <div className="ex-stats">
                                        <div className="stat-box"><small>Series</small><span>{ex.sets || '-'}</span></div>
                                        <div className="stat-box"><small>Reps</small><span>{ex.reps || '-'}</span></div>
                                        <div className="stat-box"><small>Peso</small><span>{ex.weight || '-'}</span></div>
                                        <div className="stat-box"><small>Descanso</small><span>{ex.rest || '-'}</span></div>
                                    </div>
                                    {ex.notes && (
                                        <div className="ex-notes">
                                            📝 {ex.notes}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};