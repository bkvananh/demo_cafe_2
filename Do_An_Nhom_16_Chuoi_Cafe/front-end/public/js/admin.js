// public/js/admin.js

document.addEventListener("DOMContentLoaded", function () {
    console.log("Admin Panel Loaded");

    // 1. Xác nhận khi xóa (Global cho mọi nút xóa trong Admin)
    const deleteButtons = document.querySelectorAll('.btn-delete');
    
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (!confirm('CẢNH BÁO: Bạn có chắc chắn muốn xóa dữ liệu này không? Hành động này không thể hoàn tác.')) {
                e.preventDefault(); // Hủy hành động thẻ a nếu user chọn Cancel
            }
        });
    });

    // 2. Preview ảnh trước khi upload (Nếu sau này dùng input file)
    // Hiện tại đang dùng URL ảnh nên không cần chức năng này, 
    // nhưng có thể thêm logic check URL ảnh hợp lệ tại đây.
});