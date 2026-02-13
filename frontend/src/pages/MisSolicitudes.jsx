import { useEffect, useState } from 'react';
import api from '../services/api';
import { FaFilePdf, FaClock, FaCheckCircle, FaTrash } from 'react-icons/fa'; 
import { toast } from 'sonner';
import ModalSubirPago from '../components/ModalSubirPago';

const MisSolicitudes = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    const USUARIO_ID = 1; 
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
    <div>
      <h2 className="text-2xl font-bold text-aneupi-primary font-serif mb-6">Mis Solicitudes</h2>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {solicitudes.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No tienes solicitudes aún.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {solicitudes.map((sol) => (
              <div key={sol.id} className="p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-aneupi-accent rounded-lg text-aneupi-primary">
                    <FaFilePdf className="text-xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{sol.tipoDocumento.nombre}</h3>
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
                    {sol.estado === 'APROBADO' && <FaCheckCircle />}
                    {sol.estado.replace('_', ' ')}
                  </span>

                  
                  {sol.estado === 'PENDIENTE_PAGO' && (
                    <>
                      <button 
                        onClick={() => setSolicitudSeleccionada(sol)}
                        className="px-4 py-2 bg-aneupi-primary text-white text-sm font-bold rounded-lg hover:bg-aneupi-secondary transition-colors"
                      >
                        Subir Pago
                      </button>

                      
                      <button 
                        onClick={() => handleEliminar(sol.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar solicitud"
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                  
                  {sol.estado === 'APROBADO' && (
                    <button className="px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-lg hover:bg-green-700 transition-colors">
                      Descargar PDF
                    </button>
                  )}
                </div>

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