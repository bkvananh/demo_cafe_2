const express = require('express');
const router = express.Router();

// --- Import Controllers ---
const homeController = require('../controllers/homeController');
const clientController = require('../controllers/clientController');
const authController = require('../controllers/authController');
const adminController = require('../controllers/adminController');

// --- Import Middleware ---
const authMiddleware = require('../middlewares/auth');

// ==================================================================
// 1. PUBLIC ROUTES
// ==================================================================
router.get('/', homeController.index);
router.get('/thuc-don', clientController.menu);
router.get('/tin-tuc', clientController.news);
router.get('/tin-tuc/:id', clientController.postDetail);
router.post('/tin-tuc/comment', clientController.postComment);
router.get('/chi-nhanh', clientController.branches);
router.get('/lien-he', clientController.contact);
router.post('/lien-he', clientController.submitContact);
router.get('/ve-chung-toi', clientController.about);

// ==================================================================
// 2. AUTH ROUTES
// ==================================================================
router.get('/admin/login', authController.loginPage);
router.post('/admin/login', authController.login);
router.get('/admin/logout', authController.logout);

// ==================================================================
// 3. ADMIN ROUTES (Protected)
// ==================================================================
// Dashboard
router.get('/admin/dashboard', authMiddleware.requireLogin, adminController.dashboard);

// Products
router.get('/admin/products', authMiddleware.requireLogin, adminController.listProducts);
router.get('/admin/products/add', authMiddleware.requireLogin, adminController.addProductPage);
router.post('/admin/products/store', authMiddleware.requireLogin, adminController.storeProduct);
router.get('/admin/products/delete/:id', authMiddleware.requireLogin, adminController.deleteProduct);

// Posts
router.get('/admin/posts', authMiddleware.requireLogin, adminController.listPosts);
router.get('/admin/posts/add', authMiddleware.requireLogin, adminController.addPostPage);
router.post('/admin/posts/store', authMiddleware.requireLogin, adminController.storePost);
router.get('/admin/posts/delete/:id', authMiddleware.requireLogin, adminController.deletePost);

// Branches
router.get('/admin/branches', authMiddleware.requireLogin, adminController.listBranches);
router.get('/admin/branches/add', authMiddleware.requireLogin, adminController.addBranchPage);
router.post('/admin/branches/store', authMiddleware.requireLogin, adminController.storeBranch);
router.get('/admin/branches/delete/:id', authMiddleware.requireLogin, adminController.deleteBranch);

// Comments
router.get('/admin/comments', authMiddleware.requireLogin, adminController.listComments);
router.get('/admin/comments/approve/:id', authMiddleware.requireLogin, adminController.approveComment);
router.get('/admin/comments/delete/:id', authMiddleware.requireLogin, adminController.deleteComment);

// Contacts (Đã thêm nút xóa)
router.get('/admin/contacts', authMiddleware.requireLogin, adminController.listContacts);
router.get('/admin/contacts/delete/:id', authMiddleware.requireLogin, adminController.deleteContact); // <--- MỚI THÊM

module.exports = router;