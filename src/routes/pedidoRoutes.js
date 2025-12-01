const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.post('/pedidos', pedidoController.criarPedido);
pedidoRoutes.get('/pedidos', pedidoController.buscarTodosPedidos);
pedidoRoutes.put('/pedidos/:idPedido', pedidoController.alterarPedido);
pedidoRoutes.post('/entregas', pedidoController.criarEntrega);

module.exports = {pedidoRoutes};