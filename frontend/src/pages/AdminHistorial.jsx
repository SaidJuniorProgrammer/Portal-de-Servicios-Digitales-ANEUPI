import { useState, useEffect } from 'react';
import { FaHistory, FaSearch, FaFilePdf, FaBarcode } from 'react-icons/fa';
import api from '../services/api';

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
    } finally {
      setLoading(false);
    }
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
            placeholder="Buscar por código (ANEUPI-2026...)" 
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
            {filtrados.map((sol) => (
              <tr key={sol.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4 font-mono font-bold text-blue-600">{sol.codigoSolicitud}</td>
                <td className="p-4 text-gray-700 font-medium">{sol.usuario?.nombreCompleto}</td>
                <td className="p-4 text-sm text-gray-600">{sol.tipoDocumento?.nombre}</td>
                <td className="p-4 text-sm text-gray-500">
                  {new Date(sol.fechaAprobacion).toLocaleDateString()}
                </td>
                <td className="p-4 text-center">
                  <button className="text-red-500 hover:text-red-700 transition-colors text-xl">
                    <FaFilePdf />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHistorial;