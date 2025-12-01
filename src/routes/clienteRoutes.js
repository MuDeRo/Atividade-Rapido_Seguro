const express = require('express');
const clienteRoutes = express.Router();
const { clienteController } = require('../controllers/clienteController');

clienteRoutes.get('/clientes', clienteController.buscarTodosClientes);
clienteRoutes.post('/clientes', clienteController.criarCliente);
clienteRoutes.delete('/clientes/:id', clienteController.excluirCliente);
clienteRoutes.put('/clientes/:idCliente', clienteController.editarCliente);


module.exports = { clienteRoutes };