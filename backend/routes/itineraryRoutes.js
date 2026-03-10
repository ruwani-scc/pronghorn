/**
 * Itinerary Routes
 * Handles all itinerary-related API endpoints
 * 
 * Endpoints:
 * GET    /api/v1/itineraries      - List user's itineraries
 * POST   /api/v1/itineraries      - Create new itinerary
 * GET    /api/v1/itineraries/:id  - Get single itinerary
 * PUT    /api/v1/itineraries/:id  - Update itinerary
 * DELETE /api/v1/itineraries/:id  - Delete itinerary
 */

const express = require('express');
const router = express.Router();
const ItineraryController = require('../controllers/ItineraryController');

// List all itineraries for authenticated user
router.get('/', ItineraryController.list);

// Create new itinerary
router.post('/', ItineraryController.create);

// Get single itinerary by ID
router.get('/:id', ItineraryController.read);

// Update itinerary
router.put('/:id', ItineraryController.update);

// Delete itinerary
router.delete('/:id', ItineraryController.delete);

module.exports = router;
