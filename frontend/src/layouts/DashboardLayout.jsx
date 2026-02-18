import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FaFileAlt, FaHistory, FaSignOutAlt, FaUserCircle, FaBars, FaUserShield, FaExchangeAlt } from 'react-icons/fa';
import { toast } from 'sonner';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [usuario, setUsuario] = useState({ nombre: 'Usuario', email: '', rol: 'USER' });

  useEffect(() => {
    const data = localStorage.getItem('usuario_aneupi');
    if (data) {
      const parsedUser = JSON.parse(data);
      setUsuario(parsedUser);
    }
  }, []);

  const isModoAdmin = location.pathname.startsWith('/admin');

  const itemsUsuario = [
    { path: '/dashboard', label: 'Formatos Disponibles', icon: <FaFileAlt /> },
    { path: '/dashboard/mis-solicitudes', label: 'Mis Solicitudes', icon: <FaHistory /> },
  ];

  const itemsAdmin = [
    { path: '/admin', label: 'Panel Admin', icon: <FaUserShield /> },
    { path: '/admin/historial', label: 'Historial Doc.', icon: <FaHistory /> },
  ];

  const menuActual = isModoAdmin ? itemsAdmin : itemsUsuario;

  const getTitulo = () => {
    if (isModoAdmin) {
      if (location.pathname.includes('/historial')) return 'Historial de Documentos';
      return 'Centro de Control';
    }
    if (location.pathname.includes('mis-solicitudes')) return 'Mis Trámites';
    return 'Servicios Digitales';
  };

  const handleLogout = () => {
    localStorage.removeItem('usuario_aneupi');
    toast.success("Sesión cerrada correctamente");
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-center border-b border-gray-100 bg-white">
          <h1 className="text-xl font-serif font-bold text-aneupi-primary tracking-wide">Portal ANEUPI</h1>
        </div>
        
        <nav className="p-4 space-y-2 mt-2">
          <p className="px-4 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            {isModoAdmin ? 'Administración' : 'Menú Principal'}
          </p>

          {menuActual.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-aneupi-primary text-white shadow-md'
                  : 'text-gray-600 hover:bg-blue-50 hover:text-aneupi-primary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 w-full rounded-lg transition-colors text-sm font-medium cursor-pointer"
          >
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm z-10">
          <button
            className="md:hidden text-gray-500 text-xl"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>

          <h2 className="text-lg font-bold text-gray-800 hidden md:block font-serif">
             {getTitulo()}
          </h2>

          <div className="flex items-center gap-4">
             {usuario.rol === 'ADMIN' && (
               <button
                 onClick={() => navigate(isModoAdmin ? '/dashboard' : '/admin')}
                 className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border border-aneupi-primary text-aneupi-primary text-xs font-bold hover:bg-aneupi-primary hover:text-white transition-all mr-2 cursor-pointer"
                 title={isModoAdmin ? "Ir a vista de Accionista" : "Ir a Panel de Administración"}
               >
                 <FaExchangeAlt />
                 {isModoAdmin ? 'Vista Accionista' : 'Vista Admin'}
               </button>
             )}

             <div className="text-right hidden md:block leading-tight">
                <p className="text-sm font-bold text-gray-800">
                  {usuario.nombreCompleto || usuario.nombre || 'Usuario'}
                </p>
                <div className="flex items-center justify-end gap-1">
                  <span className={`w-2 h-2 rounded-full ${usuario.rol === 'ADMIN' ? 'bg-red-500' : 'bg-green-500'}`}></span>
                  <p className="text-xs text-gray-500 font-medium">
                    {usuario.rol === 'ADMIN' ? 'Administrador' : 'Accionista'}
                  </p>
                </div>
             </div>
             <FaUserCircle className={`text-4xl ${usuario.rol === 'ADMIN' ? 'text-aneupi-primary' : 'text-gray-300'}`} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50">
           <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;