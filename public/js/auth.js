// Shared Auth Nav Updater
// Include this on every page to show correct nav links based on login state

(function updateNav() {
    const isLoggedIn = sessionStorage.getItem('student_logged_in') === 'true';
    const studentName = sessionStorage.getItem('student_name') || 'Student';

    if (!isLoggedIn) return; // leave nav as-is if not logged in

    // Find Login and Register links and replace them with Dashboard + Logout
    const navLinks = document.querySelectorAll('nav a, nav li a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href') || '';
        const text = link.textContent.trim();

        if (href.includes('Student_Login') || text === 'Login') {
            link.textContent = '👤 ' + studentName;
            link.href = 'Dashboard.html';
            link.className = link.className; // preserve class
        }

        if (href.includes('Register') || text === 'Register') {
            link.textContent = 'Dashboard';
            link.href = 'Dashboard.html';
        }
    });
})();
