const mysql = require('mysql2/promise');

const pool = mysql.createPool({       //pool = conjunto de conexões (limite)
    
    host: '10.87.169.38',
    user: 'demori',
    password: 'MySQL1234',
    database: 'rapido_seguro',
    port: 3308,
    waitForConnections: true, //Aguarda conexões livre
    connectionLimit: 10, // limita a quantidade de conexões simultâneas
    queueLimit: 0 // Sem limite para fila de conexões

});

(async ()=>{
    try {
        
        const connection = await pool.getConnection();
        console.log(`Conectado ao MySQL`)
        connection.release();

    } catch (error) {
        
        console.error(`Erro ao conectar ao MySQL: ${error} `);
    
    }

}) ();


module.exports = pool; // EXPORTA o pool de conexões