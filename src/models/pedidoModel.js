const pool = require('../config/db');

const pedidoModel = {

    /**
     * Registra um novo pedido no banco de dados
     * @async
     * @function registrarPedido
     * @param {Number} pIdCliente ID do cliente vinculado ao pedido
     * @param {String} pData Data do pedido (formato: AAAA-MM-DD)
     * @param {String} pTipoEntrega Tipo da entrega (ex: "Rápida", "Normal")
     * @param {Number} pDistancia Distância percorrida em km
     * @param {Number} pPeso Peso da carga
     * @param {Number} pValorKm Valor cobrado por km
     * @param {Number} pValorKg Valor cobrado por kg
     * @returns {Promise<Object>} Retorna informações sobre o comando executado
     * 
     * @example
     * const pedido = await pedidoModel.registrarPedido(
     *     1,
     *     '2025-01-20',
     *     'Rápida',
     *     12.5,
     *     8.3,
     *     2.50,
     *     1.20
     * );
     * 
     * // Saída exemplo:
     * {
     *     fieldCount: 0,
     *     affectedRows: 1,
     *     insertId: 10,
     *     serverStatus: 2
     * }
     */

    registrarPedido: async (pIdCliente, pData, pTipoEntrega, pDistancia, pPeso, pValorKm, pValorKg) => {

            const sqlPedido = 'INSERT INTO pedidos (id_cliente_fk, data, tipo_entrega, distancia, peso_carga, valor_km, valor_kg) VALUES (?,?,?,?,?,?,?);';
            const valuesPedido = [pIdCliente, pData, pTipoEntrega, pDistancia, pPeso, pValorKm, pValorKg];
            const [rowsPedido] = await pool.query(sqlPedido, valuesPedido);
            return rowsPedido;
    },


    /**
     * Registra os valores finais e detalhes de uma entrega vinculada a um pedido
     * @async
     * @function registrarEntrega
     * @param {Number} pIdPedido ID do pedido vinculado
     * @param {Number} pValorDistancia Valor final calculado pela distância
     * @param {Number} pValorPeso Valor final calculado pelo peso
     * @param {Number} pAcrescimo Valor de acréscimo aplicado
     * @param {Number} pDesconto Valor de desconto aplicado
     * @param {Number} pTaxa Taxa extra aplicada
     * @param {Number} pValorFinal Valor total final da entrega
     * @param {String} pStatus Status atual da entrega (ex: "Pendente", "Concluída")
     * @returns {Promise<Object>} Retorna informações sobre o comando realizado
     * 
     * @example
     * const entrega = await pedidoModel.registrarEntrega(
     *     10, 30.5, 12.0, 5.0, 0, 2.5, 50.0, 'Pendente'
     * );
     */

    registrarEntrega: async (pIdPedido, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxa, pValorFinal, pStatus) => {
            const sqlEntrega = 'INSERT INTO entregas (id_pedido_fk, valor_distancia, valor_peso, acrescimo, desconto, taxa_extra, valor_entrega, status_entrega) VALUES (?,?,?,?,?,?,?,?);';
            const valuesEntrega = [pIdPedido, pValorDistancia, pValorPeso, pAcrescimo, pDesconto, pTaxa, pValorFinal, pStatus];
            const [rowsEntrega] = await pool.query(sqlEntrega, valuesEntrega);
            return rowsEntrega;
        
    },


    /**
     * Seleciona todos os pedidos cadastrados
     * @async
     * @function selecionaTodosPedidos
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * const pedidos = await pedidoModel.selecionaTodosPedidos();
     * console.log(pedidos);
     */
           

    selecionaTodosPedidos: async () => {
        const sql = 'SELECT * FROM pedidos;';
        const [rows] = await pool.query(sql);
        return rows;
    },


    /**
     * Seleciona todas as entregas cadastradas
     * @async
     * @function selecionaTodasEntregas
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * const entregas = await pedidoModel.selecionaTodasEntregas();
     * console.log(entregas);
     */

    selecionaTodasEntregas: async () => {
        const sql = 'SELECT * FROM entregas;';
        const [rows] = await pool.query(sql);
        return rows;
    },


    /**
     * Atualiza informações de um pedido e o status da entrega associada.
     * Esta operação é transacional, garantindo que ou tudo é atualizado, ou nada é alterado.
     * 
     * @async
     * @function atualizarPedidos
     * @param {Number} pIdPedido ID do pedido que será atualizado
     * @param {Number} pDistancia Nova distância
     * @param {Number} pPeso Novo peso
     * @param {String} pTipoEntrega Novo tipo de entrega
     * @param {String} pStatus Novo status da entrega
     * @returns {Promise<Object>} Retorna os resultados das duas operações
     * 
     * @example
     * const resultado = await pedidoModel.atualizarPedidos(
     *     10, 15.0, 6.5, 'Normal', 'Concluída'
     * );
     * 
     * // Saída exemplo:
     * {
     *     rowsPedido: { affectedRows: 1, changedRows: 1 },
     *     rowsEntrega: { affectedRows: 1, changedRows: 1 }
     * }
     */

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


    /**
     * Seleciona um pedido específico pelo ID
     * @async
     * @function selecionaPedidoId
     * @param {Number} pIdPedido ID do pedido a ser pesquisado
     * @returns {Promise<Array<Object>>}
     * 
     * @example
     * const pedido = await pedidoModel.selecionaPedidoId(5);
     * console.log(pedido);
     * 
     * // Saída esperada:
     * [
     *     { id_pedido: 5, id_cliente_fk: 1, data: "...", ... }
     * ]
     */

    selecionaPedidoId: async (pIdPedido) => {
        const sql = 'SELECT * FROM pedidos WHERE id_pedido=?';
        const values = [pIdPedido];
        const [rows] = await pool.query(sql, values);
        return rows;
        
    }

    

};

module.exports = { pedidoModel };