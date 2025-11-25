import React, { useState } from 'react';
import { signOut, updateProfile, type User } from 'firebase/auth';
import { auth, storage, db } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

// Imports de Componentes
import Header from '../components/Header';
import BalanceCard from '../components/BalanceCard';
import Menu from '../components/Menu';
import NextMeeting from '../components/NextMeeting';
import RecentMovements from '../components/RecentMovements';
import BottomNav from '../components/BottomNav';
import PlaceholderContent from '../components/PlaceholderContent';
import ProfileMenu from '../components/ProfileMenu';
import AsistenciaScreen from '../components/AsistenciaScreen';
import MultasScreen from '../components/MultasScreen';



interface MainAppProps {
  user: User;
}

// Define todos los posibles estados de la vista para TypeScript
type ViewState = 'home' | 'asistencia' | 'multas' | 'placeholder';

const MainApp: React.FC<MainAppProps> = ({ user }) => {
  // El estado 'view' ahora usa el nuevo tipo 'ViewState'
  const [view, setView] = useState<ViewState>('home');
  const [activeNav, setActiveNav] = useState('Inicio');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- Funciones de Manejo de Eventos ---
  
  const handleLogout = () => {
    signOut(auth);
    setIsMenuOpen(false);
  };

  const handlePhotoChange = async (file: File) => {
    if (!user) return;
    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      await updateProfile(user, { photoURL: downloadURL });
      const userDocRef = doc(db, 'socias', user.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });
      // Solución temporal para ver el cambio de foto al instante
      window.location.reload(); 
    } catch (error) {
      console.error("Error al subir la foto:", error);
    } finally {
      setIsMenuOpen(false);
    }
  };
  
  const handleBackToHome = () => { 
    setView('home'); 
    setActiveNav('Inicio'); 
  };

  const handleNavClick = (itemName: string) => { 
    setActiveNav(itemName); 
    setView(itemName === 'Inicio' ? 'home' : 'placeholder'); 
  };

  const handleMenuClick = (label: string) => {
    switch (label) {
      case 'Asistencia':
        setView('asistencia');
        break;
      case 'Multas':
        setView('multas');
        break;
      default: // Para 'Préstamos' y 'Ganancias'
        setView('placeholder');
        break;
    }
  };

  // Función para renderizar el contenido principal dinámicamente
  const renderMainContent = () => {
    switch (view) {
      case 'home':
        return (
          <>
            <BalanceCard user={user} />
            <Menu onItemClick={handleMenuClick} />
            <NextMeeting />
            <RecentMovements user={user} />
          </>
        );
      case 'asistencia':
        return <AsistenciaScreen user={user} onBack={handleBackToHome} />;
      case 'multas':
        return <MultasScreen user={user} onBack={handleBackToHome} />;
      case 'placeholder':
      default:
        return <PlaceholderContent onClose={handleBackToHome} />;
    }
  };

  return (
    <>
     <div className="max-w-md mx-auto min-h-screen pb-20 bg-white">
        <Header 
          view={view} 
          user={user} 
          onBackClick={handleBackToHome}
          onAvatarClick={() => setIsMenuOpen(true)}
        />

        <main>
          {renderMainContent()}
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
};

export default MainApp;