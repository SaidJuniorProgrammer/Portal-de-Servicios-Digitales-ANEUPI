import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard'; 
import { Toaster } from 'sonner';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        
        <Route path="/dashboard" element={<DashboardLayout />}>
          {/* Aquí cargamos la página Dashboard real */}
          <Route index element={<Dashboard />} />
          
          <Route path="mis-solicitudes" element={<h2>Historial (Próximamente)</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;