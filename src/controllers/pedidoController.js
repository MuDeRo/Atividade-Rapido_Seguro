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

            let valorDistancia = dadosPedido[0].distancia * dadosPedido[0].valor_km;
            let valorPeso = dadosPedido[0].peso_carga * dadosPedido[0].valor_kg;
            
            let valorBase = valorDistancia + valorPeso;
            let valorFinal = 0;
            let taxa = 15;

            let acrescimo = 0;
            let desconto = 0;

            if (dadosPedido.tipoEntrega === 'urgente') {
                acrescimo = valorBase * 0.2;
                valorFinal = valorBase + acrescimo;
            } else {
                valorFinal = valorBase
            };

            if (dadosPedido.peso > 50.00) {
                valorFinal += taxa;
            };

            if (valorFinal > 500.00) {
                desconto = valorFinal * 0.1;
                valorFinal = valorFinal - desconto;
            }

            const resultado = await pedidoModel.registrarEntrega(id_pedido, valorDistancia, valorPeso, acrescimo, desconto, taxa, valorFinal, status);

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
            let { distancia, pesoCarga, tipoEntrega, status } = req.body;


            if (!idPedido || !tipoEntrega || !distancia || !pesoCarga || typeof idPedido !== 'number' || isNaN(distancia) || isNaN(pesoCarga) || !status) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente again 🔁' });
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

    },

    editarCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            let { nomeCom, telefoneCli, emailCli, enderecoCom } = req.body

            nomeCom = nomeCom.trim();

            if (!idCliente || !nomeCom || !telefoneCli || !emailCli || !enderecoCom || !nomeCom.length < 3) {
                return res.status(400).json({ message: 'Verifique os dados enviados e tente again 🔁' })
            }
            const clienteAtual = await clienteModel.selecionaPorId(idCliente);
            if (clienteAtual.length === 0) {
                throw new Error('Registro não localizado');
            }
            const novoNomeComp = nomeCom ?? clienteAtual[0].nomeCom;
            const novoTelefoneCli = telefoneCli ?? clienteAtual[0].telefoneCli;
            const novoEmailCli = emailCli ?? clienteAtual[0].emailCli;
            const novoEnderecoCom = enderecoCom ?? clienteAtual[0].enderecoCom;

            const resultado = await clienteModel.atualizarCliente(idCliente, novoNomeComp, novoTelefoneCli, novoEmailCli, novoEnderecoCom);

            if (resultado.changeRows === 0) {
                throw new error('Não foi possivel atualizar o cliente');
            }
            res.status(200).json({ message: 'Registro atualizado com sucesso', data: resultado })

        } catch (error) {

            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no servidor ok ?!?!?!?',
                errorMessage: error.message
            })
        }
    }
};

module.exports = { pedidoController };
