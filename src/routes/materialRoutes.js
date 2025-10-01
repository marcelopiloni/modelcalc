// routes/materialRoutes.js
const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/MaterialController');

router.post('/', MaterialController.createMaterial.bind(MaterialController));
router.get('/', MaterialController.getAllMaterials.bind(MaterialController));
router.get('/:id', MaterialController.getMaterialById.bind(MaterialController));
router.put('/:id', MaterialController.updateMaterial.bind(MaterialController));
router.delete('/:id', MaterialController.deleteMaterial.bind(MaterialController));

module.exports = router;
