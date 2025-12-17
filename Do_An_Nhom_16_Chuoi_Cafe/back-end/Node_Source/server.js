require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
const db = require('./src/config/db'); // Import kết nối DB

const app = express();
const port = process.env.PORT || 3000;

// --- 1. Cấu hình View Engine (EJS) ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// --- 2. Cấu hình Static Files ---
app.use(express.static(path.join(__dirname, 'public')));

// --- 3. Cấu hình Body Parser ---
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// --- 4. Cấu hình Session ---
app.use(session({
    secret: process.env.SESSION_SECRET || 'cafe_secret_key_123',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 tiếng
}));

// --- 5. Middleware Toàn Cục (Global) ---
app.use(async (req, res, next) => {
    // Truyền thông tin user xuống view
    res.locals.user = req.session.user || null;

    // Khởi tạo biến đếm mặc định
    res.locals.pendingCount = 0; // Đếm bình luận
    res.locals.contactCount = 0; // Đếm liên hệ

    // Nếu là Admin thì mới đi đếm
    if (req.session.user && req.session.user.role === 'admin') {
        try {
            // 1. Đếm bình luận chờ duyệt
            const [commentRows] = await db.query('SELECT COUNT(*) as count FROM comments WHERE status = "pending"');
            res.locals.pendingCount = commentRows[0].count;

            // 2. Đếm tin nhắn liên hệ chưa đọc (Mới thêm)
            const [contactRows] = await db.query('SELECT COUNT(*) as count FROM contacts WHERE status = "unread"');
            res.locals.contactCount = contactRows[0].count;
            
        } catch (err) {
            console.error("Lỗi đếm thông báo:", err);
        }
    }

    next();
});

// --- 6. Routes ---
const webRoutes = require('./src/routes/web');
app.use('/', webRoutes);

// --- 7. Khởi động Server ---
app.listen(port, () => {
    console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
});