const db = require('../config/db');

const Product = {
    // Lấy tất cả món (có thể join thêm bảng categories để lấy tên danh mục nếu cần)
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    },

    // Lấy chi tiết 1 món
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },

    // RF-01: Lấy 3 món nổi bật (Best Seller) cho trang chủ
    getFeatured: async () => {
        const [rows] = await db.query('SELECT * FROM products WHERE is_featured = 1 LIMIT 3');
        return rows;
    },

    // RF-05: Lấy món theo danh mục (Ví dụ: Cafe, Trà...)
    getByCategory: async (categoryId) => {
        const [rows] = await db.query('SELECT * FROM products WHERE category_id = ?', [categoryId]);
        return rows;
    },

    // Thêm món mới (Admin)
    create: async (data) => {
        const sql = 'INSERT INTO products (name, description, price, image_url, category_id, is_featured) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [data.name, data.description, data.price, data.image_url, data.category_id, data.is_featured]);
        return result;
    },

    // Sửa món (Admin)
    update: async (id, data) => {
        const sql = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, category_id = ?, is_featured = ? WHERE id = ?';
        const [result] = await db.execute(sql, [data.name, data.description, data.price, data.image_url, data.category_id, data.is_featured, id]);
        return result;
    },

    // Xóa món (Admin)
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Product;