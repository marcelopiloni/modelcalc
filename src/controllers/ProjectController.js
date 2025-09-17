const Project = require('../models/Project');
const { v4: uuidv4 } = require('uuid');

class ProjectController {
  constructor() {
    this.projects = new Map(); // In-memory storage
  }

  async createProject(req, res) {
    try {
      const projectData = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const project = new Project(projectData);
      this.projects.set(project.id, project);

      res.status(201).json({
        status: 'success',
        message: 'Projeto criado com sucesso',
        data: project.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Erro ao criar projeto',
        error: error.message
      });
    }
  }

  async getAllProjects(req, res) {
    try {
      const projects = Array.from(this.projects.values()).map(project => project.toJSON());
      
      res.status(200).json({
        status: 'success',
        results: projects.length,
        data: projects
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar projetos',
        error: error.message
      });
    }
  }

  async getProjectById(req, res) {
    try {
      const { id } = req.params;
      const project = this.projects.get(id);

      if (!project) {
        return res.status(404).json({
          status: 'error',
          message: 'Projeto não encontrado'
        });
      }

      res.status(200).json({
        status: 'success',
        data: project.toJSON()
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao buscar projeto',
        error: error.message
      });
    }
  }

  async updateProject(req, res) {
    try {
      const { id } = req.params;
      const project = this.projects.get(id);

      if (!project) {
        return res.status(404).json({
          status: 'error',
          message: 'Projeto não encontrado'
        });
      }

      // Update project properties
      Object.keys(req.body).forEach(key => {
        if (project.hasOwnProperty(key)) {
          project[key] = req.body[key];
        }
      });

      project.updatedAt = new Date();

      res.status(200).json({
        status: 'success',
        message: 'Projeto atualizado com sucesso',
        data: project.toJSON()
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: 'Erro ao atualizar projeto',
        error: error.message
      });
    }
  }

  async deleteProject(req, res) {
    try {
      const { id } = req.params;
      
      if (!this.projects.has(id)) {
        return res.status(404).json({
          status: 'error',
          message: 'Projeto não encontrado'
        });
      }

      this.projects.delete(id);

      res.status(200).json({
        status: 'success',
        message: 'Projeto excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Erro ao excluir projeto',
        error: error.message
      });
    }
  }
}

module.exports = new ProjectController();