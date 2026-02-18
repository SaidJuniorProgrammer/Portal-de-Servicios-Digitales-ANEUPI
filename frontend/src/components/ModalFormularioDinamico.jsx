import { useState } from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

const ModalFormularioDinamico = ({ documento, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(formData);
  };

  if (!documento.camposRequeridos || documento.camposRequeridos.length === 0) {
    onConfirm({}); 
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-aneupi-primary font-serif">Información Adicional</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-gray-500 mb-4">Para generar el <b>{documento.nombre}</b>, necesitamos estos datos:</p>
          
          {documento.camposRequeridos.map((campo) => (
            <div key={campo.name} className="space-y-1">
              <label className="text-xs font-bold text-gray-700 uppercase">{campo.label}</label>
              <input
                required
                type={campo.type}
                name={campo.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-aneupi-primary outline-none"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button type="button" onClick={onClose} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
            <button type="submit" className="flex-1 py-3 bg-aneupi-primary text-white rounded-xl font-bold shadow-lg shadow-aneupi-primary/30">Confirmar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalFormularioDinamico;