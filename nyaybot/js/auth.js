// Authentication functions for LEXAI

// Simulated user database (in production, use backend API)
const USERS_KEY = 'lexai_users';

// Initialize users array
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Login function
function login(email, password, rememberMe = false) {
    const users = getUsers();
    const user = users.find(u => u.email === email);

    if (!user) {
        showError('No account found with this email address.');
        return false;
    }

    if (user.password !== password) {
        showError('Incorrect password. Please try again.');
        return false;
    }

    // Store user session
    const userSession = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        phone: user.phone,
        barCouncil: user.barCouncil,
        loginTime: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(userSession));
    
    if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
    }

    showSuccess('Login successful! Redirecting...');
    
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);

    return true;
}

// Register function
function register(formData) {
    const users = getUsers();

    // Check if email already exists
    if (users.find(u => u.email === formData.email)) {
        showError('An account with this email already exists.');
        return false;
    }

    // Validate password strength
    if (formData.password.length < 8) {
        showError('Password must be at least 8 characters long.');
        return false;
    }

    // Add new user
    const newUser = {
        id: Date.now().toString(),
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        phone: formData.phone,
        barCouncil: formData.barCouncil,
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveUsers(users);

    showSuccess('Account created successfully! Redirecting to login...');

    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);

    return true;
}

// Logout function
function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    window.location.href = 'login.html';
}

// Check authentication
function checkAuth() {
    const user = localStorage.getItem('user');
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

// Get current user
function getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
}

// Update user profile
function updateProfile(updates) {
    const user = getCurrentUser();
    if (!user) return false;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === user.email);

    if (userIndex === -1) return false;

    // Update user in database
    Object.assign(users[userIndex], updates);
    saveUsers(users);

    // Update session
    Object.assign(user, updates);
    localStorage.setItem('user', JSON.stringify(user));

    showSuccess('Profile updated successfully!');
    return true;
}

// Change password
function changePassword(currentPassword, newPassword) {
    const user = getCurrentUser();
    if (!user) return false;

    const users = getUsers();
    const userRecord = users.find(u => u.email === user.email);

    if (!userRecord || userRecord.password !== currentPassword) {
        showError('Current password is incorrect.');
        return false;
    }

    if (newPassword.length < 8) {
        showError('New password must be at least 8 characters long.');
        return false;
    }

    userRecord.password = newPassword;
    saveUsers(users);

    showSuccess('Password changed successfully!');
    return true;
}

// Helper functions for UI feedback
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 5000);
    } else {
        alert(message);
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.add('show');
        setTimeout(() => successDiv.classList.remove('show'), 5000);
    } else {
        alert(message);
    }
}

// Session timeout (30 minutes)
function checkSessionTimeout() {
    const user = getCurrentUser();
    if (!user || !user.loginTime) return;

    const loginTime = new Date(user.loginTime);
    const now = new Date();
    const diffMinutes = (now - loginTime) / (1000 * 60);

    if (diffMinutes > 30) {
        showError('Session expired. Please login again.');
        setTimeout(logout, 2000);
    }
}

// Auto-fill if remember me is checked
window.addEventListener('load', function() {
    if (window.location.pathname.includes('login.html')) {
        const rememberMe = localStorage.getItem('rememberMe');
        const user = getCurrentUser();
        
        if (rememberMe === 'true' && user) {
            const emailInput = document.getElementById('email');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (emailInput) emailInput.value = user.email;
            if (rememberCheckbox) rememberCheckbox.checked = true;
        }
    }
});

// Check session timeout every 5 minutes
setInterval(checkSessionTimeout, 5 * 60 * 1000);

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        login,
        register,
        logout,
        checkAuth,
        getCurrentUser,
        updateProfile,
        changePassword
    };
}