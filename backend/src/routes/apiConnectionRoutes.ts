import express from 'express';
import * as apiConnectionController from '../controllers/apiConnectionController';

const router = express.Router();

// Get all API connections
router.get('/', apiConnectionController.getAllConnections);

// Get a single API connection by ID
router.get('/:id', apiConnectionController.getConnectionById);

// Create a new API connection
router.post('/', apiConnectionController.createConnection);

// Update an existing API connection
router.put('/:id', apiConnectionController.updateConnection);

// Delete an API connection
router.delete('/:id', apiConnectionController.deleteConnection);

// Add sample connections (for testing)
router.post('/samples', apiConnectionController.addSampleConnections);

export default router;
