const pool = require('../config/db');

const clienteModel = {
    
    cadastrarCliente: async (pNomeCompleto, pCpf, pTelefone, pEmail, pEnderecoCompleto) => {

            const sql = 'INSERT INTO clientes (nome_completo, cpf, telefone, email, endereco_completo) VALUES (?,?,?,?,?);';
            const values = [pNomeCompleto, pCpf, pTelefone, pEmail, pEnderecoCompleto];
            const [rows] = await pool.query(sql, values);
            return rows;

    },

    selecionaPorCpf: async (pCpf) => {

            const sql = 'SELECT * FROM clientes WHERE cpf = ?;'
            const values = [pCpf];
            const [rows] = await pool.query(sql, values);
            return rows;
        
        
    },

    selecionaTodosClientes: async () => {

            const sql = 'SELECT * FROM clientes';
            const [rows] = await pool.query(sql);
            return rows;

    },

    selecionaPorId:async (pId) => {
        const sql = 'SELECT * FROM clientes WHERE id_cliente=?;';
        const values = [pId];
        const [rows] = await pool.query(sql, values);
        return rows;
    },
    
    deletarCliente:async (pIdCliente) => {
        const sql = 'DELETE FROM clientes WHERE id_cliente=?;'
        const values = [pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
        
     
    },

    atualizarCliente: async (pIdCliente, pNomeCompleto, pTelefone, pEmail, pEnderecoCompleto) => {
       const sql = 'UPDATE clientes SET nome_completo=?, telefone=?, email=?, endereco_completo=? WHERE id_cliente=?;';
        const values = [pNomeCompleto, pTelefone, pEmail, pEnderecoCompleto, pIdCliente];
        const [rows] = await pool.query(sql, values);
        return rows;
    }

};

module.exports = { clienteModel }