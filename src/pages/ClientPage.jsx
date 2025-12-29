import React from 'react';
import '../styles/ClientPage.css';


export const ClientPage = () => {
  // Datos simulados del usuario logueado
  const userInfo = {
    nombre: "Juan Pérez",
    plan: "Pase libre",
    vencimiento: "15/11/2023",
    estado: "Activo" // O "Vencido"
  };

  // Datos simulados de los planes disponibles para mostrar
  const planesDisponibles = [
    { id: 1, nombre: "2 dias", precio: "$15.000" },
    { id: 2, nombre: "3 dias", precio: "$20.000" },
    { id: 3, nombre: "Pase libre", precio: "$25.000" },
  ];

  return (
    <div className="container mt-5">
      {/* Sección de Bienvenida y Estado */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header bg-primary text-white">
          <h4>Panel de Socio</h4>
        </div>
        <div className="card-body">
          <h5 className="card-title">Bienvenido, {userInfo.nombre}</h5>
          <p className="card-text">
            Estado de tu cuota: 
            <span className={`badge ms-2 ${userInfo.estado === 'Activo' ? 'bg-success' : 'bg-danger'}`}>
              {userInfo.estado}
            </span>
          </p>
          <p>
            <strong>Plan actual:</strong> {userInfo.plan} <br />
            <strong>Vencimiento:</strong> {userInfo.vencimiento}
          </p>
        </div>
      </div>

      {/* Sección de Planes (Info) */}
      <h4 className="mb-3">Nuestros Planes</h4>
      <div className="row">
        {planesDisponibles.map((plan) => (
          <div key={plan.id} className="col-md-4 mb-3">
            <div className="card text-center h-100 border-info">
              <div className="card-header">
                {plan.nombre}
              </div>
              <div className="card-body">
                <h3 className="card-title">{plan.precio}</h3>
                <p className="card-text">Acceso mensual</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};