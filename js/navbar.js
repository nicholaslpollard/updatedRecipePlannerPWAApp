// navbar.js

// Wait for content to load before running script
document.addEventListener('DOMContentLoaded', function() {

    // NAVBAR INJECTION & SIDENAV INIT 
    function loadNavbar() {
        const isPagesFolder = window.location.pathname.includes('/pages/'); // check if current page is in /pages/
        const basePath = isPagesFolder ? '../' : './'; // set correct relative path for links

        // Navbar HTML with desktop and mobile (sidenav) links
        const navHTML = `
            <nav class="teal">
                <div class="nav-wrapper container">
                    <a href="${basePath}index.html" class="brand-logo">Recipe Planner</a>
                    <a href="#" data-target="mobile-demo" class="sidenav-trigger">
                        <i class="material-icons">menu</i>
                    </a>
                    <ul class="right hide-on-med-and-down">
                        <li><a href="${basePath}index.html">Home</a></li>
                        <li><a href="${basePath}pages/all-recipes.html">All Recipes</a></li>
                        <li><a href="${basePath}pages/buy-list.html">Buy List</a></li>
                        <li><a href="${basePath}pages/about.html">About</a></li>
                    </ul>
                </div>
            </nav>
            <ul class="sidenav" id="mobile-demo">
                <li><a href="${basePath}index.html">Home</a></li>
                <li><a href="${basePath}pages/all-recipes.html">All Recipes</a></li>
                <li><a href="${basePath}pages/buy-list.html">Buy List</a></li>
                <li><a href="${basePath}pages/about.html">About</a></li>
            </ul>
        `;

        // Navbar at top of body
        const navbarContainer = document.createElement('div');
        navbarContainer.innerHTML = navHTML;
        document.body.prepend(navbarContainer);

        // Initialize Materialize sidenav
        const elems = document.querySelectorAll('.sidenav');
        M.Sidenav.init(elems);

        // Highlight current page link in navbar and sidenav
        const currentPath = window.location.pathname.split("/").pop();
        document.querySelectorAll('.nav-wrapper ul li a').forEach(link => {
            if (link.getAttribute('href').endsWith(currentPath)) link.classList.add('active');
        });
        document.querySelectorAll('.sidenav li a').forEach(link => {
            if (link.getAttribute('href').endsWith(currentPath)) link.classList.add('active');
        });
    }

    loadNavbar(); // navbar on page load

    // Service Worker Registration 
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            const swPath = window.location.pathname.includes('/pages/') ? '../service-worker.js' : './service-worker.js'; // correct relative path
            navigator.serviceWorker.register(swPath)
                .then(reg => console.log('Service Worker registered:', reg.scope))
                .catch(err => console.error('Service Worker registration failed:', err));
        });
    }

});
