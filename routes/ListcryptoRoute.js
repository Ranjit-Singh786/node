import express from 'express';
import ListCryptoController from '../controllers/ListCryptoController.js';

var router = express.Router();

// Define Routes Below
router.get('/get', ListCryptoController.get_list);

export const ListCyrptoRoutes = router ;