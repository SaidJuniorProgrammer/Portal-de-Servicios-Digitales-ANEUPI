import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaEye, FaSearch, FaFilePdf } from 'react-icons/fa';
import api from '../services/api';

const AdminDashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [imagenModal, setImagenModal] = useState(null); 

  
  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const res = await api.get('/api/solicitudes'); 
      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
      
    } finally {
      setLoading(false);
    }
  };

  
  const handleEstado = async (id, nuevoEstado) => {
    if (!confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) return;

    try {
      await api.put(`/api/solicitudes/${id}/estado`, { 
        estado: nuevoEstado,
        observacionAdmin: nuevoEstado === 'RECHAZADO' ? 'Comprobante no válido o ilegible.' : 'Todo correcto.'
      });
      
      toast.success(`Solicitud ${nuevoEstado} correctamente`);
      fetchSolicitudes(); 
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar estado");
    }
  };

  
  const solicitudesFiltradas = solicitudes.filter(s => 
    s.usuario?.nombreCompleto?.toLowerCase().includes(filtro.toLowerCase()) ||
    s.tipoDocumento?.nombre?.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans animate-fade-in">
      
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
          <p className="text-gray-500">Gestiona y revisa las solicitudes de documentos</p>
        </div>
        
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Buscar por estudiante o documento..." 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-aneupi-primary focus:ring-2 focus:ring-aneupi-primary/20 outline-none transition-all"
          />
        </div>
      </div>

      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Estudiante</th>
                <th className="p-4">Documento</th>
                <th className="p-4">Pago</th>
                <th className="p-4">Comprobante</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">Cargando solicitudes...</td></tr>
              ) : solicitudesFiltradas.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No hay solicitudes encontradas.</td></tr>
              ) : (
                solicitudesFiltradas.map((sol) => (
                  <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-mono text-xs text-gray-400">#{sol.id}</td>
                    <td className="p-4 font-medium text-gray-800">{sol.usuario?.nombreCompleto || 'Desconocido'}</td>
                    <td className="p-4 text-sm text-gray-600">{sol.tipoDocumento?.nombre}</td>
                    <td className="p-4 font-bold text-aneupi-secondary">${Number(sol.precioAlSolicitar).toFixed(2)}</td>
                    
                    
                    <td className="p-4">
                      {sol.comprobantePago ? (
                        <button 
                          onClick={() => setImagenModal(sol.comprobantePago)}
                          className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <FaEye /> Ver
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Pendiente</span>
                      )}
                    </td>

                    
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        sol.estado === 'APROBADO' ? 'bg-green-100 text-green-700' :
                        sol.estado === 'RECHAZADO' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {sol.estado}
                      </span>
                    </td>

                    
                    <td className="p-4 flex justify-center gap-2">
                      {sol.estado === 'PENDIENTE' && (
                        <>
                          <button 
                            onClick={() => handleEstado(sol.id, 'APROBADO')}
                            title="Aprobar"
                            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-md transition-transform hover:scale-105"
                          >
                            <FaCheck />
                          </button>
                          <button 
                            onClick={() => handleEstado(sol.id, 'RECHAZADO')}
                            title="Rechazar"
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-md transition-transform hover:scale-105"
                          >
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {sol.estado === 'APROBADO' && (
                        <button className="text-gray-400 cursor-not-allowed"><FaFilePdf /></button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      
      {imagenModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setImagenModal(null)}>
          <div className="relative max-w-3xl max-h-[90vh]">
            <img src={imagenModal} alt="Comprobante" className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" />
            <button 
              className="absolute -top-4 -right-4 bg-white text-black p-2 rounded-full font-bold shadow-lg hover:bg-gray-200"
              onClick={() => setImagenModal(null)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;