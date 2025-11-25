import React from 'react';
import { type User } from 'firebase/auth';

import avatarGirl from '../assets/avatar-girl.png';
import avatarMen from '../assets/avatar-men.png';

// --- Íconos del Header ---
const NotificationIcon = () => (
  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

// ===== ¡LA CORRECCIÓN ESTÁ AQUÍ! =====
// Se ha corregido la sintaxis de 'strokeWidth'.
const BackArrowIcon = () => (
  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
  </svg>
);

const getAvatarForName = (name: string): string => {
  const firstName = name.toLowerCase().split(' ')[0];
  if (firstName === 'cristhian') {
    return avatarMen;
  }
  return avatarGirl;
};

interface HeaderProps {
  view: 'home' | 'asistencia' | 'multas' | 'placeholder'; 
  user: User | null;
  onAvatarClick: () => void;
  onBackClick: () => void;
  onNotificationClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  view,
  user,
  onAvatarClick,
  onBackClick,
  onNotificationClick = () => {}
}) => {
  const displayName = user?.displayName || 'Usuario';
  const firstName = displayName.split(' ')[0];
  const avatarSrc = user?.photoURL || getAvatarForName(displayName);

  let headerTitle: string;
  switch(view) {
    case 'asistencia':
      headerTitle = 'Mi Asistencia';
      break;
    case 'multas':
      headerTitle = 'Mis Multas';
      break;
    case 'placeholder':
      headerTitle = 'En Construcción';
      break;
    default:
      headerTitle = '';
  }

  return (
    <header className="bg-brand-purple p-4 flex justify-between items-center h-20">
      <div className="flex-1">
        {view === 'home' ? (
          <button onClick={onAvatarClick} className="flex items-center">
            <img
              src={avatarSrc}
              alt="Avatar de usuario"
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
            <div className="ml-3 text-left">
              <p className="text-white text-sm font-medium">
                Hola, {firstName}
              </p>
            </div>
          </button>
        ) : (
          <button onClick={onBackClick} className="flex items-center text-white font-semibold text-lg">
            <BackArrowIcon />
            <span className="ml-2">Atrás</span>
          </button>
        )}
      </div>

      {headerTitle && (
        <h1 className="text-lg font-bold text-white absolute left-1/2 -translate-x-1/2">
          {headerTitle}
        </h1>
      )}

      <div className="flex-1 flex justify-end">
        {view === 'home' && (
          <button 
            onClick={onNotificationClick} 
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors duration-200"
          >
            <NotificationIcon />
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;