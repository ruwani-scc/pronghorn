import type { Activity } from '../types';
import './ActivityList.css';

interface ActivityListProps {
  activities: Activity[];
  onEdit?: (activity: Activity) => void;
  onDelete?: (id: string) => void;
}

const ActivityList = ({ activities, onEdit, onDelete }: ActivityListProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      sightseeing: '🏛️',
      dining: '🍽️',
      adventure: '🎢',
      culture: '🎭',
      relaxation: '🧘',
      other: '📌',
    };
    return icons[category] || '📌';
  };

  if (activities.length === 0) {
    return (
      <div className="empty-state">
        <p>No activities added yet.</p>
      </div>
    );
  }

  // Sort activities by date
  const sortedActivities = [...activities].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="activity-list">
      {sortedActivities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <div className="item-header">
            <h4>
              {getCategoryIcon(activity.category)} {activity.title}
            </h4>
            <span className="category-badge">{activity.category}</span>
          </div>
          <p className="date">
            📅 {formatDate(activity.date)}
            {activity.startTime && activity.endTime && (
              <span> | ⏰ {activity.startTime} - {activity.endTime}</span>
            )}
          </p>
          <p className="location">📍 {activity.location}</p>
          {activity.description && (
            <p className="description">{activity.description}</p>
          )}
          {activity.price && (
            <p className="price">
              💰 {activity.currency || '$'}{activity.price.toLocaleString()}
            </p>
          )}
          {activity.bookingRequired && (
            <p className="booking">
              🎫 Booking Required
              {activity.bookingUrl && (
                <a href={activity.bookingUrl} target="_blank" rel="noopener noreferrer" className="booking-link">
                  Book Now
                </a>
              )}
            </p>
          )}
          {activity.notes && (
            <p className="notes">{activity.notes}</p>
          )}
          <div className="item-actions">
            {onEdit && (
              <button onClick={() => onEdit(activity)} className="btn btn-edit">
                Edit
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(activity.id)} className="btn btn-delete">
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityList;
