import express from 'express';
import * as apiProxyController from '../controllers/apiProxyController';

const router = express.Router();

// Proxy an API request to the target service
router.post('/:connectionId', apiProxyController.proxyRequest);

// Get API request logs
router.get('/logs', apiProxyController.getLogs);

export default router;
