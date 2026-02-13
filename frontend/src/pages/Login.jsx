import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      
      const res = await api.post('/api/usuarios/login', { email, password });
      
      
      const usuarioData = res.data.usuario || res.data; 

      if (!usuarioData || !usuarioData.email) {
          throw new Error("Respuesta del servidor inválida");
      }

      
      localStorage.setItem('usuario_aneupi', JSON.stringify(usuarioData));
      
      
      const nombreMostrar = usuarioData.nombre || usuarioData.nombreCompleto || "Usuario";
      toast.success(`Bienvenido, ${nombreMostrar}`);
      
      
      navigate('/dashboard', { replace: true });

    } catch (error) {
      console.error("Error en Login:", error);
      
      
      if (error.response) {
          
          if (error.response.status === 401) {
              toast.error("Contraseña incorrecta o usuario no encontrado");
          } else {
              toast.error(error.response.data.error || "Error al iniciar sesión");
          }
      } else if (error.request) {
          
          toast.error("No se pudo conectar con el servidor. Revisa tu conexión.");
      } else {
          
          toast.error("Ocurrió un error inesperado.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        
        <div className="text-center mb-8">
          <div className="bg-aneupi-primary w-full h-24 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-aneupi-primary/30">
             <h1 className="text-3xl font-serif font-bold text-white tracking-widest">ANEUPI</h1>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Iniciar Sesión</h2>
          <p className="text-gray-500 text-sm mt-1">Sistema de Gestión de Servicios</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@aneupi.com"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-aneupi-primary focus:ring-4 focus:ring-aneupi-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Contraseña</label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:border-aneupi-primary focus:ring-4 focus:ring-aneupi-primary/10 transition-all outline-none bg-gray-50 focus:bg-white"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-aneupi-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-aneupi-primary/30 hover:bg-aneupi-secondary transform active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="animate-pulse">Ingresando...</span>
            ) : (
              <>
                <FaSignInAlt /> Ingresar
              </>
            )}
          </button>

        </form>

        <div className="mt-8 text-center">
           <a href="#" className="text-sm text-aneupi-secondary font-bold hover:underline">
             ¿Olvidaste tu contraseña?
           </a>
        </div>

      </div>
    </div>
  );
};

export default Login;