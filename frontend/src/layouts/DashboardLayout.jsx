import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'; 
import { FaFileAlt, FaHistory, FaSignOutAlt, FaUserCircle, FaBars } from 'react-icons/fa';

const DashboardLayout = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const [sidebarOpen, setSidebarOpen] = useState(false);

  
  const menuItems = [
    { path: '/dashboard', label: 'Formatos Disponibles', icon: <FaFileAlt /> },
    { path: '/dashboard/mis-solicitudes', label: 'Mis Solicitudes', icon: <FaHistory /> },
  ];

  
  const handleLogout = () => {
    
    localStorage.removeItem('usuario_aneupi');
    
    
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50 font-sans">
      
      
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-center border-b border-gray-100 bg-white">
          <h1 className="text-xl font-serif font-bold text-aneupi-primary tracking-wide">Portal ANEUPI</h1>
        </div>
        
        <nav className="p-4 space-y-2 mt-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-aneupi-primary text-white shadow-md shadow-aneupi-primary/30'
                  : 'text-gray-600 hover:bg-aneupi-accent hover:text-aneupi-primary'
              }`}
            >
              {item.icon}
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
            Servicios Digitales
          </h2>

          <div className="flex items-center gap-4">
             <div className="text-right hidden md:block leading-tight">
                <p className="text-sm font-bold text-gray-800">Administrador</p>
                <p className="text-xs text-aneupi-secondary font-medium">admin@aneupi.com</p>
             </div>
             <FaUserCircle className="text-4xl text-gray-300" />
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