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

    }

};

module.exports = { clienteModel }