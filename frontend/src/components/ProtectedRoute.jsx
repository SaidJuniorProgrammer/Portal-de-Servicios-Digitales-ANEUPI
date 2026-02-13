import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const usuario = localStorage.getItem('usuario_aneupi');

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;