// Header.tsx
import React from 'react';
import { type User } from 'firebase/auth';

import avatarGirl from '../assets/avatar-girl.png';
import avatarMen from '../assets/avatar-men.png';
import { BellIcon } from '@heroicons/react/24/outline';

// Ícono de notificación (versión limpia y moderna)
const NotificationIcon = () => (
  <BellIcon className="h-5 w-5 text-white" />
);

const getAvatarForName = (name: string): string => {
  const firstName = name.toLowerCase();
  if (firstName === 'cristhian') {
    return avatarMen;
  }
  return avatarGirl;
};

interface HeaderProps {
  user: User | null;
  onAvatarClick: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  user,
  onAvatarClick,
  onNotificationClick = () => {}
}) => {
  const displayName = user?.displayName || 'Usuario';
  
  // Dividir nombre completo y tomar primer nombre y primer apellido
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.length > 1 ? nameParts[1] : ''; // Primer apellido

  const fullName = lastName ? `${firstName} ${lastName}` : firstName;

  const avatarSrc = user?.photoURL || getAvatarForName(displayName);

  return (
    <header className="bg-brand-purple p-4 flex justify-between items-center">
      {/* Lado izquierdo: Foto + Texto "Hola, Luz Peralta" */}
      <div className="flex items-center">
        <button onClick={onAvatarClick} className="flex items-center">
          <img
            src={avatarSrc}
            alt="Avatar de usuario"
            className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="ml-3 text-left">
            <p className="text-white text-sm font-medium">
              Hola, {fullName}
            </p>
          </div>
        </button>
      </div>

      {/* Lado derecho: Solo ícono de notificación */}
      <div className="flex space-x-4">
        <button 
          onClick={onNotificationClick} 
          className="p-1 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200"
        >
          <NotificationIcon />
        </button>
      </div>
    </header>
  );
};

export default Header;