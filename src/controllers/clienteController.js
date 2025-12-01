const { clienteModel } = require('../models/clienteModel');


const clienteController = {

    /**
     * @function cadastrarCliente
     * @param {string} pNomeCompleto 
     * @param {string} pCpf 
     * @param {string} pTelefone 
     * @param {string} pEmail 
     * @param {string} pEnderecoCompleto 
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * const resultado = await clienteModel.cadastrarCliente(nomeCom, cpf, telefoneCli, emailCli, enderecoCom);
     * 
     * {
    "message": "Registro incluido com sucesso",
    "result": {
        "fieldCount": 0,
        "affectedRows": 1,
        "insertId": 5,
        "info": "",
        "serverStatus": 2,
        "warningStatus": 0,
        "changedRows": 0
    }
}
     */

    criarCliente: async (req, res) => {
        try {

            const { nomeCom, cpf, telefoneCli, emailCli, enderecoCom } = req.body;


            if (!String(nomeCom) || !String(cpf) || !String(telefoneCli) || !String(emailCli) || !String(enderecoCom) || cpf.length != 11 || telefoneCli.length != 11 || !nomeCom || !cpf || !telefoneCli || !emailCli || !enderecoCom) {

                return res.status(400).json({
                    message: 'Verifique os dados e envie novamente!'
                });

            }

            /**
             * @function selecionaPorCpf
             * @param {string} pCpf 
             * @returns {Promise<Array<Object>>}
             * 
             * @example 
             * const clienteAtual = await clienteModel.selecionaPorCpf(cpf);
             * 
             * 
             */
            const clienteAtual = await clienteModel.selecionaPorCpf(cpf);

            if (clienteAtual.length > 0) {

                return res.status(409).json({
                    message: 'CPF já está cadastrado! Tente outro que seja válido! '
                });

            };

            const resultado = await clienteModel.cadastrarCliente(nomeCom, cpf, telefoneCli, emailCli, enderecoCom);

            if (resultado.affectedRows === 1) {
                res.status(201).json({
                    message: 'Registro incluido com sucesso',
                    result: resultado
                })
            }

        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no server ok ?!?!',
                errorMessage: error.message
            });
        }

    },

    /**
     * @function selecionaTodosClientes
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * const resultado = await clienteModel.selecionaTodosClientes();
     * 
     * {
    "message": "Resultado dos dados listados",
    "data": [
        {
            "id_pedido": 1,
            "id_cliente_fk": 1,
            "data": "2025-04-17T03:00:00.000Z",
            "tipo_entrega": "urgente",
            "distancia": "20.00",
            "peso_carga": "12.00",
            "valor_km": "8.00",
            "valor_kg": "12.00"
        },
        {
            "id_pedido": 2,
            "id_cliente_fk": 2,
            "data": "2025-04-18T03:00:00.000Z",
            "tipo_entrega": "urgente",
            "distancia": "30.00",
            "peso_carga": "15.00",
            "valor_km": "8.00",
            "valor_kg": "12.00"
        },
        {
            "id_pedido": 3,
            "id_cliente_fk": 3,
            "data": "2025-04-15T03:00:00.000Z",
            "tipo_entrega": "normal",
            "distancia": "20.00",
            "peso_carga": "12.00",
            "valor_km": "8.00",
            "valor_kg": "12.00"
        }
    ]
}
     */
    buscarTodosClientes: async (req, res) => {
        try {
            const resultado = await clienteModel.selecionaTodosClientes();

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
     * @function deletarCliente
     * @param {Number} pIdCliente 
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * const resultado = await clienteModel.deletarCliente(id);

    {
	"message": "cliente excluído com sucesso",
	"data": {
		"fieldCount": 0,
		"affectedRows": 1,
		"insertId": 0,
		"info": "",
		"serverStatus": 2,
		"warningStatus": 0,
		"changedRows": 0
	}
}
     */

    excluirCliente: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({
                    message: 'Forneça um ID válido'
                });
            }

    
    
    /**
     * @function selecionaPorId
     * @param {Number} pId 
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * 
     * const clienteSelecionado = await clienteModel.selecionaPorId(id);
     * 
     */

            const clienteSelecionado = await clienteModel.selecionaPorId(id);

            if (clienteSelecionado.length === 0) {
                throw new Error('Registro não localizado');
            } else {
                const resultado = await clienteModel.deletarCliente(id);

                if (resultado.affectedRows === 1) {
                    res.status(200).json({
                        message: 'cliente excluído com sucesso',
                        data: resultado
                    });
                } else {
                    throw new Error('Não foi possível excluir cliente');
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                message: 'Ocorreu um erro no server!',
                errorMessage: error.message
            });
        }
    },


    /**
     * @function atualizarCliente
     * @param {Number} pIdCliente 
     * @param {string} pNomeCompleto 
     * @param {string} pTelefone 
     * @param {string} pEmail 
     * @param {string} pEnderecoCompleto 
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * 
     * const resultado = await clienteModel.atualizarCliente(idCliente, novoNomeComp, novoTelefoneCli, novoEmailCli, novoEnderecoCom);
     * 
     * 
     * {
	"message": "Registro atualizado com sucesso",
	"data": {
		"fieldCount": 0,
		"affectedRows": 1,
		"insertId": 0,
		"info": "Rows matched: 1  Changed: 1  Warnings: 0",
		"serverStatus": 2,
		"warningStatus": 0,
		"changedRows": 1
	}
}
     */

    editarCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            let { nomeCom, telefoneCli, emailCli, enderecoCom } = req.body

            nomeCom = nomeCom.trim();

            if (!idCliente || !nomeCom || !telefoneCli || !emailCli || !enderecoCom || nomeCom.length < 3) {
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

module.exports = { clienteController }