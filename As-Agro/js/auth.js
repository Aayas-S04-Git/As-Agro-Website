// User data storage
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Handle Signup
function handleSignup(event) {
    event.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate password match
    if (password !== confirmPassword) {
        showAlert('Passwords do not match!', 'danger');
        return false;
    }

    // Check if user already exists
    if (users.find(user => user.email === email)) {
        showAlert('Email already registered!', 'danger');
        return false;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        fullName,
        email,
        phone,
        password: hashPassword(password)
    };

    // Add user to storage
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showAlert('Registration successful! Please login.', 'success');
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);

    return false;
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Find user
    const user = users.find(u => u.email === email && verifyPassword(password, u.password));

    if (user) {
        // Set current user
        currentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email
        };

        if (rememberMe) {
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }

        showAlert('Login successful!', 'success');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } else {
        showAlert('Invalid email or password!', 'danger');
    }

    return false;
}

// Handle Logout
function handleLogout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    currentUser = null;
    window.location.href = 'login.html';
}

// Password visibility toggle
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Forgot Password
function forgotPassword() {
    const email = prompt('Enter your email address:');
    if (email) {
        const user = users.find(u => u.email === email);
        if (user) {
            // In a real application, you would send a reset link to the user's email
            showAlert('Password reset link has been sent to your email!', 'success');
        } else {
            showAlert('Email not found!', 'danger');
        }
    }
}

// Simple password hashing (for demo purposes - use proper hashing in production)
function hashPassword(password) {
    return btoa(password); // Base64 encoding (NOT secure - just for demo)
}

function verifyPassword(password, hashedPassword) {
    return btoa(password) === hashedPassword;
}

// Alert helper
function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '1000';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Check authentication status
function checkAuth() {
    const protectedPages = ['profile.html']; // Add other protected pages
    const currentPage = window.location.pathname.split('/').pop();

    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
    }
}

// Update UI based on auth status
function updateAuthUI() {
    const authLinks = document.querySelector('.auth-links');
    if (authLinks) {
        if (currentUser) {
            authLinks.innerHTML = `
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        ${currentUser.fullName}
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html">Profile</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="handleLogout()">Logout</a></li>
                    </ul>
                </li>
            `;
        } else {
            authLinks.innerHTML = `
                <li class="nav-item">
                    <a class="nav-link" href="login.html">Login</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="signup.html">Sign Up</a>
                </li>
            `;
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    updateAuthUI();
});
