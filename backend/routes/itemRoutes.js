/**
 * Itinerary Item Routes
 * Handles all itinerary item-related API endpoints
 * 
 * Endpoints:
 * GET    /api/v1/itineraries/:id/items  - List items for itinerary
 * POST   /api/v1/itineraries/:id/items  - Add item to itinerary
 * PUT    /api/v1/items/:id              - Update item
 * DELETE /api/v1/items/:id              - Delete item
 * POST   /api/v1/items/bulk             - Bulk operations
 */

const express = require('express');
const router = express.Router();
const ItemController = require('../controllers/ItemController');

// List all items for a specific itinerary
router.get('/itineraries/:id/items', ItemController.listByItinerary);

// Create new item for itinerary
router.post('/itineraries/:id/items', ItemController.create);

// Update specific item
router.put('/items/:id', ItemController.update);

// Delete specific item
router.delete('/items/:id', ItemController.delete);

// Bulk operations (reorder, bulk delete, etc.)
router.post('/items/bulk', ItemController.bulkOperation);

module.exports = router;
