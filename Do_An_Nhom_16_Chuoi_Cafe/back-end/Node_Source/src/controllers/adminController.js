const Product = require('../models/productModel');
const Post = require('../models/postModel');
const Branch = require('../models/branchModel');
const Comment = require('../models/commentModel');
const Contact = require('../models/contactModel');

const adminController = {
    // ... (Các hàm dashboard, products giữ nguyên) ...
    dashboard: async (req, res) => { res.render('admin/dashboard'); },
    
    // --- Products ---
    listProducts: async (req, res) => {
        const products = await Product.getAll();
        res.render('admin/products/list', { products });
    },
    addProductPage: (req, res) => res.render('admin/products/add'),
    storeProduct: async (req, res) => {
        try {
            const { name, price, category_id, image_url, description } = req.body;
            await Product.create({
                name, price, category_id, image_url, description, 
                is_featured: req.body.is_featured ? 1 : 0
            });
            res.redirect('/admin/products');
        } catch (err) {
            console.error(err);
            res.send('Lỗi thêm món: ' + err.message);
        }
    },
    deleteProduct: async (req, res) => {
        await Product.delete(req.params.id);
        res.redirect('/admin/products');
    },

    // --- Posts (Giữ nguyên phần đã sửa ở prompt trước) ---
    listPosts: async (req, res) => {
        const posts = await Post.getAll();
        res.render('admin/posts/list', { posts });
    },
    addPostPage: (req, res) => res.render('admin/posts/add'),
    storePost: async (req, res) => {
        try {
            const { title, content, type, thumbnail_url } = req.body;
            let publish_date = req.body.publish_date || new Date();
            
            if (!title || !thumbnail_url) {
                return res.send(`<script>alert('Lỗi: Thiếu tiêu đề hoặc ảnh!'); window.history.back();</script>`);
            }
            await Post.create({ title, content, type, thumbnail_url, publish_date });
            res.redirect('/admin/posts');
        } catch (err) {
            console.error("Lỗi Store Post:", err);
            res.status(500).send(`Lỗi thêm bài viết: ${err.message}`);
        }
    },
    deletePost: async (req, res) => {
        await Post.delete(req.params.id);
        res.redirect('/admin/posts');
    },

    // --- Branches (SỬA LỖI Ở ĐÂY) ---
    listBranches: async (req, res) => {
        const branches = await Branch.getAll();
        res.render('admin/branches/list', { branches });
    },
    addBranchPage: (req, res) => res.render('admin/branches/add'),
    
    storeBranch: async (req, res) => {
        try {
            const { name, address, city, phone, map_link } = req.body;

            // 1. Validate: Kiểm tra dữ liệu bắt buộc
            if (!name || !address) {
                return res.send(`
                    <script>
                        alert('Lỗi: Vui lòng nhập Tên chi nhánh và Địa chỉ!');
                        window.history.back();
                    </script>
                `);
            }

            // 2. Gọi Model để lưu
            await Branch.create({ name, address, city, phone, map_link });
            
            // 3. Thành công -> Về trang danh sách
            res.redirect('/admin/branches');

        } catch (err) {
            // 4. Bắt lỗi và in ra màn hình
            console.error("Lỗi Store Branch:", err);
            res.status(500).send(`
                <h3>Gặp lỗi khi thêm chi nhánh!</h3>
                <p>Chi tiết lỗi: ${err.message}</p>
                <a href="/admin/branches/add">Quay lại</a>
            `);
        }
    },

    deleteBranch: async (req, res) => {
        await Branch.delete(req.params.id);
        res.redirect('/admin/branches');
    },

    // --- Comments & Contacts (Giữ nguyên) ---
    listComments: async (req, res) => {
        const comments = await Comment.getAll();
        res.render('admin/comments/list', { comments });
    },
    approveComment: async (req, res) => {
        await Comment.updateStatus(req.params.id, 'approved');
        res.redirect('/admin/comments');
    },
    deleteComment: async (req, res) => {
        await Comment.delete(req.params.id);
        res.redirect('/admin/comments');
    },
    listContacts: async (req, res) => {
        const contacts = await Contact.getAll();
        try { await Contact.markAllRead(); } catch(e) {}
        res.render('admin/contacts/list', { contacts });
    },
    deleteContact: async (req, res) => {
        try {
            await Contact.delete(req.params.id);
            res.redirect('/admin/contacts');
        } catch (err) {
            console.error(err);
            res.send('Lỗi xóa liên hệ');
        }
    }
};

module.exports = adminController;