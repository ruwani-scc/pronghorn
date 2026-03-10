/**
 * Seed Data for Development and Testing
 * Creates sample users, itineraries, and items
 */

-- Insert test users
INSERT INTO users (id, email, auth_provider_id, created_at) VALUES
  ('123e4567-e89b-12d3-a456-426614174999', 'john.doe@example.com', 'auth0|user1', NOW()),
  ('223e4567-e89b-12d3-a456-426614174999', 'jane.smith@example.com', 'auth0|user2', NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert sample itineraries for user 1
INSERT INTO itineraries (id, user_id, title, destination, start_date, end_date, description, created_at) VALUES
  (
    '323e4567-e89b-12d3-a456-426614174000',
    '123e4567-e89b-12d3-a456-426614174999',
    'Summer Vacation in Paris',
    'Paris, France',
    '2024-07-01',
    '2024-07-15',
    'Two week vacation exploring Paris and surrounding areas',
    NOW()
  ),
  (
    '323e4567-e89b-12d3-a456-426614174001',
    '123e4567-e89b-12d3-a456-426614174999',
    'Tokyo Adventure',
    'Tokyo, Japan',
    '2024-10-10',
    '2024-10-20',
    'Exploring Tokyo culture, food, and technology',
    NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample itinerary items for Paris trip
INSERT INTO itinerary_items (
  id, itinerary_id, category, title, description,
  start_datetime, end_datetime, location, confirmation_code,
  cost, currency, metadata, display_order, is_completed
) VALUES
  -- Accommodations
  (
    '423e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174000',
    'accommodation',
    'Hotel Luxe Paris',
    'Luxury hotel in the heart of Paris',
    '2024-07-01 15:00:00',
    '2024-07-15 11:00:00',
    '123 Champs-Élysées, 75008 Paris, France',
    'HLP-2024-12345',
    2500.00,
    'USD',
    '{"stars": 5, "room_type": "Deluxe Suite", "amenities": ["WiFi", "Breakfast", "Pool"]}',
    0,
    false
  ),
  -- Activities
  (
    '423e4567-e89b-12d3-a456-426614174001',
    '323e4567-e89b-12d3-a456-426614174000',
    'activity',
    'Eiffel Tower Tour',
    'Guided tour with skip-the-line access to the top',
    '2024-07-02 10:00:00',
    '2024-07-02 12:30:00',
    'Eiffel Tower, Champ de Mars, Paris',
    'ETT-67890',
    75.00,
    'USD',
    '{"tour_type": "Guided", "group_size": 15, "includes": ["Skip-the-line", "Audio guide"]}',
    1,
    false
  ),
  (
    '423e4567-e89b-12d3-a456-426614174002',
    '323e4567-e89b-12d3-a456-426614174000',
    'activity',
    'Louvre Museum Visit',
    'Full day at the Louvre with expert art historian guide',
    '2024-07-03 09:00:00',
    '2024-07-03 17:00:00',
    'Louvre Museum, Rue de Rivoli, Paris',
    'LMV-11223',
    120.00,
    'USD',
    '{"tour_type": "Private", "duration": "8 hours", "includes": ["Lunch", "Guide"]}',
    2,
    false
  ),
  (
    '423e4567-e89b-12d3-a456-426614174003',
    '323e4567-e89b-12d3-a456-426614174000',
    'activity',
    'Seine River Dinner Cruise',
    'Romantic dinner cruise along the Seine River',
    '2024-07-05 19:00:00',
    '2024-07-05 22:00:00',
    'Port de la Bourdonnais, Paris',
    'SRC-44556',
    150.00,
    'USD',
    '{"cruise_type": "Dinner", "cuisine": "French", "includes": ["3-course meal", "Wine"]}',
    3,
    false
  ),
  -- Transport
  (
    '423e4567-e89b-12d3-a456-426614174004',
    '323e4567-e89b-12d3-a456-426614174000',
    'transport',
    'Flight to Paris',
    'Direct flight from New York JFK to Paris CDG',
    '2024-07-01 18:00:00',
    '2024-07-02 08:00:00',
    'Charles de Gaulle Airport, Paris',
    'AF-123-ABCDEF',
    850.00,
    'USD',
    '{"airline": "Air France", "flight_number": "AF123", "class": "Economy", "seat": "24A"}',
    4,
    false
  ),
  (
    '423e4567-e89b-12d3-a456-426614174005',
    '323e4567-e89b-12d3-a456-426614174000',
    'transport',
    'Return Flight to New York',
    'Direct flight from Paris CDG to New York JFK',
    '2024-07-15 14:00:00',
    '2024-07-15 17:00:00',
    'Charles de Gaulle Airport, Paris',
    'AF-456-GHIJKL',
    850.00,
    'USD',
    '{"airline": "Air France", "flight_number": "AF456", "class": "Economy", "seat": "24B"}',
    5,
    false
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample items for Tokyo trip
INSERT INTO itinerary_items (
  id, itinerary_id, category, title, description,
  start_datetime, end_datetime, location, confirmation_code,
  cost, currency, display_order, is_completed
) VALUES
  (
    '523e4567-e89b-12d3-a456-426614174000',
    '323e4567-e89b-12d3-a456-426614174001',
    'accommodation',
    'Tokyo Grand Hotel',
    'Modern hotel in Shibuya district',
    '2024-10-10 14:00:00',
    '2024-10-20 12:00:00',
    'Shibuya, Tokyo, Japan',
    'TGH-2024-78901',
    1800.00,
    'USD',
    0,
    false
  ),
  (
    '523e4567-e89b-12d3-a456-426614174001',
    '323e4567-e89b-12d3-a456-426614174001',
    'activity',
    'Mount Fuji Day Trip',
    'Guided day trip to Mount Fuji with lunch',
    '2024-10-12 07:00:00',
    '2024-10-12 19:00:00',
    'Mount Fuji, Japan',
    'MFT-23456',
    200.00,
    'USD',
    1,
    false
  )
ON CONFLICT (id) DO NOTHING;
