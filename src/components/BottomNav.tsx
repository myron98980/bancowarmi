// src/components/BottomNav.tsx
import React from 'react';

// --- Íconos para la Barra de Navegación ---

// ===== ¡LA CORRECCIÓN ESTÁ AQUÍ! =====
// El componente HomeIcon ahora renderiza un SVG diferente si está activo.
const HomeIcon: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  if (isActive) {
    // Versión SÓLIDA (fill) para cuando el ícono está activo
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" />
      </svg>
    );
  }
  // Versión de CONTORNO (stroke) para cuando está inactivo
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
};


const LoansIcon: React.FC<{ isActive: boolean }> = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);
const MeetingsIcon: React.FC<{ isActive: boolean }> = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);
const ProfileIcon: React.FC<{ isActive: boolean }> = () => (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const navItems = [
    { icon: HomeIcon, label: 'Inicio' },
    { icon: LoansIcon, label: 'Préstamos' },
    { icon: MeetingsIcon, label: 'Reuniones' },
    { icon: ProfileIcon, label: 'Perfil' },
];

interface BottomNavProps {
  activeItem: string;
  onNavItemClick: (itemName: string) => void;
}

const NavItem: React.FC<{ icon: React.FC<{ isActive: boolean }>; label: string; isActive: boolean; onClick: () => void }> = ({ icon: Icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center space-y-1 transition-transform transform active:scale-90 ${isActive ? 'text-login-button' : 'text-gray-500'}`}>
        <Icon isActive={isActive} />
        <span className="text-xs font-bold">{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activeItem, onNavItemClick }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around py-3 px-4">
        {navItems.map(item => (
            <NavItem 
              key={item.label} 
              icon={item.icon} 
              label={item.label} 
              isActive={activeItem === item.label}
              onClick={() => onNavItemClick(item.label)} 
            />
        ))}
    </footer>
  );
};

export default BottomNav;