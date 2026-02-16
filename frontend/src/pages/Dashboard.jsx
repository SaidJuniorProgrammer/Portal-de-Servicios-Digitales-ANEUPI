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

  const handleSolicitar = async (doc) => {
    try {
      const data = localStorage.getItem('usuario_aneupi');
      if (!data) {
        toast.error("Sesión no válida. Por favor, inicia sesión de nuevo.");
        navigate('/login');
        return;
      }
      
      const usuario = JSON.parse(data);
      const USUARIO_ID = usuario.id;

      await api.post('/api/solicitudes', {
        usuarioId: USUARIO_ID,
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
    <div className="animate-fade-in">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-aneupi-primary font-serif">Formatos Disponibles</h2>
        <p className="text-gray-600 mt-1">Selecciona el documento que necesitas y sigue el proceso de solicitud.</p>
      </div>

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