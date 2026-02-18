import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaEye, FaSearch, FaUserShield, FaExclamationTriangle } from 'react-icons/fa';
import api from '../services/api';

const API_URL = import.meta.env.VITE_API_URL;

const AdminDashboard = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('');
  const [imagenModal, setImagenModal] = useState(null);
  const [modalConfirm, setModalConfirm] = useState({ open: false, id: null, estado: '' });
  const [motivoRechazo, setMotivoRechazo] = useState('');

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const fetchSolicitudes = async () => {
    try {
      const res = await api.get('/api/solicitudes');
      const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
      setSolicitudes(data);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar solicitudes");
    } finally {
      setLoading(false);
    }
  };

  const ejecutarCambioEstado = async () => {
    const { id, estado } = modalConfirm;
    
    if (estado === 'RECHAZADO' && !motivoRechazo.trim()) {
      return toast.warning("Debes ingresar un motivo para el rechazo");
    }

    const adminData = JSON.parse(localStorage.getItem('usuario_aneupi'));

    try {
      await api.put(`/api/solicitudes/${id}/estado`, { 
        estado,
        observacionAdmin: estado === 'RECHAZADO' ? motivoRechazo : 'Aprobado correctamente.',
        adminId: adminData?.id,
        adminNombre: adminData?.nombreCompleto || adminData?.nombre
      });
      
      toast.success(`Solicitud ${estado} con éxito`);
      cerrarModales();
      fetchSolicitudes();
    } catch (error) {
      console.error(error);
      toast.error("Error al actualizar estado");
    }
  };

  const cerrarModales = () => {
    setModalConfirm({ open: false, id: null, estado: '' });
    setMotivoRechazo('');
  };

  const solicitudesFiltradas = solicitudes.filter(s => 
    (s.usuario?.nombreCompleto || '').toLowerCase().includes(filtro.toLowerCase()) ||
    (s.tipoDocumento?.nombre || '').toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-100 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-aneupi-primary flex items-center gap-3">
            <FaUserShield className="text-aneupi-secondary" />
            Panel de Administración
          </h1>
          <p className="text-gray-500 mt-1">Gestión de solicitudes de Accionistas</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-aneupi-primary" />
          <input 
            type="text" 
            placeholder="Buscar por nombre o documento..." 
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:border-aneupi-primary focus:ring-2 focus:ring-aneupi-primary/20 outline-none transition-all shadow-sm text-gray-700 bg-white"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-aneupi-primary text-white font-bold uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Accionista</th>
                <th className="p-4">Documento</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Comprobante</th>
                <th className="p-4">Estado</th>
                <th className="p-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-medium">Sincronizando datos...</td></tr>
              ) : solicitudesFiltradas.length === 0 ? (
                <tr><td colSpan="7" className="p-8 text-center text-gray-500">No hay solicitudes para mostrar.</td></tr>
              ) : (
                solicitudesFiltradas.map((sol) => (
                  <tr key={sol.id} className="hover:bg-blue-50/50 transition-colors">
                    <td className="p-4 font-mono text-xs text-aneupi-primary font-bold">#{sol.id}</td>
                    <td className="p-4 font-medium text-gray-700">{sol.usuario?.nombreCompleto || 'Desconocido'}</td>
                    <td className="p-4 text-sm text-gray-600">{sol.tipoDocumento?.nombre}</td>
                    <td className="p-4 font-bold text-aneupi-secondary">${Number(sol.precioAlSolicitar).toFixed(2)}</td>
                    <td className="p-4">
                      {sol.comprobantePagoUrl ? (
                        <button onClick={() => setImagenModal(sol.comprobantePagoUrl)} className="flex items-center gap-1 text-xs bg-white border border-aneupi-primary text-aneupi-primary px-3 py-1 rounded-full hover:bg-aneupi-primary hover:text-white transition-all shadow-sm font-medium cursor-pointer">
                          <FaEye /> Ver Pago
                        </button>
                      ) : <span className="text-xs text-gray-400 italic">Sin comprobante</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                        sol.estado === 'APROBADO' ? 'bg-green-100 text-green-700 border-green-200' :
                        sol.estado === 'RECHAZADO' ? 'bg-red-100 text-red-700 border-red-200' :
                        'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {sol.estado.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                      {sol.estado !== 'APROBADO' && sol.estado !== 'RECHAZADO' && (
                        <>
                          <button onClick={() => setModalConfirm({ open: true, id: sol.id, estado: 'APROBADO' })} className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 shadow-md transition-all hover:scale-110 cursor-pointer">
                            <FaCheck />
                          </button>
                          <button onClick={() => setModalConfirm({ open: true, id: sol.id, estado: 'RECHAZADO' })} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 shadow-md transition-all hover:scale-110 cursor-pointer">
                            <FaTimes />
                          </button>
                        </>
                      )}
                      {sol.estado === 'APROBADO' && <FaCheck className="text-green-500 text-xl" />}
                      {sol.estado === 'RECHAZADO' && <FaTimes className="text-red-500 text-xl" />}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalConfirm.open && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
            <div className={`p-4 text-white flex items-center gap-3 ${modalConfirm.estado === 'APROBADO' ? 'bg-green-600' : 'bg-red-600'}`}>
              <FaExclamationTriangle className="text-xl" />
              <h3 className="font-bold text-lg">Confirmar Acción</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                ¿Estás seguro que deseas <strong>{modalConfirm.estado.toLowerCase()}</strong> esta solicitud? 
              </p>

              {modalConfirm.estado === 'RECHAZADO' && (
                <div className="space-y-2 mb-4">
                  <label className="text-sm font-bold text-gray-700">Motivo del Rechazo:</label>
                  <textarea 
                    value={motivoRechazo}
                    onChange={(e) => setMotivoRechazo(e.target.value)}
                    placeholder="Escribe aquí el motivo del rechazo..."
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none text-sm h-24 resize-none bg-white text-gray-700"
                    required
                  />
                </div>
              )}

              <div className="flex justify-end gap-3 mt-6">
                <button 
                  onClick={cerrarModales}
                  className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  onClick={ejecutarCambioEstado}
                  className={`px-6 py-2 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 cursor-pointer ${
                    modalConfirm.estado === 'APROBADO' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  Confirmar {modalConfirm.estado === 'APROBADO' ? 'Aprobación' : 'Rechazo'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imagenModal && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setImagenModal(null)}>
          <div className="relative max-w-fit max-h-[90vh] animate-fade-in-up">
            <img 
              src={`${API_URL}${imagenModal}`} 
              alt="Comprobante" 
              className="max-w-full max-h-[85vh] rounded-lg shadow-2xl border-4 border-white" 
            />
            <button className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 cursor-pointer z-10" onClick={() => setImagenModal(null)}>
              <FaTimes />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;