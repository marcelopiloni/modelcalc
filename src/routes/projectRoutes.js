const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const { validateProject } = require('../middleware/validation');
const auth = require('../middleware/auth');

// Project CRUD routes
router.post('/', auth, validateProject, ProjectController.createProject.bind(ProjectController));
router.get('/', auth, ProjectController.getAllProjects.bind(ProjectController));
router.get('/:id', auth, ProjectController.getProjectById.bind(ProjectController));
router.put('/:id', auth, ProjectController.updateProject.bind(ProjectController));
router.delete('/:id', auth, ProjectController.deleteProject.bind(ProjectController));

module.exports = router;