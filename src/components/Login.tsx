import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

// 1. IMPORTAMOS LAS HERRAMIENTAS DE NAVEGACIÓN
import { useNavigate } from 'react-router-dom';

import logo from '../assets/logo2.png'; 
import fondoLogin from '../assets/fondo-login.png';

const UserIcon = () => ( <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg> );
const LockIcon = () => ( <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> );

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // 2. INICIALIZAMOS EL HOOK DE NAVEGACIÓN
  const navigate = useNavigate();

  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) { setUsername(rememberedUser); }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    let email: string;
    
    // 3. LÓGICA DE EMAIL CORREGIDA Y SIMPLIFICADA
    // Ahora funciona tanto para 'admin' como para 'nombre.apellido'
    email = `${username.toLowerCase()}@bancowarmi.com`;
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('rememberedUser', username);
      
      // 4. AÑADIMOS LA REDIRECCIÓN
      // Después de un login exitoso, redirige a la página principal.
      // App.tsx se encargará de llevar al admin al panel correcto.
      navigate('/');

    } catch (err) {
      setError('Usuario o contraseña incorrectos.');
      console.error("Firebase Auth Error:", err); // Muestra el error real en consola
    }
  };

  // Tu JSX se mantiene 100% idéntico
  return (
    <div className="min-h-screen bg-white bg-cover bg-center" style={{ backgroundImage: `url(${fondoLogin})` }}>
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <div className="w-full max-w-sm text-center">
          
          <img src={logo} alt="Logo Banco Warmi" className="mx-auto h-24 w-24 mb-2" />
          <p className="text-lg font-semibold text-gray-800 mb-8">BANCO WARMI</p>

          <h2 className="text-3xl font-extrabold text-gray-900 mb-8">Iniciar Sesión</h2>

          <form onSubmit={handleLogin} className="space-y-6">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> <UserIcon /> </div>
              <input
                type="text"
                placeholder="Usuario (ej: luz.peralta o admin)"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-login-button"
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"> <LockIcon /> </div>
              <input
                type="password"
                placeholder="••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-login-button"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}

            <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-login-button hover:bg-opacity-90">
              Iniciar Sesión
            </button>
          </form>

          <div className="mt-8 text-center">
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center"> <div className="w-full border-t border-gray-300" /> </div>
                <div className="relative flex justify-center text-sm"> <span className="px-2 bg-white text-gray-500">O</span> </div>
              </div>
              <p className="text-sm text-gray-600">
                ¿No tienes cuenta?{' '}
                <a href="#" className="font-medium text-login-button hover:underline">Regístrate</a>
              </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;