// Production-ready routing for HTML pages
// This ensures all HTML pages redirect to React app root

(function() {
    'use strict';
    
    // Check if we're on an HTML page that should redirect to React app
    const currentPath = window.location.pathname;
    const htmlPages = [
        '/about.html',
        '/campus-life.html', 
        '/news-events.html',
        '/admissions.html',
        '/achievements.html',
        '/contact.html',
        '/gallery.html',
        '/news.html',
        '/login.html',
        '/teacher-dashboard.html',
        '/student-dashboard.html'
    ];
    
    // If we're on an HTML page, redirect to root
    if (htmlPages.includes(currentPath)) {
        window.location.replace('/');
        return;
    }
    
    // Handle Home button clicks from HTML pages
    document.addEventListener('click', function(e) {
        if (e.target && e.target.textContent === 'Home') {
            e.preventDefault();
            window.location.href = '/';
        }
    });
    
    // Handle navigation from HTML pages
    const homeButtons = document.querySelectorAll('button[onclick*="window.location.href=\'/\'"]');
    homeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            window.location.href = '/';
        });
    });
    
})();
