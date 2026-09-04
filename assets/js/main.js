// Global JavaScript for Online Quiz Platform

document.addEventListener('DOMContentLoaded', function () {
    // Password visibility toggle handler
    document.querySelectorAll('.toggle-password-btn').forEach(function (button) {
        button.addEventListener('click', function () {
            const targetId = this.getAttribute('data-target');
            const passwordInput = document.getElementById(targetId);
            if (passwordInput) {
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    this.textContent = 'Hide';
                } else {
                    passwordInput.type = 'password';
                    this.textContent = 'Show';
                }
            }
        });
    });
});
