require('dotenv').config(); // Load biến môi trường từ .env
const mysql = require('mysql2');

// Tạo Connection Pool thay vì Connection đơn lẻ để chịu tải tốt hơn
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cafe_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Chuyển đổi pool sang promise để dùng async/await cho gọn code
const db = pool.promise();

// Test kết nối khi khởi động
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Lỗi kết nối Database:', err.code);
    } else {
        console.log('✅ Đã kết nối MySQL thành công!');
        connection.release();
    }
});

module.exports = db;