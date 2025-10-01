// routes/clientRoutes.js
const express = require('express');
const router = express.Router();
const ClientController = require('../controllers/ClientController');

router.post('/', ClientController.createClient.bind(ClientController));
router.get('/', ClientController.getAllClients.bind(ClientController));
router.get('/:id', ClientController.getClientById.bind(ClientController));
router.put('/:id', ClientController.updateClient.bind(ClientController));
router.delete('/:id', ClientController.deleteClient.bind(ClientController));

module.exports = router;
