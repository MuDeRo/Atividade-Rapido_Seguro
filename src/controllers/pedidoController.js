const { pedidoModel } = require('../models/pedidoModel');

const pedidoController = {

    /**
 * Registra um novo pedido no banco de dados
 * @async
 * @function criarPedido
 * @param {Request} req Objeto da requisição HTTP contendo os dados do pedido no corpo
 * @param {Response} res Objeto da resposta HTTP
 * @returns {Promise<object>} Retorna um objeto contendo propriedades que representam as informações do comando executado
 * @example
 * const pedido = await pedidoController.criarPedido({
 *   body: {
 *     id_cliente: 1,
 *     data: '2025-12-01',
 *     tipoEntrega: 'normal',
 *     distancia: 12,
 *     peso: 5,
 *     valorKm: 2.5,
 *     valorKg: 1.2
 *   }
 * }, res);
 * // saída esperada
 * "result": {
 *   "fieldCount": 0,
 *   "affectedRows": 1,
 *   "insertId": 10,
 *   "info": "",
 *   "serverStatus": 2,
 *   "warningStatus": 0,
 *   "changedRows": 0
 * }
 */

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


    /**
 * Cria ou atualiza uma entrega com cálculo de valor final baseado na distância, peso e tipo de entrega
 * @async
 * @function criarEntrega
 * @param {Request} req Objeto da requisição HTTP contendo os dados da entrega no corpo
 * @param {Response} res Objeto da resposta HTTP
 * @returns {Promise<object>} Retorna um objeto contendo propriedades que representam as informações do comando executado e valores calculados
 * @example
 * const entrega = await pedidoController.criarEntrega({
 *   body: {
 *     id_pedido: 10,
 *     status: 'em transito'
 *   }
 * }, res);
 * // saída esperada
 * "result": {
 *   "fieldCount": 0,
 *   "affectedRows": 1,
 *   "insertId": 0,
 *   "info": "",
 *   "serverStatus": 2,
 *   "warningStatus": 0,
 *   "changedRows": 1,
 *   "valorDistancia": 30,
 *   "valorPeso": 6,
 *   "acrescimo": 7.2,
 *   "desconto": 0,
 *   "taxa": 15,
 *   "valorFinal": 58.2
 * }
 */

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

    /**
 * Retorna todos os pedidos cadastrados no banco de dados
 * @async
 * @function buscarTodosPedidos
 * @param {Request} req Objeto da requisição HTTP
 * @param {Response} res Objeto da resposta HTTP
 * @returns {Promise<object[]>} Retorna um array de objetos contendo os dados de todos os pedidos
 * @example
 * const pedidos = await pedidoController.buscarTodosPedidos(req, res);
 * // saída esperada
 * [
 *   {
 *     "id_pedido": 1,
 *     "id_cliente": 1,
 *     "data": "2025-12-01",
 *     "tipoEntrega": "normal",
 *     "distancia": 12,
 *     "peso": 5,
 *     "valorKm": 2.5,
 *     "valorKg": 1.2,
 *     "status": "calculado",
 *     "valorFinal": 35
 *   },
 *   {
 *     "id_pedido": 2,
 *     "id_cliente": 2,
 *     "data": "2025-12-02",
 *     "tipoEntrega": "urgente",
 *     "distancia": 20,
 *     "peso": 10,
 *     "valorKm": 2.5,
 *     "valorKg": 1.2,
 *     "status": "em transito",
 *     "valorFinal": 66
 *   }
 * ]
 */

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


    /**
 * Retorna todas as entregas registradas no banco de dados
 * @async
 * @function buscarTodasEntregas
 * @param {Request} req Objeto da requisição HTTP
 * @param {Response} res Objeto da resposta HTTP
 * @returns {Promise<object[]>} Retorna um array de objetos contendo os dados de todas as entregas
 * @example
 * const entregas = await pedidoController.buscarTodasEntregas(req, res);
 * // saída esperada
 * [
 *   {
 *     "id_entrega": 1,
 *     "id_pedido": 1,
 *     "valorDistancia": 30,
 * "valorPeso": 6,
 * "acrescimo": 7.2,
 * "desconto": 0,
 * "taxa": 15,
 * "valorFinal": 58.2,
 * "status": "em transito"
 *   },
 *   {
 *     "id_entrega": 2,
 *     "id_pedido": 2,
 *     "valorDistancia": 50,
 * "valorPeso": 12,
 * "acrescimo": 12.4,
 * "desconto": 0,
 * "taxa": 15,
 * "valorFinal": 89.4,
 * "status": "entregue"
 *   }
 * ]
 */

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

    /**
 * Atualiza os dados de um pedido existente no banco de dados
 * @async
 * @function alterarPedido
 * @param {Request} req Objeto da requisição HTTP, contendo o id do pedido nos parâmetros e os novos dados no corpo
 * @param {Response} res Objeto da resposta HTTP
 * @returns {Promise<object>} Retorna um objeto contendo informações sobre a atualização do pedido
 * @example
 * const resultado = await pedidoController.alterarPedido({
 *   params: { idPedido: 10 },
 *   body: {
 *     distancia: 15,
 *     pesoCarga: 7,
 *     tipoEntrega: 'urgente',
 *     status: 'em transito'
 *   }
 * }, res);
 * // saída esperada
 * "result": {
 *   "fieldCount": 0,
 *   "affectedRows": 1,
 *   "insertId": 0,
 *   "info": "",
 *   "serverStatus": 2,
 *   "warningStatus": 0,
 *   "changedRows": 1
 * }
 */

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


    /**
 * Atualiza os dados de um cliente existente no banco de dados
 * @async
 * @function editarCliente
 * @param {Request} req Objeto da requisição HTTP, contendo o id do cliente nos parâmetros e os novos dados no corpo
 * @param {Response} res Objeto da resposta HTTP
 * @returns {Promise<object>} Retorna um objeto contendo informações sobre a atualização do cliente
 * @example
 * const resultado = await clienteController.editarCliente({
 *   params: { idCliente: 5 },
 *   body: {
 *     nomeCom: 'Maycon Espricio',
 *     telefoneCli: '11987654321',
 *     emailCli: 'exemplo@email.com',
 *     enderecoCom: 'Rua Exemplo, 123'
 *   }
 * }, res);
 * // saída esperada
 * "result": {
 *   "fieldCount": 0,
 *   "affectedRows": 1,
 *   "insertId": 0,
 *   "info": "",
 *   "serverStatus": 2,
 *   "warningStatus": 0,
 *   "changedRows": 1
 * }
 */

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
