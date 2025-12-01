const pool = require('../config/db');

const pedidoModel = {

    registrarPedido: async (pIdCliente, pData, pTipoEntrega, pDistancia, pPeso, pValorKm, pValorKg, pStatus, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxaExtra, pValorEntrega) => {

        const connection = await pool.getConnection()

        try {

            await connection.beginTransaction();
            const sqlPedido = 'INSERT INTO pedidos (id_cliente_fk, data, tipo_entrega, distancia, peso_carga, valor_km, valor_kg) VALUES (?,?,?,?,?,?,?);';
            const valuesPedido = [pIdCliente, pData, pTipoEntrega, pDistancia, pPeso, pValorKm, pValorKg];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            const sqlEntrega = 'INSERT INTO entregas (id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_entrega, status_entrega) VALUES (?,?,?,?,?,?,?,?);';
            const valuesEntrega = [pIdPedido, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxaExtra, pValorEntrega, pStatus];
            const [rowsEntrega] = await connection.query(sqlEntrega, valuesEntrega);

            await connection.commit();
            return { rowsPedido, rowsEntrega };

        } catch (error) {
            await connection.rollback();
            throw error;
        }
    },

    selecionaTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    selecionaTodasEntregas: async () => {
        const sql = 'SELECT * FROM entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },

    atualizarPedidos: async (pIdPedido,  pDistancia, pPeso, pTipoEntrega, pStatus) => {

        const connection = await pool.getConnection();

        try {
            await connection.beginTransaction();

            const sqlPedido = 'UPDATE pedidos SET distancia=?, peso_carga=?, tipo_entrega=? WHERE id_pedido=?;';
            const valuesPedido = [pDistancia, pPeso, pTipoEntrega, pIdPedido];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            const sqlEntrega = 'UPDATE entregas SET status_entrega=? WHERE id_pedido_fk=?;';
            const valuesEntrega = [pStatus, pIdPedido];
            const [rowsEntrega] = await connection.query(sqlEntrega, valuesEntrega);

            await connection.commit();
            return{rowsPedido, rowsEntrega};

        } catch (error) {
            
            await connection.rollback();
            throw error;
        }
    },

    selecionaPedidoId: async (pIdPedido) => {
        const sql = 'SELECT * FROM pedidos WHERE id_pedido=?';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
        
    }

};

module.exports = { pedidoModel };