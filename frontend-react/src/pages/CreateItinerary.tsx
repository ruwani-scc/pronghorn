import { useNavigate } from 'react-router-dom';
import ItineraryForm from '../components/ItineraryForm';
import { itineraryApi } from '../services/api';
import type { CreateItineraryDTO } from '../types';
import './CreateItinerary.css';

const CreateItinerary = () => {
  const navigate = useNavigate();

  const handleSubmit = async (data: CreateItineraryDTO) => {
    try {
      const newItinerary = await itineraryApi.create(data);
      navigate(`/itineraries/${newItinerary.id}`);
    } catch (err) {
      console.error('Failed to create itinerary:', err);
      alert('Failed to create itinerary. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="create-itinerary">
      <div className="page-header">
        <h1>Create New Itinerary</h1>
        <p>Start planning your next adventure</p>
      </div>
      <ItineraryForm onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
};

export default CreateItinerary;
