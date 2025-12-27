import React from 'react'
import '../styles/Home.css'

export const Home = () => {

    // --- LÓGICA DE WHATSAPP ---
    const handleChoosePlan = (planName) => {
        const phoneNumber = "+5493533435324";

        const message = `Hola Mateo! Me interesa saber más sobre el plan *${planName}* para empezar a entrenar.`;

        const encodedMessage = encodeURIComponent(message);

        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

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
                        <button className="plan-button" onClick={() => handleChoosePlan("2 Días")}
                        >
                            Elegir
                        </button>
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
                        <button className="plan-button" onClick={() => handleChoosePlan("3 Días")}
                        >
                            Elegir
                        </button>
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
                        <button className="plan-button" onClick={() => handleChoosePlan("Pase Libre")}
                        >
                            Elegir
                        </button>
                    </div>

                </div>
            </section>

            {/* Sección Ubicación */}
            <section id="ubicacion" className="ubicacion-section">
                <h2>Ubicación</h2>
                <div className="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388.5878524566197!2d-62.71964292456829!3d-31.863428774058715!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cb6560e334174d%3A0xafcfa739ef082f42!2sKine%20Club!5e0!3m2!1ses!2sar!4v1766843102271!5m2!1ses!2sar"
                        width="100%"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Ubicación del Gimnasio"
                    ></iframe>
                </div>
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