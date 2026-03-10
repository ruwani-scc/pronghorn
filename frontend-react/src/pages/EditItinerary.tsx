import { useNavigate, useParams } from 'react-router-dom';
import { useItinerary } from '../hooks/useItinerary';
import ItineraryForm from '../components/ItineraryForm';
import type { CreateItineraryDTO } from '../types';
import './EditItinerary.css';

const EditItinerary = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { itinerary, loading, error, updateItinerary } = useItinerary(id!);

  const handleSubmit = async (data: CreateItineraryDTO) => {
    try {
      await updateItinerary(data);
      navigate(`/itineraries/${id}`);
    } catch (err) {
      console.error('Failed to update itinerary:', err);
      alert('Failed to update itinerary. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate(`/itineraries/${id}`);
  };

  if (loading) {
    return (
      <div className="edit-itinerary">
        <div className="loading">Loading itinerary...</div>
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <div className="edit-itinerary">
        <div className="error">
          <h2>Error loading itinerary</h2>
          <p>{error?.message || 'Itinerary not found'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="edit-itinerary">
      <div className="page-header">
        <h1>Edit Itinerary</h1>
        <p>Update your travel plans</p>
      </div>
      <ItineraryForm
        initialData={itinerary}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditItinerary;
