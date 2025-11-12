// src/components/ProfileMenu.tsx
import React, { useRef } from 'react';

interface ProfileMenuProps {
  onClose: () => void;
  onLogout: () => void;
  onPhotoChange: (file: File) => void;
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ onClose, onLogout, onPhotoChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPhotoChange(file);
    }
  };

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  return (
    // Backdrop para cerrar el menú al hacer clic fuera
    <div className="fixed inset-0 z-40" onClick={onClose}>
      {/* Contenedor del Menú */}
      <div 
        className="fixed top-24 right-6 bg-white rounded-lg shadow-xl w-64 z-50 p-2"
        onClick={(e) => e.stopPropagation()} // Evita que el clic en el menú lo cierre
      >
        <ul className="text-gray-700">
          {/* Opción para cambiar foto */}
          <li className="p-1">
            <label 
              onClick={handleLabelClick}
              className="block px-4 py-2 text-sm rounded-md hover:bg-gray-100 cursor-pointer"
            >
              Cambiar foto de perfil
            </label>
            <input 
              type="file" 
              accept="image/png, image/jpeg" 
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" 
            />
          </li>

          {/* Opción para cambiar contraseña (funcionalidad pendiente) */}
          <li className="p-1">
            <button className="w-full text-left block px-4 py-2 text-sm rounded-md hover:bg-gray-100 text-gray-400 cursor-not-allowed">
              Cambiar contraseña
            </button>
          </li>

          {/* Línea divisora */}
          <hr className="my-1" />

          {/* Opción para cerrar sesión */}
          <li className="p-1">
            <button 
              onClick={onLogout}
              className="w-full text-left block px-4 py-2 text-sm rounded-md hover:bg-gray-100 text-red-500"
            >
              Cerrar Sesión
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileMenu;