import React, { useState, useEffect } from 'react';

// ===== ¡DISEÑO RESTAURADO AQUÍ! =====
// Sub-componente para cada unidad de tiempo, con el texto DENTRO del círculo.
const CountdownUnit: React.FC<{ value: number; unit: string }> = ({ value, unit }) => (
  <div className="flex flex-col items-center text-center">
    <div className="w-16 h-16 bg-countdown-bg rounded-full flex flex-col items-center justify-center">
      <span className="text-brand-cyan text-2xl font-bold">
        {String(value).padStart(2, '0')}
      </span>
      <span className="text-white text-[10px] font-semibold mt-1 tracking-wider">
        {unit.toUpperCase()}
      </span>
    </div>
  </div>
);

const NextMeeting: React.FC = () => {
  // --- Lógica de cálculo de fecha (correcta) ---
  const calculateNextTuesday5PM = () => {
    const now = new Date();
    const nextTuesday = new Date(now);
    nextTuesday.setHours(17, 0, 0, 0);

    const daysUntilTuesday = (2 - nextTuesday.getDay() + 7) % 7;
    nextTuesday.setDate(nextTuesday.getDate() + daysUntilTuesday);

    if (now > nextTuesday) {
      nextTuesday.setDate(nextTuesday.getDate() + 7);
    }
    
    return nextTuesday;
  };

  const [targetDate] = useState(calculateNextTuesday5PM());

  const calculateTimeLeft = () => {
    const difference = +targetDate - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  // --- Lógica del contador (corregida con setInterval) ---
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="px-4 my-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-800 text-lg">Próxima Reunión</h2>
        <a href="#" className="text-sm text-brand-cyan font-bold">
          Ver todo
        </a>
      </div>
      <div className="bg-countdown-container rounded-2xl p-4 flex justify-around items-center">
        <CountdownUnit value={timeLeft.days} unit="DÍAS" />
        <CountdownUnit value={timeLeft.hours} unit="HRS" />
        <CountdownUnit value={timeLeft.minutes} unit="MIN" />
        <CountdownUnit value={timeLeft.seconds} unit="SEG" />
      </div>
    </div>
  );
};

export default NextMeeting;