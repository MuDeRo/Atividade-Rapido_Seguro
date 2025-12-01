const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes', clienteController.buscarTodosClientes);
clienteRoutes.post('/clientes', clienteController.criarCliente);
clienteRoutes.delete('/clientes/:id', clienteController.excluirCliente);


module.exports = { clienteRoutes };