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

    if (pageId === 'dashboard') {
        renderDashboardStats(role);
    } else if (pageId === 'students') {
        renderStudentsModule(role);
    } else if (pageId === 'staff') {
        renderStaffModule();
    } else if (pageId === 'hr') {
        renderHRModule();
    } else if (pageId === 'accounts') {
        renderAccountsModule();
    } else if (pageId === 'transport') {
        renderTransportModule();
    } else if (pageId === 'admission') {
        renderAdmissionModule();
    } else if (pageId === 'attendance') {
        renderAttendanceModule();
    } else if (pageId === 'exams') {
        renderExamsModule();
    } else {
        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center">
                <h3 class="text-2xl font-bold text-slate-900 mb-4">${pageLabel} Module</h3>
                <p class="text-slate-500">This section is currently being populated with ${role} specific data for ${pageLabel}.</p>
                <div class="mt-8 flex justify-center">
                    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            </div>
        `;
    }
}

async function renderDashboardStats(role: string) {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();

        const isTeacher = role === 'Teaching Staff';

        dashboardContent.innerHTML = `
            <div class="grid md:grid-cols-4 gap-6 mb-8">
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">${isTeacher ? 'My Students' : 'Total Students'}</div>
                    <div class="text-3xl font-bold text-slate-900">${isTeacher ? '42' : stats.totalStudents}</div>
                    <div class="text-emerald-500 text-xs font-medium mt-2">↑ 12% from last month</div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">${isTeacher ? 'Assigned Classes' : 'Total Staff'}</div>
                    <div class="text-3xl font-bold text-slate-900">${isTeacher ? '4' : stats.totalStaff}</div>
                    <div class="text-indigo-500 text-xs font-medium mt-2">Active now</div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">Fees Collected</div>
                    <div class="text-3xl font-bold text-slate-900">₹${stats.feesCollected}</div>
                    <div class="text-amber-500 text-xs font-medium mt-2">85% of target</div>
                </div>
                <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="text-slate-500 text-sm font-medium mb-1">Attendance</div>
                    <div class="text-3xl font-bold text-slate-900">${stats.attendanceRate}</div>
                    <div class="text-rose-500 text-xs font-medium mt-2">Today's average</div>
                </div>
            </div>

            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900">${isTeacher ? 'Teacher Overview' : 'Admin Overview'}</h3>
                    <button class="text-indigo-600 text-sm font-medium">Refresh Data</button>
                </div>
                <div class="p-12 text-center">
                    <div class="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        ${getIcon('LayoutDashboard')}
                    </div>
                    <h4 class="text-xl font-bold text-slate-900 mb-2">Welcome to INDDIA ERP ${role} Panel</h4>
                    <p class="text-slate-500 max-w-md mx-auto">
                        ${isTeacher ? 'Manage your assigned classes, mark attendance, and enter exam results efficiently.' : 'You have full control over the system. Manage students, staff, finances, and transport from this central hub.'}
                    </p>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Stats fetch error:', err);
    }
}

async function renderStudentsModule(role: string = 'Admin') {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/students');
        const students = await res.json();

        const isAdmin = role === 'Admin';

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900">Student Management</h3>
                    ${isAdmin ? `
                    <button onclick="window.addStudent()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        Add New Student
                    </button>
                    ` : ''}
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-4 font-semibold">Roll No</th>
                                <th class="px-6 py-4 font-semibold">Name</th>
                                <th class="px-6 py-4 font-semibold">Grade</th>
                                <th class="px-6 py-4 font-semibold">Section</th>
                                ${isAdmin ? '<th class="px-6 py-4 font-semibold">Actions</th>' : ''}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${students.map((s: any) => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 text-sm font-medium text-slate-900">${s.rollNo}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${s.name}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${s.grade}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${s.section}</td>
                                    ${isAdmin ? `
                                    <td class="px-6 py-4 text-sm flex gap-3">
                                        <button onclick="window.editStudent('${s.id}')" class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                        <button onclick="window.deleteStudent('${s.id}')" class="text-rose-600 hover:text-rose-800 font-medium">Delete</button>
                                    </td>
                                    ` : ''}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Students fetch error:', err);
    }
}

(window as any).addStudent = async () => {
    const name = prompt("Enter Student Name:");
    if (!name) return;
    const grade = prompt("Enter Grade (e.g. 10th):");
    const section = prompt("Enter Section (e.g. A):");
    const rollNo = prompt("Enter Roll No:");

    try {
        await fetch('/api/students', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, grade, section, rollNo })
        });
        renderStudentsModule();
    } catch (err) {
        console.error('Add student error:', err);
    }
};

(window as any).editStudent = async (id: string) => {
    const name = prompt("Update Student Name:");
    if (!name) return;
    const grade = prompt("Update Grade:");
    const section = prompt("Update Section:");
    const rollNo = prompt("Update Roll No:");

    try {
        await fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, grade, section, rollNo })
        });
        renderStudentsModule();
    } catch (err) {
        console.error('Edit student error:', err);
    }
};

(window as any).deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student?")) return;
    try {
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        renderStudentsModule();
    } catch (err) {
        console.error('Delete student error:', err);
    }
};

async function renderStaffModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/staff');
        const staff = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900">Staff Directory</h3>
                    <button onclick="window.addStaff()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        Add New Staff
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-4 font-semibold">Name</th>
                                <th class="px-6 py-4 font-semibold">Role</th>
                                <th class="px-6 py-4 font-semibold">Department/Subject</th>
                                <th class="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${staff.map((s: any) => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 text-sm font-medium text-slate-900">${s.name}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${s.role}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${s.subject || s.department || 'N/A'}</td>
                                    <td class="px-6 py-4 text-sm flex gap-3">
                                        <button onclick="window.editStaff('${s.id}')" class="text-indigo-600 hover:text-indigo-800 font-medium">Edit</button>
                                        <button onclick="window.deleteStaff('${s.id}')" class="text-rose-600 hover:text-rose-800 font-medium">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Staff fetch error:', err);
    }
}

(window as any).editStaff = async (id: string) => {
    const name = prompt("Update Staff Name:");
    if (!name) return;
    const role = prompt("Update Role:");
    const detail = prompt("Update Subject/Department:");

    try {
        await fetch(`/api/staff/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role, subject: detail, department: detail })
        });
        renderStaffModule();
    } catch (err) {
        console.error('Edit staff error:', err);
    }
};

(window as any).deleteStaff = async (id: string) => {
    if (!confirm("Delete this staff member?")) return;
    try {
        await fetch(`/api/staff/${id}`, { method: 'DELETE' });
        renderStaffModule();
    } catch (err) {
        console.error('Delete staff error:', err);
    }
};

(window as any).addStaff = async () => {
    const name = prompt("Enter Staff Name:");
    if (!name) return;
    const role = prompt("Enter Role (Teaching/Non-Teaching):");
    const detail = prompt("Enter Subject or Department:");

    try {
        await fetch('/api/staff', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, role, subject: detail, department: detail })
        });
        renderStaffModule();
    } catch (err) {
        console.error('Add staff error:', err);
    }
};

async function renderHRModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/staff');
        const staff = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 mb-6">HR - Employee List</h3>
                <div class="grid gap-4">
                    ${staff.map((s: any) => `
                        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div class="flex items-center gap-4">
                                <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                                    ${s.name.charAt(0)}
                                </div>
                                <div>
                                    <div class="font-bold text-slate-900">${s.name}</div>
                                    <div class="text-xs text-slate-500">${s.role}</div>
                                </div>
                            </div>
                            <button class="text-indigo-600 text-sm font-medium hover:underline">View Profile</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error('HR fetch error:', err);
    }
}

async function renderAccountsModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/fees');
        const fees = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900">Accounts - Fee Transactions</h3>
                    <button onclick="window.addFee()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        Add Transaction
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-4 font-semibold">Student ID</th>
                                <th class="px-6 py-4 font-semibold">Amount</th>
                                <th class="px-6 py-4 font-semibold">Status</th>
                                <th class="px-6 py-4 font-semibold">Date</th>
                                <th class="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${fees.map((f: any) => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 text-sm text-slate-600">#STU-${f.studentId}</td>
                                    <td class="px-6 py-4 text-sm font-bold text-slate-900">₹${f.amount}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                            ${f.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-500">${f.date}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <button onclick="window.deleteFee('${f.id}')" class="text-rose-600 hover:text-rose-800 font-medium">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Accounts fetch error:', err);
    }
}

(window as any).addFee = async () => {
    const studentId = prompt("Enter Student ID:");
    const amount = prompt("Enter Amount:");
    const status = prompt("Status (Paid/Pending):");
    const date = new Date().toISOString().split('T')[0];

    try {
        await fetch('/api/fees', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, amount: Number(amount), status, date })
        });
        renderAccountsModule();
    } catch (err) {
        console.error('Add fee error:', err);
    }
};

(window as any).deleteFee = async (id: string) => {
    if (!confirm("Delete transaction?")) return;
    try {
        await fetch(`/api/fees/${id}`, { method: 'DELETE' });
        renderAccountsModule();
    } catch (err) {
        console.error('Delete fee error:', err);
    }
};

async function renderTransportModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/transport');
        const transport = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-900">Transport - Vehicle List</h3>
                    <button onclick="window.addVehicle()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        Add Vehicle
                    </button>
                </div>
                <div class="grid md:grid-cols-2 gap-6">
                    ${transport.map((v: any) => `
                        <div class="p-6 bg-slate-50 rounded-3xl border border-slate-100 relative">
                            <button onclick="window.deleteVehicle('${v.id}')" class="absolute top-4 right-4 text-rose-600 hover:text-rose-800">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                            <div class="flex justify-between items-start mb-4">
                                <div class="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                    ${getIcon('Bus')}
                                </div>
                                <span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-bold uppercase">Active</span>
                            </div>
                            <div class="text-lg font-bold text-slate-900 mb-1">${v.vehicleNo}</div>
                            <div class="text-sm text-slate-500 mb-4">${v.route}</div>
                            <div class="flex items-center gap-2 text-xs text-slate-600">
                                <span class="font-bold">Driver:</span> ${v.driver}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Transport fetch error:', err);
    }
}

(window as any).addVehicle = async () => {
    const vehicleNo = prompt("Enter Vehicle No:");
    const route = prompt("Enter Route:");
    const driver = prompt("Enter Driver Name:");

    try {
        await fetch('/api/transport', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicleNo, route, driver })
        });
        renderTransportModule();
    } catch (err) {
        console.error('Add vehicle error:', err);
    }
};

(window as any).deleteVehicle = async (id: string) => {
    if (!confirm("Delete vehicle?")) return;
    try {
        await fetch(`/api/transport/${id}`, { method: 'DELETE' });
        renderTransportModule();
    } catch (err) {
        console.error('Delete vehicle error:', err);
    }
};

async function renderAdmissionModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/admissions');
        const admissions = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                    <h3 class="font-bold text-slate-900">Admission - Applicant List</h3>
                    <button onclick="window.addAdmission()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        New Admission
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-4 font-semibold">Applicant Name</th>
                                <th class="px-6 py-4 font-semibold">Grade Applied</th>
                                <th class="px-6 py-4 font-semibold">Status</th>
                                <th class="px-6 py-4 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${admissions.map((a: any) => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 text-sm font-medium text-slate-900">${a.applicantName}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${a.grade}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                            ${a.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm flex gap-3">
                                        <button onclick="window.updateAdmissionStatus('${a.id}', 'Approved')" class="text-emerald-600 hover:underline">Approve</button>
                                        <button onclick="window.deleteAdmission('${a.id}')" class="text-rose-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Admission fetch error:', err);
    }
}

(window as any).addAdmission = async () => {
    const applicantName = prompt("Enter Applicant Name:");
    const grade = prompt("Enter Grade:");

    try {
        await fetch('/api/admissions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ applicantName, grade, status: 'Pending' })
        });
        renderAdmissionModule();
    } catch (err) {
        console.error('Add admission error:', err);
    }
};

(window as any).updateAdmissionStatus = async (id: string, status: string) => {
    try {
        await fetch(`/api/admissions/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        renderAdmissionModule();
    } catch (err) {
        console.error('Update admission error:', err);
    }
};

(window as any).deleteAdmission = async (id: string) => {
    if (!confirm("Delete admission?")) return;
    try {
        await fetch(`/api/admissions/${id}`, { method: 'DELETE' });
        renderAdmissionModule();
    } catch (err) {
        console.error('Delete admission error:', err);
    }
};

async function renderAttendanceModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const today = new Date().toISOString().split('T')[0];
    let selectedDate = today;

    const loadAttendance = async (date: string) => {
        try {
            const [studentsRes, attendanceRes] = await Promise.all([
                fetch('/api/students'),
                fetch(`/api/attendance?date=${date}`)
            ]);
            const students = await studentsRes.json();
            const attendance = await attendanceRes.json();

            const attendanceMap = new Map(attendance.map((a: any) => [a.studentId, a.status]));

            const listContainer = document.getElementById('attendanceList');
            if (listContainer) {
                listContainer.innerHTML = students.map((s: any) => {
                    const status = attendanceMap.get(s.id) || 'Not Marked';
                    return `
                        <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div class="flex items-center gap-4">
                                <div class="text-sm font-bold text-slate-900">${s.rollNo}</div>
                                <div class="text-sm font-medium text-slate-700">${s.name}</div>
                            </div>
                            <div class="flex items-center gap-4">
                                <span class="text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${status === 'Present' ? 'bg-emerald-100 text-emerald-700' : status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}">
                                    ${status}
                                </span>
                                <div class="flex gap-2">
                                    <button onclick="window.markAttendance('${s.id}', 'Present', '${date}')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all">P</button>
                                    <button onclick="window.markAttendance('${s.id}', 'Absent', '${date}')" class="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-all">A</button>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('');
            }
        } catch (err) {
            console.error('Load attendance error:', err);
        }
    };

    dashboardContent.innerHTML = `
        <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="p-6 border-b border-slate-50 flex justify-between items-center">
                <h3 class="font-bold text-slate-900">Attendance Management</h3>
                <div class="flex items-center gap-3">
                    <label class="text-xs font-bold text-slate-500">Select Date:</label>
                    <input type="date" id="attendanceDatePicker" value="${today}" class="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                </div>
            </div>
            <div class="p-6">
                <div id="attendanceList" class="grid gap-4">
                    <!-- Loaded dynamically -->
                    <div class="text-center py-12 text-slate-400">Loading students...</div>
                </div>
                <button onclick="alert('Attendance for ' + document.getElementById('attendanceDatePicker').value + ' has been finalized.')" class="mt-8 w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg">
                    Finalize Attendance
                </button>
            </div>
        </div>
    `;

    const datePicker = document.getElementById('attendanceDatePicker') as HTMLInputElement;
    datePicker.addEventListener('change', (e) => {
        selectedDate = (e.target as HTMLInputElement).value;
        loadAttendance(selectedDate);
    });

    loadAttendance(selectedDate);
}

(window as any).markAttendance = async (studentId: string, status: string, date: string) => {
    try {
        await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, status, date })
        });
        // Refresh the list
        const datePicker = document.getElementById('attendanceDatePicker') as HTMLInputElement;
        if (datePicker) {
            const currentFunc = (window as any).refreshAttendance;
            if (typeof currentFunc === 'function') currentFunc(datePicker.value);
        }
    } catch (err) {
        console.error('Mark attendance error:', err);
    }
};

// Helper to refresh attendance list without full re-render
(window as any).refreshAttendance = async (date: string) => {
    const studentsRes = await fetch('/api/students');
    const attendanceRes = await fetch(`/api/attendance?date=${date}`);
    const students = await studentsRes.json();
    const attendance = await attendanceRes.json();
    const attendanceMap = new Map(attendance.map((a: any) => [a.studentId, a.status]));

    const listContainer = document.getElementById('attendanceList');
    if (listContainer) {
        listContainer.innerHTML = students.map((s: any) => {
            const status = attendanceMap.get(s.id) || 'Not Marked';
            return `
                <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div class="flex items-center gap-4">
                        <div class="text-sm font-bold text-slate-900">${s.rollNo}</div>
                        <div class="text-sm font-medium text-slate-700">${s.name}</div>
                    </div>
                    <div class="flex items-center gap-4">
                        <span class="text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${status === 'Present' ? 'bg-emerald-100 text-emerald-700' : status === 'Absent' ? 'bg-rose-100 text-rose-700' : 'bg-slate-200 text-slate-600'}">
                            ${status}
                        </span>
                        <div class="flex gap-2">
                            <button onclick="window.markAttendance('${s.id}', 'Present', '${date}')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all">P</button>
                            <button onclick="window.markAttendance('${s.id}', 'Absent', '${date}')" class="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-all">A</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }
};

async function renderExamsModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/students');
        const students = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50">
                    <h3 class="font-bold text-slate-900">Enter Exam Marks</h3>
                </div>
                <div class="p-6">
                    <div class="mb-6">
                        <label class="block text-sm font-semibold text-slate-700 mb-2">Select Exam</label>
                        <select id="examType" class="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500">
                            <option>Mid-Term Exam</option>
                            <option>Final Exam</option>
                            <option>Unit Test 1</option>
                        </select>
                    </div>
                    <div class="grid gap-4">
                        ${students.map((s: any) => `
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div class="flex items-center gap-4">
                                    <div class="text-sm font-bold text-slate-900">${s.rollNo}</div>
                                    <div class="text-sm font-medium text-slate-700">${s.name}</div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <input type="number" id="marks-${s.id}" placeholder="Marks" class="w-24 px-3 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500 text-sm">
                                    <button onclick="window.saveMarks('${s.id}')" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all">Save</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Exams fetch error:', err);
    }
}

(window as any).saveMarks = async (studentId: string) => {
    const marksInput = document.getElementById(`marks-${studentId}`) as HTMLInputElement;
    const examType = (document.getElementById('examType') as HTMLSelectElement).value;
    const marks = marksInput?.value;

    if (!marks) {
        alert("Please enter marks");
        return;
    }

    try {
        await fetch('/api/exams', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, examType, marks })
        });
        alert(`Marks saved for student ${studentId}`);
    } catch (err) {
        console.error('Save marks error:', err);
    }
};

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
