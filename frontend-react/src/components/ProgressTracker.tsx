import type { Itinerary } from '../types';
import './ProgressTracker.css';

interface ProgressTrackerProps {
  itinerary: Itinerary;
  accommodationCount: number;
  activityCount: number;
  transportCount: number;
}

const ProgressTracker = ({
  itinerary,
  accommodationCount,
  activityCount,
  transportCount,
}: ProgressTrackerProps) => {
  const calculateProgress = () => {
    const steps = [
      itinerary.title && itinerary.destination,
      itinerary.startDate && itinerary.endDate,
      accommodationCount > 0,
      activityCount > 0,
      transportCount > 0,
    ];
    const completed = steps.filter(Boolean).length;
    return (completed / steps.length) * 100;
  };

  const progress = calculateProgress();

  const getDaysUntilTrip = () => {
    const startDate = new Date(itinerary.startDate);
    const today = new Date();
    const diffTime = startDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntil = getDaysUntilTrip();

  return (
    <div className="progress-tracker">
      <h3>Planning Progress</h3>
      
      <div className="progress-bar-container">
        <div 
          className="progress-bar" 
          style={{ width: `${progress}%` }}
        >
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-icon">🏨</span>
          <span className="stat-value">{accommodationCount}</span>
          <span className="stat-label">Accommodations</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🎯</span>
          <span className="stat-value">{activityCount}</span>
          <span className="stat-label">Activities</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">🚆</span>
          <span className="stat-value">{transportCount}</span>
          <span className="stat-label">Transport</span>
        </div>
      </div>

      {daysUntil > 0 && (
        <div className="countdown">
          <p>
            <strong>{daysUntil}</strong> day{daysUntil !== 1 ? 's' : ''} until your trip!
          </p>
        </div>
      )}

      {daysUntil <= 0 && daysUntil > -30 && (
        <div className="countdown active">
          <p>🎉 Your trip is happening now or just ended!</p>
        </div>
      )}

      <div className="checklist">
        <h4>Planning Checklist</h4>
        <label className="checklist-item">
          <input type="checkbox" checked={!!(itinerary.title && itinerary.destination)} readOnly />
          <span>Basic information set</span>
        </label>
        <label className="checklist-item">
          <input type="checkbox" checked={!!(itinerary.startDate && itinerary.endDate)} readOnly />
          <span>Dates confirmed</span>
        </label>
        <label className="checklist-item">
          <input type="checkbox" checked={accommodationCount > 0} readOnly />
          <span>Accommodation booked</span>
        </label>
        <label className="checklist-item">
          <input type="checkbox" checked={activityCount > 0} readOnly />
          <span>Activities planned</span>
        </label>
        <label className="checklist-item">
          <input type="checkbox" checked={transportCount > 0} readOnly />
          <span>Transport arranged</span>
        </label>
      </div>
    </div>
  );
};

export default ProgressTracker;
