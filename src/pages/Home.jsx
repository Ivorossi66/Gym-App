import React from 'react'
import '../styles/Home.css'
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

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
                        <div className="price">$38.000<span>/mes</span></div>
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
                        <div className="price">$40.000<span>/mes</span></div>
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
                        <div className="price">$43.000<span>/mes</span></div>
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
                <h2 className="section-title">Ubicación</h2>
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
                <h2 className="section-title" style={{ color: 'white' }}>Nuestro Espacio</h2>
                <p className="section-subtitle">Equipamiento de primera calidad para tu mejor rendimiento.</p>

                <div className="gym-gallery">
                    <img src="../src/assets/img/gym1.jpeg" alt="Interior del gimnasio foto 1" loading="lazy" />
                    <img src="../src/assets/img/gym2.jpeg" alt="Interior del gimnasio foto 2" loading="lazy" />
                    <img src="../src/assets/img/gym3.jpeg" alt="Interior del gimnasio foto 3" loading="lazy" />
                    <img src="../src/assets/img/gym4.jpeg" alt="Interior del gimnasio foto 4" loading="lazy" />
                    <img src="../src/assets/img/gym5.jpeg" alt="Interior del gimnasio foto 5" loading="lazy" />
                    <img src="../src/assets/img/gym6.jpeg" alt="Interior del gimnasio foto 6" loading="lazy" />
                </div>
            </section>

            {/* Sección Contacto */}
           <section id="contacto" className="section contacto-section">
        <h2 className="section-title" style={{color: 'white'}}>Empezá tu cambio hoy</h2>
        
        <div className="contacto-container">
            
            {/* Columna Izquierda: Foto y Datos */}
            <div className="contacto-info">
                <img src="./src/assets/img/fotoMateo.jpeg" alt="Entrenador Mateo" className="trainer-photo" />
                <div className="info-text">
                    <h3>Mateo F.</h3>
                    <p className="highlight">Profesor de Educación Física</p>
                    
                    <div className="contact-data">
                        <p>📍 Cura Brochero 562 | Las Varillas, Córdoba</p>
                        
                        {/* WhatsApp con Ícono */}
                        <p 
                           style={{cursor:'pointer', color: '#25D366', fontWeight: 'bold'}} 
                           onClick={() => window.open('https://wa.me/5493533435324', '_blank')}
                        >
                            <FaWhatsapp size={24} /> +54 9 3533 43-5324
                        </p>

                        {/* Instagram con Ícono */}
                        <p 
                           style={{cursor:'pointer', color: '#E1306C', fontWeight: 'bold'}} 
                           onClick={() => window.open('https://www.instagram.com/entrenamientopersonal.mf/', '_blank')}
                        >
                            <FaInstagram size={24} /> @entrenamientopersonal.mf
                        </p>
                    </div>
                </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <form className="contacto-form" onSubmit={(e) => e.preventDefault()}>
                <h3>Envianos tu consulta</h3>
                <div className="form-group">
                    <label htmlFor="nombre">Nombre Completo</label>
                    <input type="text" id="nombre" placeholder="Ej: Juan Pérez" required />
                </div>

                <div className="form-group">
                    <label htmlFor="mensaje">Mensaje</label>
                    <textarea id="mensaje" rows="5" placeholder="Hola, me gustaría saber horarios..." required></textarea>
                </div>

                <button type="submit" className="submit-button">Enviar Mensaje</button>
            </form>

        </div>
      </section>

        </div>
    )
}