console.log('Login script loaded');

function startLogin() {
    console.log('Starting login script');
    const loginForm = document.getElementById('loginForm') as HTMLFormElement;
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement;
    const loginStatus = document.getElementById('loginStatus');

    if (loginStatus) loginStatus.textContent = 'System Ready';

    if (loginForm) {
        console.log('Login form found, attaching listener');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Form submit event triggered');
            
            if (loginStatus) loginStatus.textContent = 'Authenticating...';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Signing In...';
            }
            
            const username = (document.getElementById('username') as HTMLInputElement).value;
            const password = (document.getElementById('password') as HTMLInputElement).value;
            const role = (document.getElementById('role') as HTMLSelectElement).value;

            console.log(`Attempting login: ${username}, role: ${role}`);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password, role })
                });

                const data = await response.json();
                console.log('Login API Response:', data);

                if (data.success) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    console.log('User session saved:', localStorage.getItem('user'));
                    
                    if (loginStatus) loginStatus.textContent = 'Login Successful! Redirecting...';
                    if (submitBtn) {
                        submitBtn.textContent = 'Redirecting...';
                        submitBtn.className = 'w-full bg-emerald-600 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg';
                    }

                    // Direct redirection
                    setTimeout(() => {
                        console.log('Navigating to /dashboard.html');
                        window.location.href = '/dashboard.html';
                        
                        // Show manual link after 2 seconds if still on this page
                        setTimeout(() => {
                            const manual = document.getElementById('manualRedirect');
                            if (manual) manual.classList.remove('hidden');
                        }, 2000);
                    }, 300);
                } else {
                    if (loginStatus) loginStatus.textContent = 'Login Failed';
                    alert(data.message || 'Login failed');
                    if (submitBtn) {
                        submitBtn.disabled = false;
                        submitBtn.textContent = 'Sign In';
                    }
                }
            } catch (err) {
                console.error('Login Fetch Error:', err);
                if (loginStatus) loginStatus.textContent = 'Connection Error';
                alert('Connection error. Please try again.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Sign In';
                }
            }
        });
    } else {
        console.error('CRITICAL: Login form NOT found in DOM!');
        if (loginStatus) loginStatus.textContent = 'Error: Form not found';
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startLogin);
} else {
    startLogin();
}
