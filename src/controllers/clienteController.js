const { clienteModel } = require('../models/clienteModel');


const clienteController = {
    
    criarCliente: async (req, res) => {
        try {
            
            const {nomeCom, cpf, telefoneCli, emailCli, enderecoCom } = req.body;


            if (!String(nomeCom) || !String(cpf) || !String(telefoneCli) || !String(emailCli) || !String(enderecoCom) || cpf.length != 11 || telefoneCli.length != 11 ||!nomeCom || !cpf || !telefoneCli || !emailCli || !enderecoCom) {

                return res.status(400).json({
                    message: 'Verifique os dados e envie novamente!'
                });
                
            }

            const clienteAtual = await clienteModel.selecionaPorCpf(cpf);

            if(clienteAtual.length > 0){
                
                return res.status(409).json({
                    message: 'CPF já está cadastrado! Tente outro que seja válido! '
                });

            };

            const resultado = await clienteModel.cadastrarCliente(nomeCom, cpf, telefoneCli, emailCli, enderecoCom);

            if(resultado.affectedRows === 1){
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
        
    }
};

module.exports = { clienteController }