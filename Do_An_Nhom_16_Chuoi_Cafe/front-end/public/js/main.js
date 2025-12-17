document.addEventListener("DOMContentLoaded", function () {
    
    // ====================================================
    // 1. INIT SWIPER SLIDER (Cho Banner Trang Chủ)
    // ====================================================
    // Kiểm tra xem trang hiện tại có slider không để tránh lỗi ở các trang khác
    if (document.querySelector(".mySwiper")) {
        var swiper = new Swiper(".mySwiper", {
            spaceBetween: 30,
            centeredSlides: true,
            loop: true, // Vòng lặp vô tận
            autoplay: {
                delay: 4000, // 4 giây tự chuyển
                disableOnInteraction: false,
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });
    }

    // ====================================================
    // 2. STICKY HEADER EFFECT
    // ====================================================
    const header = document.querySelector("header");
    
    window.addEventListener("scroll", function () {
        if (window.scrollY > 50) {
            // Khi cuộn xuống quá 50px, thêm class 'scrolled'
            header.classList.add("scrolled");
        } else {
            // Khi quay về đầu trang, gỡ class
            header.classList.remove("scrolled");
        }
    });

    // ====================================================
    // 3. SOCIAL SHARE FUNCTION (Chia sẻ bài viết)
    // ====================================================
    
    // Lấy tất cả các nút có class share-fb và share-zalo
    const fbButtons = document.querySelectorAll('.share-fb');
    const zaloButtons = document.querySelectorAll('.share-zalo');
    
    // Lấy URL hiện tại của trang web
    const currentUrl = encodeURIComponent(window.location.href);

    // Xử lý chia sẻ Facebook
    fbButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`;
            // Mở cửa sổ popup nhỏ thay vì tab mới hoàn toàn
            window.open(shareUrl, 'FacebookShare', 'width=600,height=400,scrollbars=no,resizable=no');
        });
    });

    // Xử lý chia sẻ Zalo (Copy link hoặc mở Zalo Web)
    zaloButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Cách đơn giản nhất cho Zalo Web
            const shareUrl = `https://zalo.me/share/?url=${currentUrl}`;
            window.open(shareUrl, 'ZaloShare', 'width=600,height=400,scrollbars=no,resizable=no');
        });
    });

});