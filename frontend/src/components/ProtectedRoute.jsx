import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin }) => {
  const data = localStorage.getItem('usuario_aneupi');

  
  if (!data) {
    return <Navigate to="/login" replace />;
  }

  const usuario = JSON.parse(data);

  
  if (requireAdmin && usuario.rol !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  
  return children;
};

export default ProtectedRoute;