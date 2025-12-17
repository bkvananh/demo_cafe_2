const db = require('../config/db');

const User = {
    // Tìm user theo username (Dùng cho Login)
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0];
    },

    // Lấy thông tin user theo ID
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, username, full_name, role FROM users WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;