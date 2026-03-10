import type { Transport } from '../types';
import './TransportList.css';

interface TransportListProps {
  transports: Transport[];
  onEdit?: (transport: Transport) => void;
  onDelete?: (id: string) => void;
}

const TransportList = ({ transports, onEdit, onDelete }: TransportListProps) => {
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTransportIcon = (type: string) => {
    const icons: Record<string, string> = {
      flight: '✈️',
      train: '🚆',
      bus: '🚌',
      car: '🚗',
      ferry: '⛴️',
      other: '🚊',
    };
    return icons[type] || '🚊';
  };

  if (transports.length === 0) {
    return (
      <div className="empty-state">
        <p>No transport added yet.</p>
      </div>
    );
  }

  // Sort transports by departure time
  const sortedTransports = [...transports].sort((a, b) => 
    new Date(a.departureDateTime).getTime() - new Date(b.departureDateTime).getTime()
  );

  return (
    <div className="transport-list">
      {sortedTransports.map((transport) => (
        <div key={transport.id} className="transport-item">
          <div className="item-header">
            <h4>
              {getTransportIcon(transport.type)} {transport.type.toUpperCase()}
            </h4>
            {transport.provider && (
              <span className="provider">{transport.provider}</span>
            )}
          </div>
          
          <div className="route">
            <div className="route-point">
              <span className="label">Departure</span>
              <p className="location">{transport.departureLocation}</p>
              <p className="time">{formatDateTime(transport.departureDateTime)}</p>
            </div>
            <div className="route-arrow">→</div>
            <div className="route-point">
              <span className="label">Arrival</span>
              <p className="location">{transport.arrivalLocation}</p>
              <p className="time">{formatDateTime(transport.arrivalDateTime)}</p>
            </div>
          </div>

          {transport.bookingReference && (
            <p className="booking-ref">
              🎫 Booking Reference: <strong>{transport.bookingReference}</strong>
            </p>
          )}
          {transport.price && (
            <p className="price">
              💰 {transport.currency || '$'}{transport.price.toLocaleString()}
            </p>
          )}
          {transport.notes && (
            <p className="notes">{transport.notes}</p>
          )}
          <div className="item-actions">
            {onEdit && (
              <button onClick={() => onEdit(transport)} className="btn btn-edit">
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(transport.id)} className="btn btn-delete">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransportList;
