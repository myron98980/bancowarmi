// src/App.tsx

import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut, updateProfile, type User } from 'firebase/auth';
import { auth, storage, db } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

// Imports de Componentes
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import Header from './components/Header';
import BalanceCard from './components/BalanceCard';
import Menu from './components/Menu';
import NextMeeting from './components/NextMeeting';
import RecentMovements from './components/RecentMovements';
import BottomNav from './components/BottomNav';
import PlaceholderContent from './components/PlaceholderContent'; // ✅ Mantenemos la importación
import ProfileMenu from './components/ProfileMenu';
import DesktopLanding from './components/DesktopLanding'; 

// Importa los hooks personalizados
import useIsMobile from './hooks/useIsMobile';
// NUEVO: Importa el hook de inactividad
import useInactivityTimeout from './hooks/useInactivityTimeout';

const App: React.FC = () => {
  // Hook para detectar si el dispositivo es móvil
  const isMobile = useIsMobile();

  // --- Estados de la Aplicación ---
  const [showInitialSplash, setShowInitialSplash] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [view, setView] = useState<'home' | 'placeholder'>('home'); // ✅ Mantenemos el estado de vista
  const [activeNav, setActiveNav] = useState('Inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Efecto para manejar la autenticación y el splash screen inicial
  useEffect(() => {
    const splashTimer = setTimeout(() => { setShowInitialSplash(false); }, 3000);
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthChecking(false);
    });
    return () => {
      clearTimeout(splashTimer);
      unsubscribeAuth();
    };
  }, []);

  // --- Funciones de Manejo de Eventos ---

  // Cierra la sesión del usuario
  const handleLogout = () => {
    console.log("Cerrando sesión...");
    signOut(auth);
    setIsMenuOpen(false);
  };
  
  // --- Lógica de Cierre de Sesión por Inactividad ---
  // NUEVO: Define el tiempo de espera en milisegundos.
  // 15 minutos = 15 * 60 segundos * 1000 milisegundos
  const INACTIVITY_TIMEOUT = 15 * 60 * 1000; 

  // NUEVO: Llama al hook personalizado.
  // Se le pasa la función que debe ejecutar (handleLogout) y el tiempo de espera.
  // Este hook se encargará de resetear el temporizador con la actividad del usuario.
  useInactivityTimeout(handleLogout, INACTIVITY_TIMEOUT);
  // ---------------------------------------------------

  // Maneja la subida y actualización de la foto de perfil
  const handlePhotoChange = async (file: File) => {
    if (!user) return;
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: downloadURL });
      const userDocRef = doc(db, 'socias', user.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });
      setUser(prevUser => prevUser ? { ...prevUser, photoURL: downloadURL } : null);
    } catch (error) {
      console.error("Error al subir la foto de perfil:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };

  // Vuelve a la pantalla de inicio desde una sub-pantalla


  // Maneja los clics en la barra de navegación inferior
  const handleNavClick = (itemName: string) => { 
    setActiveNav(itemName); 
    setView(itemName === 'Inicio' ? 'home' : 'placeholder'); 
  };

  // Maneja los clics en los botones del menú principal
  const handleMenuClick = () => { 
    setView('placeholder'); 
  };
  // Vuelve a la pantalla de inicio desde una sub-pantalla
const handleBackToHome = () => { 
  setView('home'); 
  setActiveNav('Inicio'); 
};

  // --- Lógica de Renderizado Principal ---

  // 1. Si el dispositivo no es móvil, muestra la página de aterrizaje y nada más.
  if (!isMobile) {
    return <DesktopLanding />;
  }

  // 2. Si es móvil, continúa con el flujo normal de la aplicación.
  if (showInitialSplash || isAuthChecking) {
    return <SplashScreen />;
  }

  // Si no hay un usuario, se muestra la pantalla de Login.
  // En este punto, el hook de inactividad no está "activo" porque el componente
  // principal que lo contiene se desmonta y su efecto de limpieza se ejecuta.
  if (!user) {
    return <Login />;
  }
  
  // Si hay un usuario, se renderiza la aplicación principal.
  // El hook de inactividad estará escuchando eventos.
  return (
    <>
     <div className="max-w-md mx-auto min-h-screen pb-20 bg-white">
        {/* Nuevo Header sin botón de atrás */}
        <Header 
          user={user} 
          onAvatarClick={() => setIsMenuOpen(true)}
          onNotificationClick={() => {}}
        
        />

       <main className="mt-4">
          {view === 'home' ? (
            <>
              <BalanceCard />
              <Menu onItemClick={handleMenuClick} />
              <NextMeeting />
              <RecentMovements />
            </>
          ) : (
           <PlaceholderContent onClose={handleBackToHome} />
          )}
        </main>
        
        <BottomNav activeItem={activeNav} onNavItemClick={handleNavClick} />
      </div>

      {isMenuOpen && (
        <ProfileMenu 
          onClose={() => setIsMenuOpen(false)} 
          onLogout={handleLogout}
          onPhotoChange={handlePhotoChange}
        />
      )}
    </>
  );
}

export default App;