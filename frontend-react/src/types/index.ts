export interface Itinerary {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destination: string;
  userId?: string;
  status: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  budget?: number;
  currency?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Accommodation {
  id: string;
  itineraryId: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'other';
  address: string;
  checkInDate: string;
  checkOutDate: string;
  price?: number;
  currency?: string;
  confirmationNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Activity {
  id: string;
  itineraryId: string;
  title: string;
  description?: string;
  category: 'sightseeing' | 'dining' | 'adventure' | 'culture' | 'relaxation' | 'other';
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  price?: number;
  currency?: string;
  bookingRequired: boolean;
  bookingUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Transport {
  id: string;
  itineraryId: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'other';
  provider?: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDateTime: string;
  arrivalDateTime: string;
  bookingReference?: string;
  price?: number;
  currency?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateItineraryDTO {
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  destination: string;
  status?: 'draft' | 'confirmed' | 'completed' | 'cancelled';
  budget?: number;
  currency?: string;
}

export interface UpdateItineraryDTO extends Partial<CreateItineraryDTO> {}

export interface CreateAccommodationDTO {
  itineraryId: string;
  name: string;
  type: 'hotel' | 'hostel' | 'apartment' | 'resort' | 'other';
  address: string;
  checkInDate: string;
  checkOutDate: string;
  price?: number;
  currency?: string;
  confirmationNumber?: string;
  notes?: string;
}

export interface UpdateAccommodationDTO extends Partial<Omit<CreateAccommodationDTO, 'itineraryId'>> {}

export interface CreateActivityDTO {
  itineraryId: string;
  title: string;
  description?: string;
  category: 'sightseeing' | 'dining' | 'adventure' | 'culture' | 'relaxation' | 'other';
  date: string;
  startTime?: string;
  endTime?: string;
  location: string;
  price?: number;
  currency?: string;
  bookingRequired: boolean;
  bookingUrl?: string;
  notes?: string;
}

export interface UpdateActivityDTO extends Partial<Omit<CreateActivityDTO, 'itineraryId'>> {}

export interface CreateTransportDTO {
  itineraryId: string;
  type: 'flight' | 'train' | 'bus' | 'car' | 'ferry' | 'other';
  provider?: string;
  departureLocation: string;
  arrivalLocation: string;
  departureDateTime: string;
  arrivalDateTime: string;
  bookingReference?: string;
  price?: number;
  currency?: string;
  notes?: string;
}

export interface UpdateTransportDTO extends Partial<Omit<CreateTransportDTO, 'itineraryId'>> {}
