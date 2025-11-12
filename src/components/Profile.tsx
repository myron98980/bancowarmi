// Ejemplo de cómo implementar el cambio de contraseña
import React, { useState } from 'react';
import { updatePassword } from 'firebase/auth';
import { auth } from '../firebase';

const ChangePasswordForm: React.FC = () => {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    const user = auth.currentUser;
    if (user && newPassword.length >= 6) {
      try {
        await updatePassword(user, newPassword);
        setMessage('¡Contraseña actualizada con éxito!');
        setNewPassword('');
      } catch (error) {
        setMessage('Error al actualizar la contraseña. Es posible que necesites volver a iniciar sesión.');
        console.error(error);
      }
    } else {
      setMessage('La contraseña debe tener al menos 6 caracteres.');
    }
  };

  return (
    <div className="p-4">
      <h3 className="font-bold mb-2">Cambiar Contraseña</h3>
      <form onSubmit={handleChangePassword}>
        <input
          type="password"
          placeholder="Nueva contraseña"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button type="submit" className="bg-brand-pink text-white p-2 rounded">
          Actualizar
        </button>
      </form>
      {message && <p className="text-sm mt-2">{message}</p>}
    </div>
  );
};

export default ChangePasswordForm;