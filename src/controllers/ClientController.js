// controllers/ClientController.js
const Client = require('../models/Client');
const { v4: uuidv4 } = require('uuid');

class ClientController {
  constructor() {
    this.clients = new Map();
  }

  async createClient(req, res) {
    try {
      const clientData = {
        id: uuidv4(),
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const client = new Client(clientData);
      this.clients.set(client.id, client);

      res.status(201).json({
        status: 'success',
        message: 'Cliente criado com sucesso',
        data: client.toJSON()
      });
    } catch (error) {
      res.status(400).json({ status: 'error', message: error.message });
    }
  }

  async getAllClients(req, res) {
    const list = Array.from(this.clients.values()).map(c => c.toJSON());
    res.json({ status: 'success', results: list.length, data: list });
  }

  async getClientById(req, res) {
    const client = this.clients.get(req.params.id);
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Cliente não encontrado' });
    }
    res.json({ status: 'success', data: client.toJSON() });
  }

  async updateClient(req, res) {
    const client = this.clients.get(req.params.id);
    if (!client) {
      return res.status(404).json({ status: 'error', message: 'Cliente não encontrado' });
    }
    Object.assign(client, req.body);
    client.updatedAt = new Date();
    res.json({ status: 'success', message: 'Cliente atualizado', data: client.toJSON() });
  }

  async deleteClient(req, res) {
    if (!this.clients.has(req.params.id)) {
      return res.status(404).json({ status: 'error', message: 'Cliente não encontrado' });
    }
    this.clients.delete(req.params.id);
    res.json({ status: 'success', message: 'Cliente removido' });
  }
}

module.exports = new ClientController();
