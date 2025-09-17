const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/ProjectController');
const { validateProject } = require('../middleware/validation');

// Project CRUD routes
router.post('/', validateProject, ProjectController.createProject.bind(ProjectController));
router.get('/', ProjectController.getAllProjects.bind(ProjectController));
router.get('/:id', ProjectController.getProjectById.bind(ProjectController));
router.put('/:id', ProjectController.updateProject.bind(ProjectController));
router.delete('/:id', ProjectController.deleteProject.bind(ProjectController));

module.exports = router;