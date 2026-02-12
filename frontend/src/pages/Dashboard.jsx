import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import api from '../services/api';
import DocumentoCard from '../components/DocumentoCard';
import { toast } from 'sonner';
import { FaSpinner } from 'react-icons/fa';

const Dashboard = () => {
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  
  
  const navigate = useNavigate();

  // 1. Cargar documentos al iniciar
  useEffect(() => {
    const cargarDocumentos = async () => {
      try {
        const response = await api.get('/api/documentos'); 
        setDocumentos(response.data);
      } catch (error) {
        console.error(error);
        toast.error("Error al conectar con el servidor");
      } finally {
        setLoading(false);
      }
    };
    cargarDocumentos();
  }, []);

  // 2. Función para manejar el clic en "Solicitar"
  const handleSolicitar = async (doc) => {
    try {
      
      const USUARIO_ID_TEMPORAL = 1; 

      
      await api.post('/api/solicitudes', {
        usuarioId: USUARIO_ID_TEMPORAL,
        tipoDocumentoId: doc.id
      });
      
      toast.success(`Solicitud de "${doc.nombre}" creada.`);
      
      
      navigate('/dashboard/mis-solicitudes');

    } catch (error) {
      console.error("Error al solicitar:", error);
      toast.error("Error al procesar la solicitud. Intenta nuevamente.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-aneupi-secondary">
        <FaSpinner className="animate-spin text-4xl" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-aneupi-primary font-serif">Formatos Disponibles</h2>
        <p className="text-gray-600 mt-1">Selecciona el documento que necesitas y sigue el proceso de solicitud.</p>
      </div>

      {/* Rejilla de Tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documentos.map((doc) => (
          <DocumentoCard 
            key={doc.id} 
            documento={doc} 
            onSolicitar={handleSolicitar} 
          />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;