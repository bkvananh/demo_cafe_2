const Product = require('../models/productModel');
const Post = require('../models/postModel');

const homeController = {
    index: async (req, res) => {
        try {
            // RF-01: Lấy 3 món nổi bật & 3 tin mới nhất
            const featuredProducts = await Product.getFeatured();
            const recentPosts = await Post.getRecent();

            res.render('client/index', { 
                featuredProducts, 
                recentPosts,
                title: 'Trang chủ' // Dùng cho <title>
            });
        } catch (err) {
            console.error(err);
            res.status(500).send('Lỗi Server');
        }
    }
};

module.exports = homeController;