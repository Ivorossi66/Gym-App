import React from 'react'
import '../styles/Home.css'

export const Home = () => {
    return (
        <div className="home-container">

            {/* Sección Inicio (Hero) */}
            <section id="inicio" className="section hero-section">
                <div className="overlay">
                    <h1>Transforma tu cuerpo, transforma tu vida.</h1>
                    <p>Ambiente diseñado para impulsarte a alcanzar tu mejor versión.</p>
                    <button
                        className="cta-button"
                        onClick={() => document.getElementById('planes').scrollIntoView({ behavior: 'smooth' })}
                    >
                        Empezar Ahora
                    </button>
                </div>
            </section>

            {/* Sección Planes */}
            <section id="planes" className="section planes-section">
        <h2 className="section-title">Elegí tu Plan</h2>
        
        <div className="cards-container">
            
            {/* Plan 1: 2 Días */}
            <div className="plan-card">
                <h3>2 Días</h3>
                <div className="price">$40.000<span>/mes</span></div>
                <ul>
                    <li>Acceso 2 veces por semana</li>
                    <li>Rutina de adaptación</li>
                    <li>Ideal para empezar</li>
                </ul>
                <button className="plan-button">Elegir</button>
            </div>

            {/* Plan 2: 3 Días (Destacado visualmente) */}
            <div className="plan-card featured">
                <div className="tag">Recomendado</div>
                <h3>3 Días</h3>
                <div className="price">$43.000<span>/mes</span></div>
                <ul>
                    <li>Acceso 3 veces por semana</li>
                    <li>Rutina dividida</li>
                    <li>Seguimiento de progreso</li>
                </ul>
                <button className="plan-button">Elegir</button>
            </div>

            {/* Plan 3: Pase Libre */}
            <div className="plan-card">
                <h3>Pase Libre</h3>
                <div className="price">$45.000<span>/mes</span></div>
                <ul>
                    <li>Acceso ilimitado</li>
                    <li>Entrená cuando quieras</li>
                    <li>Rutina personalizada completa</li>
                </ul>
                <button className="plan-button">Elegir</button>
            </div>

        </div>
      </section>

            {/* Sección Ubicación */}
            <section id="ubicacion" className="section ubicacion-section">
                <h2>Ubicación</h2>
                <p>Mapa de Google Maps aquí...</p>
            </section>

            {/* Sección Gimnasio (Fotos) */}
            <section id="gimnasio" className="section gym-section">
                <h2>El Gimnasio</h2>
                <p>Galería de fotos...</p>
            </section>

            {/* Sección Contacto */}
            <section id="contacto" className="section contacto-section">
                <h2>Contacto</h2>
                <div className="contacto-grid">
                    <div className="foto-mateo">Foto Mateo</div>
                    <div className="formulario">Formulario</div>
                </div>
            </section>

        </div>
    )
}