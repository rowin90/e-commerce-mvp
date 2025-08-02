const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: 'password',
      database: 'ecommerce_db'
    });

    console.log('数据库连接成功！');
    
    const [rows] = await connection.execute('SELECT * FROM products LIMIT 3');
    console.log('产品数据:', rows);
    
    await connection.end();
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}

testConnection();