const requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        // Đã login -> Cho qua
        return next();
    } else {
        // Chưa login -> Đá về trang đăng nhập
        return res.redirect('/admin/login');
    }
};

module.exports = { requireLogin };