const express = require ('express');
const router = express.Router();

//Referência dos arquivos d rotas que serão trabalhados
const{clienteRoutes} = require('./clienteRoutes');
const{pedidoRoutes} = require('./pedidoRoutes');

router.use('/', clienteRoutes);
router.use('/', pedidoRoutes);


module.exports = { router };
