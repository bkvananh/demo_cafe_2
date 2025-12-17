const db = require('../config/db');

const Comment = {
    // 1. Lấy tất cả comment (Cho Admin)
    getAll: async () => {
        const sql = `
            SELECT comments.*, posts.title as post_title 
            FROM comments 
            JOIN posts ON comments.post_id = posts.id 
            ORDER BY comments.created_at DESC
        `;
        const [rows] = await db.query(sql);
        return rows;
    },

    // 2. Lấy comment theo bài viết (SỬA LỖI Ở ĐÂY)
    // Hàm này dùng để hiện comment ở trang chi tiết bài viết (chỉ lấy comment đã duyệt)
    getByPostId: async (postId) => {
        const sql = 'SELECT * FROM comments WHERE post_id = ? AND status = "approved" ORDER BY created_at DESC';
        const [rows] = await db.query(sql, [postId]);
        return rows;
    },

    // 3. Tạo comment mới
    create: async (data) => {
        const sql = 'INSERT INTO comments (post_id, author_name, content, status) VALUES (?, ?, ?, "pending")';
        const [result] = await db.execute(sql, [data.post_id, data.author_name, data.content]);
        return result;
    },

    // 4. Duyệt comment
    updateStatus: async (id, status) => {
        const [result] = await db.execute('UPDATE comments SET status = ? WHERE id = ?', [status, id]);
        return result;
    },

    // 5. Xóa comment
    delete: async (id) => {
        const [result] = await db.execute('DELETE FROM comments WHERE id = ?', [id]);
        return result;
    }
};

module.exports = Comment;