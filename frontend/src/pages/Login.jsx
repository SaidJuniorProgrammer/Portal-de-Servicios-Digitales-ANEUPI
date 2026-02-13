import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
// import api from '../services/api';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    
    if (!formData.email || !formData.password) {
      return toast.error("Por favor completa todos los campos");
    }

    try {
      
      toast.loading("Iniciando sesión...");
      
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      toast.dismiss(); 
      toast.success(`Bienvenido de nuevo, ${formData.email}`);
      
      
      localStorage.setItem('usuario_aneupi', JSON.stringify({ email: formData.email, id: 1 }));
      
      
      navigate('/dashboard');

    } catch (error) {
      toast.error("Credenciales incorrectas");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Encabezado Azul */}
        <div className="bg-aneupi-primary p-8 text-center">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Portal ANEUPI</h1>
          <p className="text-aneupi-accent text-sm">Sistema de Gestión de Servicios</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-8 pt-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Iniciar Sesión</h2>
          
          <div className="space-y-5">
            {/* Campo Email */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Correo Electrónico"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-aneupi-secondary focus:ring-2 focus:ring-aneupi-accent outline-none transition-all"
              />
            </div>

            {/* Campo Contraseña */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-aneupi-secondary focus:ring-2 focus:ring-aneupi-accent outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-aneupi-primary text-white py-3 rounded-lg font-bold hover:bg-aneupi-secondary transition-colors flex items-center justify-center gap-2 shadow-lg shadow-aneupi-primary/30"
          >
            <FaSignInAlt /> Ingresar
          </button>

          <div className="mt-6 text-center text-sm text-gray-500">
            ¿No tienes cuenta?{' '}
            <Link to="/registro" className="text-aneupi-secondary font-bold hover:underline">
              Regístrate aquí
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;