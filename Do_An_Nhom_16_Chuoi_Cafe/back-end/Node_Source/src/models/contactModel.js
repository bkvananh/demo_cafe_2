const db = require('../config/db');

const Contact = {
    // 1. Tạo liên hệ mới (SỬA LẠI CHO AN TOÀN)
    // Ta chỉ insert: name, email, message. 
    // Cột status (nếu có) sẽ tự động lấy giá trị mặc định (default) từ database.
    create: async (data) => {
        const sql = 'INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)';
        const [result] = await db.execute(sql, [data.name, data.email, data.message]);
        return result;
    },

    // 2. Lấy tất cả liên hệ
    getAll: async () => {
        // Sắp xếp tin mới nhất lên đầu
        const [rows] = await db.query('SELECT * FROM contacts ORDER BY created_at DESC');
        return rows;
    },

    // 3. Đánh dấu tất cả là đã đọc
    markAllRead: async () => {
        // Dùng try-catch để nếu database chưa có cột status thì cũng không bị sập web
        try {
            const sql = 'UPDATE contacts SET status = "read" WHERE status = "unread"';
            const [result] = await db.execute(sql);
            return result;
        } catch (err) {
            // Nếu lỗi (do thiếu cột) thì bỏ qua, không làm gì cả
            return null;
        }
    },

    // 4. Xóa liên hệ
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM contacts WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Contact;