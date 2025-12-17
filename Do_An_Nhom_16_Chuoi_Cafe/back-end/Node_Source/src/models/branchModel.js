const db = require('../config/db');

const Branch = {
    // SỬA: Thêm tham số 'city' vào hàm getAll
    getAll: async (city) => {
        try {
            let sql = 'SELECT * FROM branches';
            let params = [];

            // Nếu có chọn thành phố thì thêm điều kiện lọc
            if (city) {
                sql += ' WHERE city = ?';
                params.push(city);
            }

            // Sắp xếp theo tên
            sql += ' ORDER BY name ASC';

            const [rows] = await db.query(sql, params);
            return rows;
        } catch (error) {
            throw error;
        }
    },

    // Hàm thêm mới (Giữ nguyên)
    create: async (data) => {
        const sql = 'INSERT INTO branches (name, address, city, phone, map_iframe) VALUES (?, ?, ?, ?, ?)';
        const [result] = await db.execute(sql, [
            data.name, 
            data.address, 
            data.city, 
            data.phone, 
            data.map_link // map từ form name="map_link" vào cột map_iframe
        ]);
        return result;
    },

    // Hàm xóa (Giữ nguyên)
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM branches WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Branch;