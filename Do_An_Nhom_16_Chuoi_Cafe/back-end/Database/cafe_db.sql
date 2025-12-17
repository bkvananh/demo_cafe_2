-- 1. Xóa Database cũ nếu có để tạo lại từ đầu cho sạch
DROP DATABASE IF EXISTS cafe_db;

-- 2. Tạo Database mới
CREATE DATABASE cafe_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE cafe_db;

-- --------------------------------------------------------
-- BẢNG 1: USERS (Quản trị viên)
-- --------------------------------------------------------
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('admin', 'staff') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- BẢNG 2: CATEGORIES (Danh mục món)
-- --------------------------------------------------------
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50)
);

-- --------------------------------------------------------
-- BẢNG 3: PRODUCTS (Sản phẩm - Món ăn)
-- --------------------------------------------------------
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 0) NOT NULL,
    image_url VARCHAR(255), -- Lưu đường dẫn ảnh local (/img/products/...)
    category_id INT,
    is_featured BOOLEAN DEFAULT 0, -- 1 = Món nổi bật hiện trang chủ
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- --------------------------------------------------------
-- BẢNG 4: POSTS (Tin tức & Khuyến mãi)
-- --------------------------------------------------------
CREATE TABLE posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT,
    type ENUM('event', 'promo') DEFAULT 'event',
    thumbnail_url VARCHAR(255), -- Lưu đường dẫn ảnh local (/img/posts/...)
    publish_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- --------------------------------------------------------
-- BẢNG 5: BRANCHES (Chi nhánh cửa hàng)
-- --------------------------------------------------------
CREATE TABLE branches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    phone VARCHAR(20),
    map_iframe TEXT -- Chứa link nhúng bản đồ
);

-- --------------------------------------------------------
-- BẢNG 6: COMMENTS (Bình luận bài viết)
-- --------------------------------------------------------
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    status ENUM('pending', 'approved', 'spam') DEFAULT 'pending', -- pending = Chờ duyệt (hiện chấm đỏ)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- --------------------------------------------------------
-- BẢNG 7: CONTACTS (Liên hệ khách hàng)
-- --------------------------------------------------------
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read') DEFAULT 'unread', -- unread = Chưa đọc (hiện chấm đỏ)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ========================================================
-- DATA SEEDING (DỮ LIỆU MẪU)
-- ========================================================

-- 1. Admin (Pass: 123456)
INSERT INTO users (username, password, full_name, role) VALUES 
('admin', '123456', 'Admin Catfe', 'admin');

-- 2. Danh mục
INSERT INTO categories (name, slug) VALUES 
('Cà Phê', 'coffee'),
('Trà', 'tea'),
('Freeze', 'freeze'),
('Bánh Ngọt', 'cake');

-- 3. Sản phẩm (Lưu ý: Bạn cần có file ảnh trong public/img/products/)
INSERT INTO products (name, price, category_id, image_url, description, is_featured) VALUES
-- Cà Phê
('Phin Sữa Đá Catfe', 29000, 1, '/img/products/phin-sua-da.jpg', 'Hương vị cà phê Robusta Đắk Lắk đậm đà.', 1),
('Phin Đen Đá', 29000, 1, '/img/products/phin-den-da.jpg', 'Dành cho người sành cà phê.', 0),
('Bạc Xỉu Đá', 29000, 1, '/img/products/bac-xiu.jpg', 'Hòa quyện giữa sữa béo ngậy và cà phê.', 0),
-- Trà
('Trà Sen Vàng', 45000, 2, '/img/products/tra-sen-vang.jpg', 'Sự kết hợp giữa trà Oolong, hạt sen và kem sữa.', 1),
('Trà Thạch Đào', 45000, 2, '/img/products/tra-thach-dao.jpg', 'Thanh mát với miếng đào giòn tan.', 0),
('Trà Thanh Đào', 45000, 2, '/img/products/tra-thanh-dao.jpg', 'Hương sả thơm lừng.', 0),
-- Freeze
('Freeze Trà Xanh', 55000, 3, '/img/products/freeze-tra-xanh.jpg', 'Đá xay mát lạnh từ trà xanh Nhật Bản.', 1),
('Caramel Phin Freeze', 55000, 3, '/img/products/caramel-phin-freeze.jpg', 'Thơm lừng hương Caramel.', 0),
('Classic Phin Freeze', 55000, 3, '/img/products/classic-phin-freeze.jpg', 'Vị cà phê truyền thống đá xay.', 0),
-- Bánh
('Bánh Mì Que', 19000, 4, '/img/products/banh-mi-que.jpg', 'Nóng hổi, giòn tan.', 0);

-- 4. Tin tức (Lưu ý: Bạn cần có file ảnh trong public/img/posts/)
INSERT INTO posts (title, content, type, thumbnail_url, publish_date) VALUES 
('Tưng bừng khai trương Catfe Thủ Đức', '<p>Chào đón cửa hàng mới tại 97 Man Thiện với hàng ngàn ưu đãi hấp dẫn...</p>', 'event', '/img/posts/news-1.jpg', NOW()),
('Ưu đãi Mùa Hè: Mua 2 Tính Tiền 1', '<p>Áp dụng cho toàn bộ dòng trà và freeze vào khung giờ vàng...</p>', 'promo', '/img/posts/news-2.jpg', NOW()),
('Ra mắt bộ sưu tập Trà Hạt Sen mới', '<p>Hương vị thanh tao, đậm đà bản sắc Việt...</p>', 'event', '/img/posts/news-3.jpg', NOW());

-- 5. Chi nhánh (3 địa chỉ chính xác theo yêu cầu)
INSERT INTO branches (name, address, city, phone, map_iframe) VALUES 
('Catfe Hà Đông', '96A Đ. Trần Phú, P. Mộ Lao, Hà Đông, Hà Nội', 'Hà Nội', '024 3355 6677', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.814579294528!2d105.78506137599763!3d20.98394438876404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acc5d933e4c1%3A0xc3f6050720456108!2zOTZBIFRy4bqnbiBQaMO6LCBQLCBN4buZIExhbywgSMOgIMSQw7RuZywgSMOgIE7huqlpLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s'),

('Catfe Quận 1', '11 Nguyễn Đình Chiểu, Đa Kao, Quận 1, TP.HCM', 'Hồ Chí Minh', '028 3910 1112', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4243642735235!2d106.69848937583768!3d10.783695259150106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3679d65971%3A0x6295777777777777!2zMTEgTmd1eeG7hW4gxJDDrG5oIENoaeG7g3UsIMSQYSBLYW8sIFF14bqtbiAxLCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1700000000001!5m2!1svi!2s'),

('Catfe Thủ Đức', '97 Man Thiện, Hiệp Phú, Thủ Đức, TP.HCM', 'Hồ Chí Minh', '028 9999 8888', 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.520072223838!2d106.7846663148007!3d10.84799229227301!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175276bb276f6d9%3A0x24a413f413f413f4!2zOTcgTWFuIFRoaeG7h24sIEhp4buHcCwgVGjhu6cgxJDhu6ljLCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1700000000002!5m2!1svi!2s');

-- 6. Dữ liệu mẫu để test tính năng thông báo (Chấm đỏ)
-- Bình luận chờ duyệt
INSERT INTO comments (post_id, author_name, content, status) VALUES 
(1, 'Nguyễn Văn A', 'Quán mới đẹp quá, sẽ ghé ủng hộ!', 'pending'),
(2, 'Trần Thị B', 'Khuyến mãi này áp dụng đến bao giờ vậy ạ?', 'pending');

-- Tin nhắn liên hệ chưa đọc
INSERT INTO contacts (name, email, message, status) VALUES 
('Khách Hàng Vip', 'vip@gmail.com', 'Mình muốn đặt tiệc sinh nhật khoảng 20 người, quán có phòng riêng không?', 'unread'),
('Đối Tác Cung Ứng', 'supply@cafe.vn', 'Gửi báo giá nguyên liệu cà phê sạch.', 'unread');