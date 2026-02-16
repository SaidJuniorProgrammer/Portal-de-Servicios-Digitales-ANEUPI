import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaFilePdf, FaClock, FaCheckCircle, FaTrash, FaExclamationCircle } from 'react-icons/fa'; 
import { toast } from 'sonner';
import ModalSubirPago from '../components/ModalSubirPago';

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    const data = localStorage.getItem('usuario_aneupi');
    if (!data) return;
    
    const usuario = JSON.parse(data);
    const USUARIO_ID = usuario.id;

    try {
      const res = await api.get(`/api/solicitudes/usuario/${USUARIO_ID}`);
      setSolicitudes(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRecargar = () => {
    cargarHistorial(); 
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que quieres eliminar esta solicitud?")) return;

    try {
      await api.delete(`/api/solicitudes/${id}`);
      toast.success("Solicitud eliminada");
      setSolicitudes(solicitudes.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Error al eliminar");
    }
  };

  const getBadgeColor = (estado) => {
    switch (estado) {
      case 'PENDIENTE_PAGO': return 'bg-yellow-100 text-yellow-700';
      case 'EN_REVISION': return 'bg-blue-100 text-blue-700';
      case 'APROBADO': return 'bg-green-100 text-green-700';
      case 'RECHAZADO': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-bold text-aneupi-primary font-serif mb-6">Mis Solicitudes</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {solicitudes.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaClock className="text-gray-300 text-2xl" />
            </div>
            <p className="text-gray-500 font-medium">No tienes solicitudes aún.</p>
            <p className="text-gray-400 text-sm">Tus trámites aparecerán aquí una vez que los solicites.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {solicitudes.map((sol) => (
              <div key={sol.id} className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-aneupi-accent rounded-lg text-aneupi-primary">
                      <FaFilePdf className="text-xl" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">{sol.tipoDocumento?.nombre || sol.tipoDocumento}</h3>
                      <p className="text-sm text-gray-500">
                        Solicitado el: {new Date(sol.fechaSolicitud).toLocaleDateString()}
                      </p>
                      <span className="text-xs font-bold text-aneupi-secondary">
                        ${Number(sol.precioAlSolicitar).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 ${getBadgeColor(sol.estado)}`}>
                      {sol.estado === 'PENDIENTE_PAGO' && <FaClock />}
                      {sol.estado === 'RECHAZADO' && <FaExclamationCircle />}
                      {sol.estado === 'APROBADO' && <FaCheckCircle />}
                      {sol.estado.replace('_', ' ')}
                    </span>

                    {(sol.estado === 'PENDIENTE_PAGO' || sol.estado === 'RECHAZADO') && (
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSolicitudSeleccionada(sol)}
                          className="px-4 py-2 bg-aneupi-primary text-white text-sm font-bold rounded-lg hover:bg-aneupi-secondary transition-colors cursor-pointer"
                        >
                          {sol.estado === 'RECHAZADO' ? 'Corregir Pago' : 'Subir Pago'}
                        </button>

                        <button 
                          onClick={() => handleEliminar(sol.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar solicitud"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                    
                    {sol.estado === 'APROBADO' && (
                      <button className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors cursor-pointer">
                        Descargar PDF
                      </button>
                    )}
                  </div>
                </div>

                {sol.estado === 'RECHAZADO' && sol.observacionAdmin && (
                  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-start gap-3 animate-fade-in-up">
                    <FaExclamationCircle className="text-red-500 mt-1 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-red-700 uppercase tracking-wider">Motivo del rechazo:</p>
                      <p className="text-sm text-red-600 font-medium">{sol.observacionAdmin}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {solicitudSeleccionada && (
        <ModalSubirPago 
          solicitud={solicitudSeleccionada}
          onClose={() => setSolicitudSeleccionada(null)}
          onSuccess={handleRecargar}
        />
      )}
    </div>
  );
};

export default MisSolicitudes;