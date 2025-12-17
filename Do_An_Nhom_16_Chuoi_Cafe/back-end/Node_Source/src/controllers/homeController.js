const Product = require('../models/productModel');
const Post = require('../models/postModel');

const homeController = {
    index: async (req, res) => {
        try {
            // RF-01: Lấy 3 món nổi bật & 3 tin mới nhất
            const featuredProducts = await Product.getFeatured();
            const recentPosts = await Post.getRecent();

            res.render('client/index', { 
                // Sử dụng || [] để đảm bảo không bị lỗi nếu DB trả về null
                featuredProducts: featuredProducts || [], 
                
                // QUAN TRỌNG: Tên biến này phải khớp với biến trong file index.ejs (dòng 120)
                recentPosts: recentPosts || [],
                
                title: 'Catfe Coffee - Hương Vị Việt Đích Thực' 
            });
        } catch (err) {
            console.error("Lỗi HomeController:", err);
            res.status(500).send('Lỗi Server: ' + err.message);
        }
    }
};

module.exports = homeController;