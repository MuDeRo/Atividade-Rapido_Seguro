const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {
    criarPedido: async (req, res) => {
        try {

            const { id_cliente, data, tipoEntrega, distancia, peso, valorKm, valorKg } = req.body;

            if (!id_cliente || !data || !tipoEntrega || !distancia || !peso || !valorKm || !valorKg || (tipoEntrega !== 'urgente' && tipoEntrega !== 'normal') || isNaN(id_cliente) || isNaN(distancia) || isNaN(peso) || isNaN(valorKg) || isNaN(valorKm)) {
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
    },

    criarEntrega: async (req, res) => {
        try {

            const { id_pedido, status } = req.body;

            if (!id_pedido || !status || isNaN(id_pedido) || (status !== 'calculado' && status !== 'em transito' && status !== 'entregue' && status !== 'cancelado')) {
                return res.status(400).json({
                    message: 'Verifique os dados inseridos e tente again 🔁'
                });
            };

            const dadosPedido = await pedidoModel.selecionaPedidoId(id_pedido);

            const valorDistancia = dadosPedido.distancia * dadosPedido.valorKm;
            const valorPeso = dadosPedido.peso * dadosPedido.valorKg;

            const valorBase = valorDistancia + valorPeso;
            const valorFinal = Number;
            const taxa = 15;


            if (dadosPedido.tipoEntrega === 'urgente') {
                const acrescimo = valorBase * 0.2;
                valorFinal = valorBase + acrescimo;
            } else {
                valorFinal = valorBase
            };

            if (peso > 50.00) {
                valorFinal + taxa;
            };

            if (valorFinal > 500.00) {
                const desconto = valorFinal * 0.1;
                valorFinal = valorFinal - desconto;
            }

            const resultado = await pedidoModel.registrarPedido(id_pedido, valorDistancia, valorPeso, acrescimo, desconto, taxa, valorFinal, status);

            return res.status(200).json({ message: 'Pedido finalizado!', data: resultado });

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no server ok ?!?!',
                errorMessage: error.message
            });
        }
    },

    buscarTodosPedidos: async (req, res) => {
        try {
            const resultado = await pedidoModel.selecionaTodosPedidos();

            res.status(200).json({
                message: 'Resultado dos dados listados',
                data: resultado
            });


        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no server ok ?!?!',
                errorMessage: error.message
            });
        }

    }, 

    buscarTodasEntregas: async (req, res) => {
        try {
            const resultado = await pedidoModel.selecionaTodasEntregas();

            res.status(200).json({
                message: 'Resultado dos dados listados',
                data: resultado
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no server ok ?!?!',
                errorMessage: error.message
            });
        }
        
    }, 

    alterarPedido: async (req, res) => {
        try {
            const idPedido = Number(req.params.idPedido);
            let {distancia, pesoCarga, tipoEntrega, status} = req.body;
        

            if (!idPedido || !tipoEntrega || !distancia || !pesoCarga || typeof idPedido !== 'number' || isNaN(distancia) || isNaN(pesoCarga) || !status) {
                return res.status(400).json({message: 'Verifique os dados enviados e tente again 🔁'});
            }

            const pedidoAtual = await pedidoModel.selecionaPedidoId(idPedido);
            if (pedidoAtual.length === 0) {
                throw new error('Registro não localizado ta ok ?!?!');
            }

            const novoTipoEntrega = tipoEntrega ?? pedidoAtual[0].tipoEntrega;
            const novaDistancia = distancia ?? pedidoAtual[0].distancia;
            const novoPesoCarga = pesoCarga ?? pedidoAtual[0].pesoCarga;
            const novoStatus = status ?? pedidoAtual[0].status;

            const resultado = await pedidoModel.atualizarPedidos(idPedido, novaDistancia, novoPesoCarga, novoTipoEntrega, novoStatus);

            if (resultado.changedRows === 0) {
                throw new error('Não foi possível atualizar o pedido');
            }

            res.status(200).json({
                message: 'Pedido atualizado com sucesso',
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
