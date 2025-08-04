import express from 'express';
import { registerClient, loginClient } from '../controllers/clientController.js';
import validateClient from '../middleware/validateClient.js';



const router = express.Router();

router.post('/register', validateClient, registerClient);
router.post('/login', loginClient);

export default router;