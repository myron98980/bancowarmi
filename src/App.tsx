// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

// Imports de Componentes y Páginas
import Login from './components/Login';
import SplashScreen from './components/SplashScreen';
import DesktopLanding from './components/DesktopLanding';
import MainApp from './pages/MainApp';
import AdminPanel from './pages/AdminPanel';
import useIsMobile from './hooks/useIsMobile';

// Componente interno para manejar la lógica de autenticación y redirección
const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const isMobile = useIsMobile();
  const location = useLocation();

  console.log("AppContent renderizado. Estado actual - User:", !!user, "UserRole:", userRole, "isAuthChecking:", isAuthChecking, "isMobile:", isMobile, "Location:", location.pathname);

  useEffect(() => {
    console.log("useEffect de onAuthStateChanged montado o re-ejecutado.");

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log("onAuthStateChanged disparado. currentUser:", currentUser);

      if (currentUser) {
        try {
          console.log("Usuario detectado, buscando rol en Firestore para UID:", currentUser.uid);
          // Obtiene el rol del usuario desde Firestore
          const userDocRef = doc(db, 'socias', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          console.log("Documento de usuario obtenido. Existe:", userDoc.exists());
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role = userData.rol || 'socio';
            console.log("Rol obtenido de Firestore:", role, "Data completa:", userData);
            setUserRole(role);
          } else {
            console.log("Documento de usuario NO existe en 'socias'. Asignando rol por defecto 'socio'.");
            setUserRole('socio');
          }
          
          setUser(currentUser);
          setIsAuthChecking(false);
          console.log("Estado actualizado - User:", !!currentUser, "UserRole:", userRole, "isAuthChecking: false");
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error);
          setUserRole(null);
          setUser(null);
          setIsAuthChecking(false);
        }
      } else {
        console.log("No hay usuario autenticado. Reiniciando estado.");
        setUser(null);
        setUserRole(null);
        setIsAuthChecking(false);
      }
    });

    return () => {
      console.log("useEffect de onAuthStateChanged desmontado. Cancelando suscripción.");
      unsubscribe();
    };
  }, []); // El array vacío [] asegura que el efecto se ejecute solo una vez al montar el componente

  // Mientras se verifica la autenticación, muestra el splash screen
  if (isAuthChecking) {
    console.log("Renderizando SplashScreen porque isAuthChecking es true.");
    return <SplashScreen />;
  }

  // Lógica de redirección basada en estado de autenticación y rol
  if (user) {
    console.log("Usuario autenticado detectado. Evaluando rol...");
    // Usuario autenticado
    if (userRole === 'admin') {
      console.log("userRole es 'admin'. Renderizando AdminPanel.");
      // Redirige a AdminPanel si es admin
      return <AdminPanel />;
    } else {
      console.log("userRole NO es 'admin' (es:", userRole, "). Evaluando dispositivo...");
      // Usuario normal (socio)
      if (isMobile) {
        console.log("Es dispositivo móvil. Renderizando MainApp.");
        // Si es móvil y está autenticado, va a MainApp
        return <MainApp user={user} />;
      } else {
        console.log("Es dispositivo de escritorio. Renderizando DesktopLanding.");
        // Si es PC y está autenticado como socio, va al landing desktop
        return <DesktopLanding />;
      }
    }
  } else {
    console.log("Usuario NO autenticado. Evaluando ruta actual...");
    // Usuario no autenticado
    if (location.pathname.startsWith('/admin')) {
      console.log("Ruta es '/admin' y usuario no autenticado. Renderizando Login.");
      // Si intenta acceder al admin sin estar logueado, vuelve al login
      return <Login />;
    }

    if (isMobile) {
      console.log("Usuario no autenticado y es móvil. Renderizando Login.");
      // Si es móvil y no está logueado, muestra login
      return <Login />;
    } else {
      console.log("Usuario no autenticado y es escritorio. Renderizando DesktopLanding.");
      // Si es PC y no está logueado, muestra landing desktop
      return <DesktopLanding />;
    }
  }
};

// Componente principal de la aplicación
const App: React.FC = () => {
  console.log("Componente App renderizado.");
  return (
    <BrowserRouter>
      <Routes>
        {/* La ruta '*' permite que AppContent maneje toda la lógica */}
        <Route path="*" element={<AppContent />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;