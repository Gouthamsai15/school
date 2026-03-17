import { getUser, logout, checkAuth } from './auth';
import { hasPermission, getProtectedHeaders, PermissionAction } from './permissions';

console.log('Dashboard script loaded');

function startDashboard() {
    console.log('Starting dashboard script');
    console.log('Current localStorage:', JSON.stringify(localStorage));
    
    // Check if we are logged in
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        console.warn('No user session found, redirecting to login');
        const dashboardContent = document.getElementById('dashboardContent');
        if (dashboardContent) {
            dashboardContent.innerHTML = `<div class="p-12 bg-white rounded-3xl text-center shadow-sm border border-slate-100">
                <h3 class="text-2xl font-bold mb-2 text-rose-600">Session Expired</h3>
                <p class="text-slate-500">Redirecting to login page...</p>
            </div>`;
        }
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1500);
        return;
    }

    let user;
    try {
        user = JSON.parse(userStr);
    } catch (e) {
        console.error('Failed to parse user session', e);
        window.location.href = '/login.html';
        return;
    }

    console.log('Authenticated user:', user);
    
    // UI Elements
    const sidebarNav = document.getElementById('sidebarNav');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const dashboardContent = document.getElementById('dashboardContent');
    const pageTitle = document.getElementById('pageTitle');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userNameDisplay) userNameDisplay.textContent = user.username;
    if (userRoleDisplay) userRoleDisplay.textContent = user.role;
    
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log('Logging out...');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        };
    }

    const roleMenus: Record<string, { name: string; icon: string }[]> = {
        "Admin": [
            { name: "Dashboard", icon: "📊" },
            { name: "Students", icon: "🎓" },
            { name: "Staff", icon: "👥" },
            { name: "HR", icon: "👔" },
            { name: "Accounts", icon: "💰" },
            { name: "Transport", icon: "🚌" },
            { name: "Admission", icon: "📝" }
        ],
        "Teaching Staff": [
            { name: "Dashboard", icon: "📊" },
            { name: "Students", icon: "🎓" },
            { name: "Attendance", icon: "📅" },
            { name: "Exams", icon: "📝" }
        ],
        "Student": [
            { name: "Dashboard", icon: "📊" },
            { name: "Attendance", icon: "📅" },
            { name: "Results", icon: "🏆" },
            { name: "Fees", icon: "💳" }
        ]
    };

    function renderSidebar() {
        if (!sidebarNav) return;
        sidebarNav.innerHTML = '';
        const menus = roleMenus[user.role] || [{ name: "Dashboard", icon: "📊" }];

        menus.forEach(item => {
            const link = document.createElement('a');
            link.href = '#';
            link.className = 'flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors font-medium group';
            link.innerHTML = `<span>${item.icon}</span><span>${item.name}</span>`;
            link.onclick = (e) => {
                e.preventDefault();
                renderPage(item.name);
            };
            sidebarNav.appendChild(link);
        });
    }

    function renderPage(name: string) {
        if (pageTitle) pageTitle.textContent = name;
        if (!dashboardContent) return;

        if (name === "Dashboard") {
            renderOverview();
        } else {
            dashboardContent.innerHTML = `<div class="p-12 bg-white rounded-3xl text-center shadow-sm border border-slate-100">
                <h3 class="text-2xl font-bold mb-2">${name} Module</h3>
                <p class="text-slate-500">This module is currently being optimized for the ${user.role} portal.</p>
            </div>`;
        }
    }

    function renderOverview() {
        if (!dashboardContent) return;
        dashboardContent.innerHTML = `
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div class="text-slate-500 text-sm font-medium mb-1">System Status</div>
                    <div class="text-2xl font-bold text-emerald-600 flex items-center gap-2">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Online
                    </div>
                </div>
                <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div class="text-slate-500 text-sm font-medium mb-1">Role Access</div>
                    <div class="text-2xl font-bold text-slate-900">${user.role}</div>
                </div>
            </div>
            <div class="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 class="text-xl font-bold mb-4 text-slate-900">Welcome back, ${user.username}!</h3>
                <p class="text-slate-600 leading-relaxed">
                    You have successfully authenticated into the INDDIA ERP system. 
                    Use the sidebar navigation to access your modules.
                </p>
            </div>
        `;
    }

    renderSidebar();
    renderPage("Dashboard");
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDashboard);
} else {
    startDashboard();
}
