export interface User {
    id: string;
    username: string;
    role: string;
    studentId?: string;
    staffId?: string;
}

export function getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
        return JSON.parse(userStr);
    } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        return null;
    }
}

export function logout() {
    localStorage.removeItem('user');
    window.location.href = '/login.html';
}

export function checkAuth() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '/login.html';
        return null;
    }
    return user;
}
