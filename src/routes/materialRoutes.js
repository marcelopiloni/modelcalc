const express = require('express');
const router = express.Router();
const MaterialController = require('../controllers/MaterialController');
const auth = require('../middleware/auth');

router.post('/', auth, MaterialController.createMaterial.bind(MaterialController));
router.get('/', auth, MaterialController.getAllMaterials.bind(MaterialController));
router.get('/:id', auth, MaterialController.getMaterialById.bind(MaterialController));
router.put('/:id', auth, MaterialController.updateMaterial.bind(MaterialController));
router.delete('/:id', auth, MaterialController.deleteMaterial.bind(MaterialController));

module.exports = router;
