// src/components/DesktopLanding.tsx
import React from 'react';
import QRCode from "react-qr-code";

// 1. Importa ambas imágenes: el preview de la app y el nuevo fondo
import appPreview from '../assets/app-preview.png';
import desktopBackground from '../assets/desktop-background.png';

const DesktopLanding: React.FC = () => {
  const appUrl = window.location.href;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
        
        {/* --- SECCIÓN IZQUIERDA (SIN CAMBIOS) --- */}
        <div className="flex flex-col items-start text-left">
          <h1 className="text-6xl font-bold text-gray-800 leading-tight">
            ¡Construyendo &<br />Fortaleciendo<br />Nuestro Futuro!
          </h1>
          <p className="mt-6 text-lg text-gray-600 max-w-md">
            Fomentamos el ahorro, apoyamos tus metas y compartimos el éxito entre todos los socios de nuestra comunidad.
          </p>
          <div className="mt-12 p-6 bg-gray-50 rounded-2xl shadow-sm flex items-center gap-6">
            <div className="p-2 bg-white rounded-lg">
              <QRCode
                value={appUrl}
                size={128}
                bgColor="#FFFFFF"
                fgColor="#000000"
                level="L"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Accede desde tu móvil</h2>
              <p className="mt-1 text-gray-600">
                Escanea el código QR con la cámara de tu teléfono para abrir la aplicación.
              </p>
            </div>
          </div>
        </div>

        {/* ===== SECCIÓN DERECHA (ACTUALIZADA CON FONDO) ===== */}
        <div className="relative flex justify-center items-center p-4">
          {/* 2. La imagen de fondo, posicionada absolutamente detrás */}
          <img 
            src={desktopBackground}
            alt="Fondo decorativo"
            className="absolute inset-0 w-full h-full object-cover rounded-3xl"
          />
          
          {/* 3. El preview de la app, posicionado de forma relativa para que quede por encima */}
          <img 
            src={appPreview} 
            alt="App Preview" 
            className="relative max-w-xs md:max-w-sm drop-shadow-2xl" // Añadimos una sombra para más profundidad
          />
        </div>
      </div>
    </div>
  );
};

export default DesktopLanding;