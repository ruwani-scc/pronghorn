import type { Accommodation } from '../types';
import './AccommodationList.css';

interface AccommodationListProps {
  accommodations: Accommodation[];
  onEdit?: (accommodation: Accommodation) => void;
  onDelete?: (id: string) => void;
}

const AccommodationList = ({ accommodations, onEdit, onDelete }: AccommodationListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (accommodations.length === 0) {
    return (
      <div className="empty-state">
        <p>No accommodations added yet.</p>
      </div>
    );
  }

  return (
    <div className="accommodation-list">
      {accommodations.map((accommodation) => (
        <div key={accommodation.id} className="accommodation-item">
          <div className="item-header">
            <h4>{accommodation.name}</h4>
            <span className="type-badge">{accommodation.type}</span>
          </div>
          <p className="address">📍 {accommodation.address}</p>
          <p className="dates">
            📅 Check-in: {formatDate(accommodation.checkInDate)} | Check-out: {formatDate(accommodation.checkOutDate)}
          </p>
          {accommodation.price && (
            <p className="price">
              💰 {accommodation.currency || '$'}{accommodation.price.toLocaleString()}
            </p>
          )}
          {accommodation.confirmationNumber && (
            <p className="confirmation">
              🎫 Confirmation: {accommodation.confirmationNumber}
            </p>
          )}
          {accommodation.notes && (
            <p className="notes">{accommodation.notes}</p>
          )}
          <div className="item-actions">
            {onEdit && (
              <button onClick={() => onEdit(accommodation)} className="btn btn-edit">
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(accommodation.id)} className="btn btn-delete">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AccommodationList;
