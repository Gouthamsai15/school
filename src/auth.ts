export interface User {
    username: string;
    role: string;
}

export function getUser(): User | null {
    const userStr = localStorage.getItem('user');
    console.log('Getting user from localStorage:', userStr);
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Error parsing user from localStorage', e);
        return null;
    }
}

export function isAuthenticated(): boolean {
    const isAuth = getUser() !== null;
    console.log('Is authenticated:', isAuth);
    return isAuth;
}

export function logout(): void {
    console.log('Logging out');
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

export function checkAuth(): void {
    console.log('Checking auth...');
    if (!isAuthenticated()) {
        console.warn('Not authenticated, redirecting to login');
        window.location.href = '/login.html';
    } else {
        console.log('Auth check passed');
    }
}
