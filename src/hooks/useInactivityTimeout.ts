import { useEffect, useRef } from 'react';

/**
 * Hook personalizado que cierra la sesión de un usuario después de un período de inactividad.
 * @param onLogout - La función a llamar para cerrar la sesión.
 * @param timeout - El tiempo de inactividad en milisegundos.
 */
const useInactivityTimeout = (onLogout: () => void, timeout: number) => {
  // Usamos useRef para mantener el ID del temporizador entre renders sin causar un nuevo renderizado.
  const timeoutId = useRef<number | null>(null);

  // Función para reiniciar el temporizador de inactividad.
  const resetTimer = () => {
    // Si ya existe un temporizador, lo limpiamos.
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }

    // Creamos un nuevo temporizador. Si este temporizador se completa,
    // significa que no hubo actividad, y ejecutamos la función de logout.
    timeoutId.current = window.setTimeout(() => {
      console.log("Cerrando sesión por inactividad.");
      onLogout();
    }, timeout);
  };

  useEffect(() => {
    // Lista de eventos que consideramos como "actividad del usuario".
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

    // Función que se ejecutará cada vez que se detecte uno de los eventos.
    const handleActivity = () => {
      resetTimer();
    };

    // Iniciamos el temporizador la primera vez que el hook se monta.
    resetTimer();

    // Agregamos los event listeners a la ventana para detectar actividad.
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Función de limpieza: se ejecuta cuando el componente que usa el hook se "desmonta".
    // Es crucial para evitar fugas de memoria.
    return () => {
      // Limpiamos el temporizador si todavía está activo.
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      // Removemos todos los event listeners que agregamos.
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [onLogout, timeout]); // El efecto se volverá a ejecutar si la función de logout o el timeout cambian.
};

export default useInactivityTimeout;