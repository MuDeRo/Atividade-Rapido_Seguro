const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {
    criarPedido: async (req, res) => {
        try {

            const { id_cliente, data, tipoEntrega, distancia, peso, valorKm, valorKg } = req.body;

            if (!id_cliente || !data || !tipoEntrega || !distancia || !peso || !valorKm || !valorKg || tipoEntrega !== 'urgente' || tipoEntrega !== 'normal') {
                return res.status(400).json({
                    message: 'Verifique os dados inseridos e tente again 🔁'
                })
            }

            const resultado = await pedidoModel.registrarPedido(id_cliente, data, tipoEntrega, distancia, peso, valorKm, valorKg);

            res.status(201).json({
                message: 'Registro de pedido feito com sucesso ❤️',
                data: resultado
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no server ok ?!?!',
                errorMessage: error.message
            });
        }
    }
};

module.exports = { pedidoController };