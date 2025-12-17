const db = require('../config/db');

const Post = {
    // Lấy tất cả
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM posts ORDER BY publish_date DESC');
        return rows;
    },

    // Lấy 1 bài theo ID (QUAN TRỌNG CHO TRANG CHI TIẾT)
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM posts WHERE id = ?', [id]);
        return rows[0]; // Trả về object bài viết hoặc undefined
    },

    // Lấy bài mới nhất (Cho trang chủ)
    getRecent: async () => {
        const [rows] = await db.query('SELECT * FROM posts ORDER BY publish_date DESC LIMIT 3');
        return rows;
    },

    // Thêm bài
    create: async (data) => {
        const sql = 'INSERT INTO posts (title, content, type, thumbnail_url, publish_date) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [data.title, data.content, data.type, data.thumbnail_url, data.publish_date]);
        return result;
    },

    // Xóa bài
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM posts WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Post;