const pool = require('../config/db');

const clienteModel = {

     /**
     * Cadastra um novo cliente no banco de dados
     * @async
     * @function cadastrarCliente
     * @param {String} pNomeCompleto Nome completo do cliente
     * @param {String} pCpf CPF do cliente
     * @param {String} pTelefone Telefone do cliente
     * @param {String} pEmail Email do cliente
     * @param {String} pEnderecoCompleto Endereço completo do cliente
     * @returns {Promise<Object>} Retorna um objeto contendo propriedades que representam o resultado do comando executado
     * 
     * @example
     * const resultado = await clienteModel.cadastrarCliente(
     *    'João da Silva', 
     *    '12345678900',
     *    '(11) 99999-0000',
     *    'email@teste.com',
     *    'Rua Exemplo, 123'
     * );
     * 
     * // Saída (exemplo)
     * {
     *     fieldCount: 0,
     *     affectedRows: 1,
     *     insertId: 7,
     *     info: '',
     *     serverStatus: 2,
     *     warningStatus: 0
     * }
     */
    
    cadastrarCliente: async (pNomeCompleto, pCpf, pTelefone, pEmail, pEnderecoCompleto) => {

            const sql = 'INSERT INTO clientes (nome_completo, cpf, telefone, email, endereco_completo) VALUES (?,?,?,?,?);';
            const values = [pNomeCompleto, pCpf, pTelefone, pEmail, pEnderecoCompleto];
            const [rows] = await pool.query(sql, values);
            return rows;

    },

    /**
     * Seleciona um cliente de acordo com o CPF informado
     * @async
     * @function selecionaPorCpf
     * @param {String} pCpf CPF que será pesquisado no banco de dados
     * @returns {Promise<Array<Object>>} Retorna um array contendo o registro encontrado
     * 
     * @example
     * const cliente = await clienteModel.selecionaPorCpf('12345678900');
     * console.log(cliente);
     * 
     * // Saída esperada
     * [
     *      {
     *          id_cliente: 1,
     *          nome_completo: 'João da Silva',
     *          cpf: '12345678900',
     *          telefone: '(11) 99999-0000',
     *          email: 'email@teste.com',
     *          endereco_completo: 'Rua Exemplo, 123'
     *      }
     * ]
     */
    
    selecionaPorCpf: async (pCpf) => {

            const sql = 'SELECT * FROM clientes WHERE cpf = ?;'
            const values = [pCpf];
            const [rows] = await pool.query(sql, values);
            return rows;
        
        
    },

    /**
     * Seleciona todos os clientes cadastrados na tabela
     * @async
     * @function selecionaTodosClientes
     * @returns {Promise<Array<Object>>} Retorna um array com todos os clientes
     * 
     * @example
     * const clientes = await clienteModel.selecionaTodosClientes();
     * console.log(clientes);
     * 
     * // Saída esperada:
     * [
     *      { id_cliente: 1, nome_completo: 'João', cpf: '12345678900', ... },
     *      { id_cliente: 2, nome_completo: 'Maria', cpf: '98765432100', ... }
     * ]
     */

    
    selecionaTodosClientes: async () => {

            const sql = 'SELECT * FROM clientes';
            const [rows] = await pool.query(sql);
            return rows;

    },

    /**
     * Seleciona um cliente pelo seu ID
     * @async
     * @function selecionaPorId
     * @param {Number} pId ID que será pesquisado
     * @returns {Promise<Array<Object>>} Retorna um array contendo o cliente referente ao ID
     * 
     * @example
     * const cliente = await clienteModel.selecionaPorId(1);
     * console.log(cliente);
     * 
     * // Saída esperada:
     * [
     *      { id_cliente: 1, nome_completo: 'João da Silva', cpf: '123...', ... }
     * ]
     */
    
    selecionaPorId:async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },


    /**
     * Deleta um cliente pelo ID informado
     * @async
     * @function deletarCliente
     * @param {Number} pIdCliente ID do cliente que será removido
     * @returns {Promise<Object>} Retorna informações sobre o comando executado
     * 
     * @example
     * const resultado = await clienteModel.deletarCliente(3);
     * console.log(resultado);
     * 
     * // Saída (exemplo):
     * {
     *     fieldCount: 0,
     *     affectedRows: 1,
     *     insertId: 0,
     *     info: '',
     *     serverStatus: 2,
     *     warningStatus: 0,
     *     changedRows: 0
     * }
     */
    
    deletarCliente:async (pIdCliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente=?;'
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
        
     
    },


    /**
     * Atualiza os dados de um cliente existente
     * @async
     * @function atualizarCliente
     * @param {Number} pIdCliente ID do cliente que será atualizado
     * @param {String} pNomeCompleto Novo nome completo
     * @param {String} pTelefone Novo telefone
     * @param {String} pEmail Novo email
     * @param {String} pEnderecoCompleto Novo endereço completo
     * @returns {Promise<Object>} Retorna um objeto descrevendo o resultado da operação
     * 
     * @example
     * const resultado = await clienteModel.atualizarCliente(
     *     1,
     *     'João Atualizado',
     *     '(11) 90000-0000',
     *     'novoemail@teste.com',
     *     'Rua Nova, 999'
     * );
     * 
     * // Saída (exemplo):
     * {
     *     fieldCount: 0,
     *     affectedRows: 1,
     *     insertId: 0,
     *     info: '',
     *     serverStatus: 2,
     *     warningStatus: 0,
     *     changedRows: 1
     * }
     */

    atualizarCliente: async (pIdCliente, pNomeCompleto, pTelefone, pEmail, pEnderecoCompleto) => {
       const sql = 'UPDATE clientes SET nome_completo=?, telefone=?, email=?, endereco_completo=? WHERE id_cliente=?;';
        const values = [pNomeCompleto, pTelefone, pEmail, pEnderecoCompleto, pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    }

};

module.exports = { clienteModel }