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
      if (file.size > 5 * 1024 * 1024) {
        return toast.error("El archivo es muy pesado (máximo 5MB)");
      }
      setArchivo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const convertirABase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => resolve(fileReader.result);
      fileReader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!archivo) return toast.error("Por favor selecciona una imagen");

    setSubiendo(true);

    try {
      const base64String = await convertirABase64(archivo);

      const payload = {
        nombreArchivo: archivo.name,
        extensionArchivo: archivo.name.split('.').pop(),
        imagenBase64: base64String
      };

      await api.put(`/api/solicitudes/${solicitud.id}/comprobante`, payload);
      
      toast.success("Comprobante enviado correctamente");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.error;
      toast.error(errorMsg && errorMsg.length < 100 ? errorMsg : "Error al subir el comprobante");
    } finally {
      setSubiendo(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100 border border-gray-100">
        
        <div className="bg-aneupi-primary p-4 flex justify-between items-center text-white shadow-md">
          <h3 className="font-bold text-lg flex items-center gap-2 font-serif">
            <FaMoneyBillWave /> Reportar Pago
          </h3>
          <button 
            onClick={onClose} 
            className="hover:bg-white/20 p-2 rounded-full transition-colors cursor-pointer"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6 text-center bg-gray-50 p-4 rounded-xl border border-gray-100">
            <p className="text-gray-500 text-xs uppercase tracking-wide font-bold mb-1">Solicitud para:</p>
            <p className="font-bold text-gray-800 text-lg leading-tight mb-2 font-serif">{solicitud.tipoDocumento.nombre}</p>
            <div className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
               Valor a pagar: ${Number(solicitud.precioAlSolicitar).toFixed(2)}
            </div>
          </div>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-blue-50 transition-colors relative min-h-[180px] group cursor-pointer">
            
            <input 
              type="file" 
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
            />

            {preview ? (
              <div className="relative w-full text-center">
                <img src={preview} alt="Comprobante" className="max-h-40 mx-auto object-contain rounded-md shadow-sm border border-gray-200" />
                <p className="text-xs text-gray-500 mt-2 truncate max-w-[200px] mx-auto font-medium">{archivo.name}</p>
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                    <p className="text-white text-sm font-bold">Cambiar imagen</p>
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white p-4 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                   <FaCloudUploadAlt className="text-4xl text-aneupi-primary" />
                </div>
                <p className="text-sm text-gray-600 font-bold">Sube tu comprobante aquí</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">Formatos permitidos: JPG, PNG</p>
              </>
            )}
          </div>

          <button 
            type="submit" 
            disabled={subiendo || !archivo}
            className="w-full mt-6 bg-aneupi-secondary text-white py-4 rounded-xl font-bold hover:bg-aneupi-primary active:scale-95 transition-all shadow-lg shadow-aneupi-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 cursor-pointer"
          >
            {subiendo ? (
              <>
                 <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                 </svg>
                 <span>Procesando envío...</span>
              </>
            ) : 'Confirmar y Enviar Pago'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ModalSubirPago;