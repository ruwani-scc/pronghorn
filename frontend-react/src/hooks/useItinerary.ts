import { useState, useEffect, useCallback } from 'react';
import { itineraryApi, accommodationApi, activityApi, transportApi } from '../services/api';
import type {
  Itinerary,
  Accommodation,
  Activity,
  Transport,
  CreateItineraryDTO,
  UpdateItineraryDTO,
} from '../types';

export const useItineraries = () => {
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItineraries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await itineraryApi.getAll();
      setItineraries(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItineraries();
  }, [fetchItineraries]);

  const createItinerary = async (data: CreateItineraryDTO) => {
    try {
      const newItinerary = await itineraryApi.create(data);
      setItineraries((prev) => [...prev, newItinerary]);
      return newItinerary;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  const deleteItinerary = async (id: string) => {
    try {
      await itineraryApi.delete(id);
      setItineraries((prev) => prev.filter((it) => it.id !== id));
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    itineraries,
    loading,
    error,
    refetch: fetchItineraries,
    createItinerary,
    deleteItinerary,
  };
};

export const useItinerary = (id: string) => {
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [transports, setTransports] = useState<Transport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchItinerary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [itineraryData, accommodationsData, activitiesData, transportsData] = await Promise.all([
        itineraryApi.getById(id),
        accommodationApi.getByItinerary(id),
        activityApi.getByItinerary(id),
        transportApi.getByItinerary(id),
      ]);
      setItinerary(itineraryData);
      setAccommodations(accommodationsData);
      setActivities(activitiesData);
      setTransports(transportsData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItinerary();
  }, [fetchItinerary]);

  const updateItinerary = async (data: UpdateItineraryDTO) => {
    try {
      const updated = await itineraryApi.update(id, data);
      setItinerary(updated);
      return updated;
    } catch (err) {
      setError(err as Error);
      throw err;
    }
  };

  return {
    itinerary,
    accommodations,
    activities,
    transports,
    loading,
    error,
    refetch: fetchItinerary,
    updateItinerary,
  };
};
