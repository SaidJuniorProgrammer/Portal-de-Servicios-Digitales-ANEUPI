import { useState, useEffect } from 'react';
import { FaHistory, FaSearch, FaFilePdf, FaBarcode } from 'react-icons/fa';
import api from '../services/api';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AdminHistorial = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    fetchAprobados();
  }, []);

  const fetchAprobados = async () => {
    try {
      const res = await api.get('/api/solicitudes');
     
      const aprobados = res.data.filter(s => s.estado === 'APROBADO');
      setSolicitudes(aprobados);
    } catch (error) {
      console.error(error);
      toast.error("Error al cargar el historial");
    } finally {
      setLoading(false);
    }
  };

  const handleVerPDF = (pdfUrl) => {
    if (!pdfUrl) {
      return toast.error("Este documento no tiene un archivo físico generado.");
    }

    
    const pathLimpio = pdfUrl.startsWith('/') ? pdfUrl : `/${pdfUrl}`;
    const urlCompleta = `${API_URL}${pathLimpio}`;

    
    const link = document.createElement('a');
    link.href = urlCompleta;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Visualizando documento oficial...");
  };

  const filtrados = solicitudes.filter(s => 
    (s.codigoSolicitud || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    (s.usuario?.nombreCompleto || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-aneupi-primary flex items-center gap-3 font-serif">
            <FaHistory className="text-aneupi-secondary" />
            Historial de Documentos
          </h1>
          <p className="text-gray-500">Consulta y descarga de solicitudes finalizadas</p>
        </div>

        <div className="relative w-80">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-aneupi-primary" />
          <input 
            type="text" 
            placeholder="Buscar por código o nombre..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aneupi-primary outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-aneupi-primary font-bold uppercase text-xs">
            <tr>
              <th className="p-4"><FaBarcode className="inline mr-2"/> Código Único</th>
              <th className="p-4">Accionista</th>
              <th className="p-4">Documento</th>
              <th className="p-4">Fecha Aprobación</th>
              <th className="p-4 text-center">Archivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">Cargando historial...</td></tr>
            ) : filtrados.length === 0 ? (
              <tr><td colSpan="5" className="p-10 text-center text-gray-400">No se encontraron documentos aprobados.</td></tr>
            ) : (
              filtrados.map((sol) => (
                <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono font-bold text-blue-600 text-sm">
                    {sol.codigoSolicitud || 'SIN CÓDIGO'}
                  </td>
                  <td className="p-4 text-gray-700 font-medium">
                    {sol.usuario?.nombreCompleto || 'Usuario Desconocido'}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {sol.tipoDocumento?.nombre || sol.tipoDocumento}
                  </td>
                  <td className="p-4 text-sm text-gray-500">
                    {sol.fechaAprobacion ? new Date(sol.fechaAprobacion).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleVerPDF(sol.pdfGeneradoUrl)}
                      className={`text-xl transition-all transform active:scale-90 ${sol.pdfGeneradoUrl ? 'text-red-500 hover:text-red-700 cursor-pointer' : 'text-gray-200 cursor-not-allowed'}`}
                      title={sol.pdfGeneradoUrl ? "Ver PDF oficial" : "PDF no disponible"}
                    >
                      <FaFilePdf />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHistorial;