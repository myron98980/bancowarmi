// src/components/Menu.tsx

import React from 'react';

import martilloImg from '../assets/icons/martillo.png';
import calendarImg from '../assets/icons/calendar.png';
import prestamosImg from '../assets/icons/prestamos.png';
import gananciasImg from '../assets/icons/ganancias.png';

interface MenuProps {
  onItemClick: () => void;
}

const menuItems = [
  { image: martilloImg, label: 'Multas' },
  { image: calendarImg, label: 'Asistencia' },
  { image: prestamosImg, label: 'Préstamos' },
  { image: gananciasImg, label: 'Ganancias' },
];

const MenuItem: React.FC<{ image: string; label: string; onClick: () => void }> = ({ image, label, onClick }) => (
  <div className="flex flex-col items-center space-y-2">
    {/* ===== ¡LOS CAMBIOS ESTÁN AQUÍ! ===== */}
    <button 
      onClick={onClick} 
      className="w-16 h-16 bg-icon-bg rounded-2xl flex items-center justify-center shadow-sm 
                 transition-transform duration-150 transform hover:scale-105 active:scale-95"
    >
      <img 
        src={image} 
        alt={label} 
        className="h-7 w-7 object-contain"
      />
    </button>
    <p className="text-sm text-gray-600 font-medium">{label}</p>
  </div>
);

const Menu: React.FC<MenuProps> = ({ onItemClick }) => {
  return (
    <div className="flex justify-around items-center my-6 px-4">
      {menuItems.map((item) => (
        <MenuItem 
          key={item.label} 
          image={item.image} 
          label={item.label} 
          onClick={onItemClick}
        />
      ))}
    </div>
  );
};

export default Menu;