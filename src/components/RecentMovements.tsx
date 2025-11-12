import React from 'react';
// Ya no necesitamos importar el ícono

const UpArrowIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
    </svg>
);


const RecentMovements: React.FC = () => {
  return (
    <div className="px-4 my-6">
       <h2 className="font-semibold text-gray-800 mb-4">Movimientos Recientes</h2>
       <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
            <div className="flex items-center">
                <div className="bg-green-100 rounded-full p-2 mr-4">
                    <UpArrowIcon />
                </div>
                <div>
                    <p className="font-medium">Aporte</p>
                    <p className="text-sm text-gray-500">1 oct 2025</p>
                </div>
            </div>
            <p className="font-semibold text-green-600">+S/0.00</p>
       </div>
    </div>
  );
};

export default RecentMovements;