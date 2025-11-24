const pool = require('../config/db');

const pedidoModel = {

    registrarPedido: async (pIdCliente, pData, pTipoEntrega, pDistancia, pPeso, pValorKm, pValorKg) => {
        
        const connection = await pool.getConnection(); // Recebe uma conexão

        try {
            
            await connection.beginTransaction();
            const sqlPedido = 'INSERT INTO pedidos (id_cliente_fk, data, tipo_entrega, distancia, peso_carga, valor_km, valor_kg) VALUES (?,?,?,?,?,?,?);';
            const valuesPedido = [pIdCliente, pData, pTipoEntrega, pDistancia, pPeso, pValorKm, pValorKg];
            const [rowsPedido] = await connection.query(sqlPedido, valuesPedido);

            connection.commit();
            return {rowsPedido};

        } catch (error) {
            connection.rollback(); 
            throw error;
        }
    },

    selecionaTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;';
        const [rows] = await pool.query(sql);
        return rows;
    }
}

module.exports = { pedidoModel };