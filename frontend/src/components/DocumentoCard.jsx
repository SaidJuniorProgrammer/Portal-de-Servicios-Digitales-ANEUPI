import { FaShoppingCart } from 'react-icons/fa';

const DocumentoCard = ({ documento, onSolicitar }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow flex flex-col justify-between h-full">
      
      {/* Encabezado */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2 font-serif">
          {documento.nombre}
        </h3>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          {documento.descripcion || "Documento oficial certificado por ANEUPI."}
        </p>
      </div>

      {/* Pie: Precio y Botón */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <span className="text-2xl font-bold text-aneupi-secondary">
          ${Number(documento.precio).toFixed(2)}
        </span>
        
        <button 
          onClick={() => onSolicitar(documento)}
          className="flex items-center gap-2 bg-aneupi-secondary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-aneupi-primary transition-colors shadow-sm active:transform active:scale-95"
        >
          <FaShoppingCart />
          Solicitar
        </button>
      </div>
    </div>
  );
};

export default DocumentoCard;