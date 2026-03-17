import { getCurrentUser, logout } from './auth';

console.log('Dashboard script loaded');

interface SidebarItem {
    label: string;
    icon: string;
    id: string;
}

const ROLE_SIDEBAR_CONFIG: Record<string, SidebarItem[]> = {
    'Admin': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Students', icon: 'Users', id: 'students' },
        { label: 'Staff', icon: 'UserSquare2', id: 'staff' },
        { label: 'HR', icon: 'Briefcase', id: 'hr' },
        { label: 'Accounts', icon: 'Wallet', id: 'accounts' },
        { label: 'Transport', icon: 'Bus', id: 'transport' },
        { label: 'Admission', icon: 'UserPlus', id: 'admission' },
    ],
    'Teaching Staff': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Students', icon: 'Users', id: 'students' },
        { label: 'Attendance', icon: 'CalendarCheck', id: 'attendance' },
        { label: 'Exams', icon: 'FileText', id: 'exams' },
    ],
    'Non-Teaching Staff': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Tasks', icon: 'CheckSquare', id: 'tasks' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
    ],
    'Student': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Attendance', icon: 'CalendarCheck', id: 'attendance' },
        { label: 'Results', icon: 'GraduationCap', id: 'results' },
        { label: 'Fees', icon: 'CreditCard', id: 'fees' },
    ],
    'Parent': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Child Info', icon: 'Baby', id: 'child-info' },
        { label: 'Attendance', icon: 'CalendarCheck', id: 'attendance' },
        { label: 'Results', icon: 'GraduationCap', id: 'results' },
    ],
    'HR': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Employees', icon: 'Users', id: 'employees' },
        { label: 'Leaves', icon: 'CalendarOff', id: 'leaves' },
    ],
    'Accounts': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Fees', icon: 'CreditCard', id: 'fees' },
        { label: 'Salary', icon: 'Banknote', id: 'salary' },
    ],
    'Transport': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Vehicles', icon: 'Bus', id: 'vehicles' },
        { label: 'Routes', icon: 'Map', id: 'routes' },
    ],
    'Admission': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'New Admissions', icon: 'UserPlus', id: 'new-admissions' },
    ],
    'Guest': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
    ]
};

function getIcon(name: string) {
    const icons: Record<string, string> = {
        'LayoutDashboard': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>',
        'Users': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>',
        'UserSquare2': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>',
        'Briefcase': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>',
        'Wallet': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>',
        'Bus': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>',
        'UserPlus': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>',
        'CalendarCheck': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
        'FileText': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>',
        'CheckSquare': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>',
        'BarChart3': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>',
        'GraduationCap': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>',
        'CreditCard': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>',
        'Baby': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        'CalendarOff': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        'Banknote': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
        'Map': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>',
    };
    return icons[name] || icons['LayoutDashboard'];
}

function renderSidebar(role: string) {
    const sidebarNav = document.getElementById('sidebarNav');
    if (!sidebarNav) return;

    const items = ROLE_SIDEBAR_CONFIG[role] || ROLE_SIDEBAR_CONFIG['Guest'];
    
    sidebarNav.innerHTML = items.map(item => `
        <button class="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-all group" onclick="window.handleSidebarClick('${item.id}', '${item.label}')">
            <span class="text-slate-400 group-hover:text-indigo-600 transition-colors">
                ${getIcon(item.icon)}
            </span>
            <span class="font-medium">${item.label}</span>
        </button>
    `).join('');
}

function renderContent(role: string, pageId: string = 'dashboard', pageLabel: string = 'Dashboard') {
    const dashboardContent = document.getElementById('dashboardContent');
    const pageTitle = document.getElementById('pageTitle');
    if (!dashboardContent || !pageTitle) return;

    pageTitle.textContent = pageLabel;

    let html = '';
    
    if (pageId === 'dashboard') {
        html = `
            <div class="grid md:grid-cols-3 gap-6 mb-8">
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">Status</div>
                    <div class="text-2xl font-bold text-slate-900">Active Session</div>
                    <div class="text-emerald-500 text-xs font-medium mt-2 flex items-center gap-1">
                        <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        Connected as ${role}
                    </div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">Notifications</div>
                    <div class="text-2xl font-bold text-slate-900">3 New Alerts</div>
                    <div class="text-indigo-500 text-xs font-medium mt-2">View all notifications</div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">Quick Action</div>
                    <div class="text-2xl font-bold text-slate-900">Generate Report</div>
                    <div class="text-slate-400 text-xs font-medium mt-2 italic">Last run 2h ago</div>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900">Role Specific Overview: ${role}</h3>
                    <button class="text-indigo-600 text-sm font-medium">Refresh</button>
                </div>
                <div class="p-12 text-center">
                    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        ${getIcon('LayoutDashboard')}
                    </div>
                    <h4 class="text-xl font-bold text-slate-900 mb-2">Welcome to your ${role} Portal</h4>
                    <p class="text-slate-500 max-w-md mx-auto">
                        This dashboard is dynamically tailored for your role. Use the sidebar to navigate through your specific modules.
                    </p>
                </div>
            </div>
        `;
    } else {
        html = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                <h3 class="text-2xl font-bold text-slate-900 mb-4">${pageLabel} Module</h3>
                <p class="text-slate-500">This section is currently being populated with ${role} specific data for ${pageLabel}.</p>
                <div class="mt-8 flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        `;
    }

    dashboardContent.innerHTML = html;
}

function startDashboard() {
    console.log('Starting dashboard script');
    
    const user = getCurrentUser();
    if (!user) {
        console.warn('No user session found, redirecting to login');
        window.location.href = '/login.html';
        return;
    }

    console.log('Authenticated user:', user);
    
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userRoleDisplay = document.getElementById('userRoleDisplay');
    const logoutBtn = document.getElementById('logoutBtn');

    if (userNameDisplay) userNameDisplay.textContent = user.username;
    if (userRoleDisplay) userRoleDisplay.textContent = user.role;
    
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            console.log('Logging out...');
            logout();
        };
    }

    (window as any).handleSidebarClick = (pageId: string, pageLabel: string) => {
        console.log('Sidebar clicked:', pageId);
        renderContent(user.role, pageId, pageLabel);
    };

    renderSidebar(user.role);
    renderContent(user.role);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startDashboard);
} else {
    startDashboard();
}
