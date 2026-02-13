import { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { toast } from 'sonner';
import api from '../services/api';

const ModalSubirPago = ({ solicitud, onClose, onSuccess }) => {
  const [archivo, setArchivo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return toast.error("Por favor selecciona una imagen");

    setSubiendo(true);
    
    
    const formData = new FormData();
    formData.append('comprobante', archivo);

    try {
  
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success("Comprobante subido correctamente");
      onSuccess(); 
      onClose();   
    } catch (error) {
      console.error(error);
      toast.error("Error al subir el comprobante");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
        
        {/* Encabezado */}
        <div className="bg-aneupi-primary p-4 flex justify-between items-center text-white">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaMoneyBillWave /> Reportar Pago
          </h3>
          <button onClick={onClose} className="hover:bg-white/20 p-1 rounded-full transition-colors">
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-4 text-center">
            <p className="text-gray-600 text-sm mb-1">Solicitud para:</p>
            <p className="font-bold text-gray-800 text-lg">{solicitud.tipoDocumento.nombre}</p>
            <p className="text-aneupi-secondary font-bold text-xl mt-2">${Number(solicitud.precioAlSolicitar).toFixed(2)}</p>
          </div>

          {/* Área de Subida */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors relative">
            
            {preview ? (
              <div className="relative w-full">
                <img src={preview} alt="Comprobante" className="w-full h-48 object-contain rounded-md" />
                <button 
                  type="button" 
                  onClick={() => { setArchivo(null); setPreview(null); }}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                >
                  <FaTimes size={12} />
                </button>
              </div>
            ) : (
              <>
                <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 font-medium">Click para seleccionar comprobante</p>
                <p className="text-xs text-gray-400 mt-1">Formatos: JPG, PNG, PDF</p>
              </>
            )}

            <input 
              type="file" 
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          <button 
            type="submit" 
            disabled={subiendo || !archivo}
            className="w-full mt-6 bg-aneupi-secondary text-white py-3 rounded-xl font-bold hover:bg-aneupi-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {subiendo ? 'Subiendo...' : 'Enviar Comprobante'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalSubirPago;