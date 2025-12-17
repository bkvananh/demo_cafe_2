const Product = require('../models/productModel');
const Post = require('../models/postModel');
const Branch = require('../models/branchModel');
const Comment = require('../models/commentModel');
const Contact = require('../models/contactModel');

const clientController = {

    // 1. TRANG CHỦ
    index: async (req, res) => {
        try {
            const featuredProducts = await Product.getFeatured(); 
            const latestPosts = await Post.getRecent();
            
            res.render('client/index', { 
                featuredProducts: featuredProducts || [], 
                latestPosts: latestPosts || [] 
            });
        } catch (err) {
            console.error("Lỗi Trang Chủ:", err);
            res.status(500).send('Lỗi tải trang chủ');
        }
    },

    // 2. THỰC ĐƠN (SỬA LỖI Ở ĐÂY)
    menu: async (req, res) => {
        try {
            const categoryId = req.query.cat;
            let products;
            
            if (categoryId) {
                products = await Product.getByCategory(categoryId);
            } else {
                products = await Product.getAll();
            }

            // SỬA: Đã đổi tên thành 'currentCat' để khớp với thuc-don.ejs
            res.render('client/thuc-don', { 
                products: products || [], 
                currentCat: categoryId  // <--- Quan trọng: Phải là currentCat
            });
        } catch (err) {
            console.error("Lỗi Thực Đơn:", err);
            res.status(500).send('Lỗi tải thực đơn');
        }
    },

    // 3. TIN TỨC
    news: async (req, res) => {
        try {
            const posts = await Post.getAll();
            res.render('client/tin-tuc', { posts: posts || [] });
        } catch (err) {
            console.error("Lỗi Tin Tức:", err);
            res.status(500).send('Lỗi tải tin tức');
        }
    },

    // 4. CHI TIẾT BÀI VIẾT
    postDetail: async (req, res) => {
        try {
            const post = await Post.getById(req.params.id);
            if (!post) return res.redirect('/tin-tuc');
            
            const comments = await Comment.getByPostId(req.params.id);

            res.render('client/chi-tiet', { 
                post, 
                comments: comments || [] 
            });
        } catch (err) {
            console.error("Lỗi Chi Tiết:", err);
            res.status(500).send('Lỗi tải bài viết');
        }
    },

    // 5. GỬI BÌNH LUẬN
    postComment: async (req, res) => {
        try {
            await Comment.create(req.body);
            res.send(`
                <script>
                    alert('Bình luận đã gửi và đang chờ duyệt!');
                    window.location.href = '/tin-tuc/${req.body.post_id}';
                </script>
            `);
        } catch (err) {
            console.error("Lỗi Comment:", err);
            res.send('Lỗi gửi bình luận');
        }
    },

    // 6. CHI NHÁNH
    branches: async (req, res) => {
        try {
            const city = req.query.city || '';
            const branches = await Branch.getAll(city); 
            
            res.render('client/chi-nhanh', { 
                branches: branches || [], 
                selectedCity: city 
            });
        } catch (err) {
            console.error("Lỗi Chi Nhánh:", err);
            res.status(500).send('Lỗi tải chi nhánh');
        }
    },

    // 7. LIÊN HỆ & GIỚI THIỆU
    contact: (req, res) => {
        res.render('client/lien-he');
    },

    submitContact: async (req, res) => {
        try {
            await Contact.create(req.body);
            res.redirect('/lien-he?success=true');
        } catch (err) {
            console.error("Lỗi Contact:", err);
            res.send('Lỗi gửi liên hệ');
        }
    },

    about: (req, res) => {
        res.render('client/ve-chung-toi');
    }
};
// ... các hàm khác giữ nguyên ...

    // 8. Xử lý form liên hệ (SỬA LẠI ĐOẠN NÀY)
    submitContact: async (req, res) => {
        try {
            console.log("Dữ liệu nhận được:", req.body); // In ra terminal để debug

            const { name, email, message } = req.body;
            
            // 1. Validate đầu vào
            if (!name || !email || !message) {
                return res.send(`
                    <h3>Thiếu thông tin!</h3>
                    <p>Vui lòng nhập đủ Họ tên, Email và Nội dung.</p>
                    <a href="/lien-he">Quay lại</a>
                `);
            }

            // 2. Gọi Model tạo liên hệ
            await Contact.create({ name, email, message });
            
            // 3. Thành công
            res.redirect('/lien-he?success=true');

        } catch (err) {
            // 4. In lỗi chi tiết ra màn hình web để bạn đọc
            console.error("Lỗi Controller Contact:", err);
            res.status(500).send(`
                <h3>Gặp lỗi khi gửi liên hệ!</h3>
                <p>Chi tiết lỗi: <b>${err.message}</b></p>
                <p><i>Hãy chụp màn hình lỗi này gửi cho người hỗ trợ.</i></p>
                <a href="/lien-he">Thử lại</a>
            `);
        }
    },
    
    // ... các hàm khác giữ nguyên ...

module.exports = clientController;