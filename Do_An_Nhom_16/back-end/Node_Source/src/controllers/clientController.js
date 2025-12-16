const Product = require('../models/productModel');
const Post = require('../models/postModel');
const Branch = require('../models/branchModel'); // Import Model
const Contact = require('../models/contactModel');
const Comment = require('../models/commentModel');

const clientController = {
    // 1. Trang chủ
    index: async (req, res) => {
        try {
            const featuredProducts = await Product.getFeatured();
            const latestPosts = await Post.getRecent();
            res.render('client/index', { featuredProducts, latestPosts });
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi tải trang chủ');
        }
    },

    // 2. Trang Thực đơn (Menu)
    menu: async (req, res) => {
        try {
            const categoryId = req.query.cat; // Lấy cat=... trên URL
            let products;
            
            if (categoryId) {
                products = await Product.getByCategory(categoryId);
            } else {
                products = await Product.getAll();
            }

            res.render('client/thuc-don', { products, activeCat: categoryId });
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi tải thực đơn');
        }
    },

    // 3. Trang Tin tức
    news: async (req, res) => {
        try {
            const posts = await Post.getAll();
            res.render('client/tin-tuc', { posts });
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi tải tin tức');
        }
    },

    // 4. Chi tiết tin tức
    postDetail: async (req, res) => {
        try {
            const post = await Post.getById(req.params.id);
            if (!post) return res.status(404).send('Bài viết không tồn tại');
            
            // Lấy comment đã duyệt của bài viết này
            const comments = await Comment.getByPostId(req.params.id);

            res.render('client/chi-tiet', { post, comments });
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi tải bài viết');
        }
    },

    // 5. Gửi bình luận
    postComment: async (req, res) => {
        try {
            await Comment.create(req.body);
            // Quay lại trang bài viết cũ
            res.send(`
                <script>
                    alert('Bình luận của bạn đã được gửi và đang chờ duyệt!');
                    window.location.href = '/tin-tuc/${req.body.post_id}';
                </script>
            `);
        } catch (err) {
            console.error(err);
            res.send('Lỗi gửi bình luận');
        }
    },

    // 6. Trang Chi nhánh (SỬA LỖI Ở ĐÂY)
    branches: async (req, res) => {
        try {
            const city = req.query.city || ''; // Lấy city từ URL (?city=Hồ Chí Minh)
            
            // Gọi Model kèm tham số city (Model đã sửa ở bước 1)
            const branches = await Branch.getAll(city); 
            
            res.render('client/chi-nhanh', { 
                branches, 
                selectedCity: city 
            });
        } catch (err) {
            console.error("Lỗi Controller Branches:", err);
            res.status(500).send('Lỗi tải chi nhánh: ' + err.message);
        }
    },

    // 7. Trang Liên hệ
    contact: (req, res) => {
        res.render('client/lien-he');
    },

    // 8. Xử lý gửi liên hệ
    submitContact: async (req, res) => {
        try {
            await Contact.create(req.body);
            res.redirect('/lien-he?success=true');
        } catch (err) {
            console.error(err);
            res.send('Lỗi gửi liên hệ');
        }
    },

    // 9. Trang Giới thiệu
    about: (req, res) => {
        res.render('client/ve-chung-toi');
    }
};

module.exports = clientController;