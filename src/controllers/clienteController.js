const { clienteModel } = require('../models/clienteModel');


const clienteController = {

    criarCliente: async (req, res) => {
        try {

            const { nomeCom, cpf, telefoneCli, emailCli, enderecoCom } = req.body;


            if (!String(nomeCom) || !String(cpf) || !String(telefoneCli) || !String(emailCli) || !String(enderecoCom) || cpf.length != 11 || telefoneCli.length != 11 || !nomeCom || !cpf || !telefoneCli || !emailCli || !enderecoCom) {

                return res.status(400).json({
                    message: 'Verifique os dados e envie novamente!'
                });

            }

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

    excluirCliente: async (req, res) => {
        try {
            const id = Number(req.params.id);

            if (!id || !Number.isInteger(id)) {
                return res.status(400).json({
                    message: 'Forneça um ID válido'
                });
            }

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
    
    editarCliente: async (req, res) => {
        try {
            const idCliente = Number(req.params.idCliente);
            let { nomeCom, telefoneCli, emailCli, enderecoCom } = req.body

            nomeCom = nomeCom.trim();

            if (!idCliente || !nomeCom || !telefoneCli || !emailCli || !enderecoCom || nomeCom.length<3) {
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