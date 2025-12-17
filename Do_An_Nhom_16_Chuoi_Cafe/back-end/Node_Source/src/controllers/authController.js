const User = require('../models/userModel');

const authController = {
    // GET: Hiển thị form login
    loginPage: (req, res) => {
        // Nếu đã login rồi thì vào thẳng dashboard
        if (req.session.user) return res.redirect('/admin/dashboard');
        res.render('admin/login', { error: null });
    },

    // POST: Xử lý đăng nhập
    login: async (req, res) => {
        try {
            const { username, password } = req.body;

            // Validate cơ bản
            if (!username || !password) {
                return res.render('admin/login', { error: 'Vui lòng nhập đủ thông tin!' });
            }

            const user = await User.findByUsername(username);

            // Kiểm tra user và password (Lưu ý: Đang so sánh plaintext như yêu cầu Prompt 1)
            if (!user || user.password !== password) {
                return res.render('admin/login', { error: 'Sai tài khoản hoặc mật khẩu!' });
            }

            // Lưu session
            req.session.user = {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                role: user.role
            };

            res.redirect('/admin/dashboard');

        } catch (err) {
            console.error(err);
            res.render('admin/login', { error: 'Lỗi server!' });
        }
    },

    // GET: Đăng xuất (RF-16)
    logout: (req, res) => {
        req.session.destroy((err) => {
            if (err) console.error(err);
            res.redirect('/admin/login');
        });
    }
};

module.exports = authController;