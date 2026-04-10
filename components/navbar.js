// OPC 网站导航栏激活状态管理
// 自动设置当前页面的导航栏 active 类

(function() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    const pageMap = {
        '': 'index',
        'index.html': 'index',
        'founder.html': 'founder',
        'company.html': 'company',
        'timeline.html': 'timeline',
        'day1.html': 'diary',
        'day2.html': 'diary',
        'day3.html': 'diary',
        'day5.html': 'diary',
        'about.html': 'about',
        'articles.html': 'articles',
        'ai-experiment.html': 'articles',
        'week1-review.html': 'articles',
        'status.html': 'index',
        'day-template.html': 'diary',
        '404.html': 'index'
    };
    
    const currentPageId = pageMap[currentPage] || 'index';
    
    // 移除所有 active 类
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    // 添加 active 类到当前页面
    const activeLink = document.querySelector(`.nav-link[data-page="${currentPageId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
})();

// 滚动时添加阴影效果
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
});

// 初始化滚动状态
window.addEventListener('load', function() {
    const navbar = document.getElementById('navbar');
    if (navbar && window.scrollY > 10) {
        navbar.classList.add('scrolled');
    }
});
