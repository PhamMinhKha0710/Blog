document.addEventListener('DOMContentLoaded', function() {
    // Chức năng mục lục thông minh
    const smartToc = () => {
        const toc = document.getElementById('smart-toc');
        if (!toc) return;
        
        const tocLinks = toc.querySelectorAll('a');
        const headings = document.querySelectorAll('.content h2, .content h3, .content h4, .content h5, .content h6');
        const tocToggleBtn = document.getElementById('toc-toggle-btn');
        const sidebar = document.querySelector('.post-sidebar');
        
        // Kiểm tra xem phần tử có trong viewport không
        const isInViewport = (el) => {
            const rect = el.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };
        
        // Kiểm tra phần tử đang được xem (vị trí trên cùng)
        const isTopElement = (el) => {
            const rect = el.getBoundingClientRect();
            return rect.top <= 100; // 100px từ đỉnh trang
        };
        
        // Tự động đánh dấu mục đang xem
        const highlightTocItem = () => {
            let currentHeading = null;
            
            // Tìm tiêu đề hiện tại
            for (let i = 0; i < headings.length; i++) {
                if (isInViewport(headings[i]) || isTopElement(headings[i])) {
                    currentHeading = headings[i];
                    break;
                }
            }
            
            if (!currentHeading && headings.length > 0) {
                // Nếu không có tiêu đề nào trong viewport, lấy tiêu đề đầu tiên
                let closestHeading = headings[0];
                let closestDistance = Math.abs(headings[0].getBoundingClientRect().top);
                
                for (let i = 1; i < headings.length; i++) {
                    const distance = Math.abs(headings[i].getBoundingClientRect().top);
                    if (distance < closestDistance) {
                        closestHeading = headings[i];
                        closestDistance = distance;
                    }
                }
                
                currentHeading = closestHeading;
            }
            
            // Xóa class active từ tất cả các liên kết TOC
            tocLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Thêm class active vào liên kết TOC tương ứng với tiêu đề hiện tại
            if (currentHeading) {
                const id = currentHeading.id;
                const activeLink = toc.querySelector(`a[href="#${id}"]`);
                
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        };
        
        // Cuộn mượt đến tiêu đề khi click vào liên kết TOC
        tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetId = link.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    // Cuộn mượt đến mục tiêu
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Trừ đi 80px cho header
                        behavior: 'smooth'
                    });
                    
                    // Thêm vào URL hash nhưng không gây cuộn
                    history.pushState(null, null, `#${targetId}`);
                    
                    // Đánh dấu liên kết TOC là active
                    tocLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Đóng TOC trên mobile sau khi click
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('show');
                    }
                }
            });
        });
        
        // Toggle TOC trên mobile
        if (tocToggleBtn) {
            tocToggleBtn.addEventListener('click', () => {
                sidebar.classList.toggle('show');
                tocToggleBtn.setAttribute('aria-expanded', 
                    tocToggleBtn.getAttribute('aria-expanded') === 'true' ? 'false' : 'true'
                );
            });
            
            // Đóng TOC khi click ra ngoài
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 768 && 
                    !sidebar.contains(e.target) && 
                    e.target !== tocToggleBtn) {
                    sidebar.classList.remove('show');
                    tocToggleBtn.setAttribute('aria-expanded', 'false');
                }
            });
        }
        
        // Thêm sự kiện cuộn để cập nhật TOC
        window.addEventListener('scroll', () => {
            requestAnimationFrame(highlightTocItem);
        });
        
        // Khởi tạo TOC
        highlightTocItem();
    };
    
    // Khởi chạy chức năng TOC
    smartToc();
});