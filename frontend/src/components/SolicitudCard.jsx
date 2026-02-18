import React from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const SolicitudCard = ({ solicitud, onPay }) => {
  // Construimos la dirección exacta del archivo
  const pdfUrl = solicitud.pdfGeneradoUrl 
    ? `${API_URL}${solicitud.pdfGeneradoUrl.startsWith('/') ? '' : '/'}${solicitud.pdfGeneradoUrl}`
    : null;

  const getStatusColor = (estado) => {
    switch (estado) {
      case 'APROBADO': return '#10b981'; 
      case 'EN_REVISION': return '#f59e0b'; 
      case 'PENDIENTE_PAGO': return '#ef4444';
      case 'RECHAZADO': return '#dc2626';
      default: return '#6b7280'; 
    }
  };

  return (
    <div style={{
      border: '1px solid #e5e7eb',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: '0 0 5px 0', color: '#111827', fontSize: '18px', fontWeight: 'bold' }}>
          {solicitud.tipoDocumento?.nombre || solicitud.tipoDocumento}
        </h3>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 'bold',
            padding: '4px 12px',
            borderRadius: '20px',
            backgroundColor: getStatusColor(solicitud.estado),
            color: 'white',
            textTransform: 'uppercase'
          }}>
            {solicitud.estado.replace('_', ' ')}
          </span>
          <span style={{ fontSize: '12px', color: '#6b7280' }}>
            Solicitado el: {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
          </span>
        </div>

        {solicitud.codigoSolicitud && (
          <p style={{ 
            margin: 0, 
            fontFamily: 'monospace', 
            color: '#003366', 
            fontSize: '13px',
            fontWeight: 'bold'
          }}>
            DOC: {solicitud.codigoSolicitud}
          </p>
        )}
      </div>

      <div style={{ marginLeft: '20px' }}>
        {solicitud.estado === 'APROBADO' && pdfUrl ? (
          <a 
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#003366',
              color: 'white',
              padding: '12px 24px',
              borderRadius: '8px',
              textDecoration: 'none',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px'
            }}
          >
            📄 Descargar PDF
          </a>
        ) : (solicitud.estado === 'PENDIENTE_PAGO' || solicitud.estado === 'RECHAZADO') ? (
          <button 
            onClick={() => onPay && onPay(solicitud)}
            style={{
              backgroundColor: solicitud.estado === 'RECHAZADO' ? '#4b5563' : '#ef4444',
              color: 'white',
              padding: '12px 20px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {solicitud.estado === 'RECHAZADO' ? '🔄 Corregir Pago' : '💳 Subir Pago'}
          </button>
        ) : (
          <span style={{ color: '#9ca3af', fontStyle: 'italic', fontSize: '13px' }}>
            En revisión por administración...
          </span>
        )}
      </div>
    </div>
  );
};