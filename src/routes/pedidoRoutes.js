const express = require('express');
const pedidoRoutes = express.Router();
const { pedidoController } = require('../controllers/pedidoController');

pedidoRoutes.post('/pedidos', pedidoController.criarPedido);

module.exports = {pedidoRoutes};