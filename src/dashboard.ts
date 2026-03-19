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
        { label: 'Classes', icon: 'School', id: 'classes' },
        { label: 'Subjects', icon: 'BookOpen', id: 'subjects' },
        { label: 'Academic Mapping', icon: 'GitMerge', id: 'academic-mapping' },
        { label: 'Timetable', icon: 'Calendar', id: 'timetable' },
        { label: 'HR', icon: 'Briefcase', id: 'hr' },
        { label: 'Accounts', icon: 'Wallet', id: 'accounts' },
        { label: 'Transport', icon: 'Bus', id: 'transport' },
        { label: 'Admission', icon: 'UserPlus', id: 'admission' },
        { label: 'Documents', icon: 'Files', id: 'documents' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
        { label: 'Settings', icon: 'Settings', id: 'settings' },
    ],
    'Teaching Staff': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Assigned Academic', icon: 'BookOpen', id: 'assigned-academic' },
        { label: 'Students', icon: 'Users', id: 'students' },
        { label: 'Timetable', icon: 'Calendar', id: 'timetable' },
        { label: 'Attendance', icon: 'CalendarCheck', id: 'attendance' },
        { label: 'Exams', icon: 'FileText', id: 'exams' },
        { label: 'Documents', icon: 'Files', id: 'documents' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
    ],
    'Non-Teaching Staff': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Tasks', icon: 'CheckSquare', id: 'tasks' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
    ],
    'Student': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'My Subjects', icon: 'BookOpen', id: 'my-subjects' },
        { label: 'Timetable', icon: 'Calendar', id: 'timetable' },
        { label: 'Attendance', icon: 'CalendarCheck', id: 'attendance' },
        { label: 'Results', icon: 'GraduationCap', id: 'results' },
        { label: 'Fees', icon: 'CreditCard', id: 'fees' },
        { label: 'Documents', icon: 'Files', id: 'documents' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
    ],
    'Parent': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Child Info', icon: 'Baby', id: 'child-info' },
        { label: 'Academic Info', icon: 'BookOpen', id: 'academic-info' },
        { label: 'Timetable', icon: 'Calendar', id: 'timetable' },
        { label: 'Attendance', icon: 'CalendarCheck', id: 'attendance' },
        { label: 'Results', icon: 'GraduationCap', id: 'results' },
        { label: 'Documents', icon: 'Files', id: 'documents' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
    ],
    'HR': [
        { label: 'Dashboard', icon: 'LayoutDashboard', id: 'dashboard' },
        { label: 'Employees', icon: 'Users', id: 'employees' },
        { label: 'Leaves', icon: 'CalendarOff', id: 'leaves' },
        { label: 'Documents', icon: 'Files', id: 'documents' },
        { label: 'Reports', icon: 'BarChart3', id: 'reports' },
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
        'BarChart3': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 20V10M12 20V4M6 20v-6"></path></svg>',
        'GraduationCap': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>',
        'CreditCard': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>',
        'Baby': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        'CalendarOff': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>',
        'Calendar': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>',
        'School': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>',
        'BookOpen': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>',
        'GitMerge': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 18V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2zM9 9l3 3-3 3"></path></svg>',
        'Banknote': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>',
        'Map': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>',
        'Files': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>',
        'Settings': '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>',
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
    } else if (pageId === 'staff' || pageId === 'employees') {
        renderStaffModule();
    } else if (pageId === 'hr') {
        renderHRModule();
    } else if (pageId === 'leaves') {
        renderLeavesModule();
    } else if (pageId === 'tasks') {
        renderTasksModule();
    } else if (pageId === 'accounts') {
        renderAccountsModule();
    } else if (pageId === 'transport') {
        renderTransportModule();
    } else if (pageId === 'admission') {
        renderAdmissionModule();
    } else if (pageId === 'attendance') {
        if (role === 'Student') renderStudentAttendance();
        else if (role === 'Parent') renderParentAttendance();
        else renderAttendanceModule();
    } else if (pageId === 'exams') {
        renderExamsModule();
    } else if (pageId === 'classes') {
        renderClassesModule();
    } else if (pageId === 'subjects') {
        renderSubjectsModule();
    } else if (pageId === 'academic-mapping') {
        renderAcademicMappingModule();
    } else if (pageId === 'assigned-academic') {
        renderAssignedAcademicModule();
    } else if (pageId === 'my-subjects') {
        renderMySubjectsModule();
    } else if (pageId === 'academic-info') {
        renderAcademicInfoModule();
    } else if (pageId === 'documents') {
        renderDocumentsModule(role);
    } else if (pageId === 'reports') {
        renderReportsModule(role);
    } else if (pageId === 'settings') {
        renderSettingsModule(role);
    } else if (pageId === 'timetable') {
        renderTimetableModule(role);
    } else if (pageId === 'results') {
        if (role === 'Student') renderStudentResults();
        else if (role === 'Parent') renderParentResults();
    } else if (pageId === 'fees') {
        if (role === 'Student') renderStudentFees();
        else renderAccountsModule();
    } else if (pageId === 'child-info') {
        renderParentChildInfo();
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

    const user = getCurrentUser();
    if (!user) return;

    try {
        const res = await fetch('/api/stats');
        const stats = await res.json();

        const isTeacher = role === 'Teaching Staff';
        const isStudent = role === 'Student';
        const isParent = role === 'Parent';
        const isHR = role === 'HR';
        const isNonTeaching = role === 'Non-Teaching Staff';

        if (isStudent || isParent) {
            const studentId = user.studentId;
            const studentRes = await fetch(`/api/students?id=${studentId}`);
            const studentData = await studentRes.json();
            const student = studentData[0];

            dashboardContent.innerHTML = `
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Attendance Rate</div>
                        <div class="text-3xl font-bold text-slate-900">92%</div>
                        <div class="text-emerald-500 text-xs font-medium mt-2">Good standing</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Last Exam Grade</div>
                        <div class="text-3xl font-bold text-slate-900">A</div>
                        <div class="text-indigo-500 text-xs font-medium mt-2">Top 10% of class</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Fee Status</div>
                        <div class="text-3xl font-bold text-slate-900">Paid</div>
                        <div class="text-emerald-500 text-xs font-medium mt-2">No dues</div>
                    </div>
                </div>

                <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
                    <div class="flex items-center gap-6 mb-8">
                        <div class="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl font-bold">
                            ${student?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                            <h3 class="text-2xl font-bold text-slate-900">${student?.name || 'Student'}</h3>
                            <p class="text-slate-500">Grade: ${student?.grade || 'N/A'} | Section: ${student?.section || 'N/A'} | Roll No: ${student?.rollNo || 'N/A'}</p>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-8">
                        <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 class="font-bold text-slate-900 mb-4">Upcoming Schedule</h4>
                            <ul class="space-y-3">
                                <li class="flex justify-between text-sm">
                                    <span class="text-slate-600">Mathematics</span>
                                    <span class="font-medium">09:00 AM</span>
                                </li>
                                <li class="flex justify-between text-sm">
                                    <span class="text-slate-600">Physics</span>
                                    <span class="font-medium">10:30 AM</span>
                                </li>
                                <li class="flex justify-between text-sm">
                                    <span class="text-slate-600">English</span>
                                    <span class="font-medium">12:00 PM</span>
                                </li>
                            </ul>
                        </div>
                        <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <h4 class="font-bold text-slate-900 mb-4">Recent Notifications</h4>
                            <ul class="space-y-3">
                                <li class="text-sm text-slate-600">
                                    <span class="font-bold text-indigo-600">•</span> Mid-term results are out.
                                </li>
                                <li class="text-sm text-slate-600">
                                    <span class="font-bold text-indigo-600">•</span> School picnic scheduled for next Friday.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        if (isHR) {
            dashboardContent.innerHTML = `
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Total Employees</div>
                        <div class="text-3xl font-bold text-slate-900">${stats.totalStaff}</div>
                        <div class="text-emerald-500 text-xs font-medium mt-2">Active Staff</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Pending Leaves</div>
                        <div class="text-3xl font-bold text-slate-900">3</div>
                        <div class="text-amber-500 text-xs font-medium mt-2">Requires attention</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">New Hires (Month)</div>
                        <div class="text-3xl font-bold text-slate-900">2</div>
                        <div class="text-indigo-500 text-xs font-medium mt-2">Onboarding in progress</div>
                    </div>
                </div>
                <div class="bg-indigo-600 rounded-3xl p-8 text-white">
                    <h3 class="text-2xl font-bold mb-2">Welcome to HR Portal</h3>
                    <p class="text-indigo-100 opacity-90">Manage employee records, track leave requests, and oversee staff performance from this central dashboard.</p>
                </div>
            `;
            return;
        }

        if (isNonTeaching) {
            dashboardContent.innerHTML = `
                <div class="grid md:grid-cols-3 gap-6 mb-8">
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">My Pending Tasks</div>
                        <div class="text-3xl font-bold text-slate-900">4</div>
                        <div class="text-amber-500 text-xs font-medium mt-2">Due this week</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Completed Tasks</div>
                        <div class="text-3xl font-bold text-slate-900">12</div>
                        <div class="text-emerald-500 text-xs font-medium mt-2">This month</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-1">Performance Score</div>
                        <div class="text-3xl font-bold text-slate-900">95%</div>
                        <div class="text-indigo-500 text-xs font-medium mt-2">Excellent</div>
                    </div>
                </div>
                <div class="bg-slate-900 rounded-3xl p-8 text-white">
                    <h3 class="text-2xl font-bold mb-2">Non-Teaching Staff Portal</h3>
                    <p class="text-slate-400">Track your assigned tasks, submit reports, and manage your daily operations efficiently.</p>
                </div>
            `;
            return;
        }

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

async function renderLeavesModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/leaves');
        const leaves = await res.json();
        const staffRes = await fetch('/api/staff');
        const staff = await staffRes.json();
        const staffMap = new Map(staff.map((s: any) => [s.id, s.name]));

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50">
                    <h3 class="font-bold text-slate-900">Leave Requests</h3>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                            <tr>
                                <th class="px-6 py-4 font-semibold">Employee</th>
                                <th class="px-6 py-4 font-semibold">Duration</th>
                                <th class="px-6 py-4 font-semibold">Reason</th>
                                <th class="px-6 py-4 font-semibold">Status</th>
                                <th class="px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${leaves.map((l: any) => `
                                <tr class="hover:bg-slate-50 transition-colors">
                                    <td class="px-6 py-4 text-sm font-medium text-slate-900">${staffMap.get(l.staffId) || 'Unknown'}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${l.startDate} to ${l.endDate}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${l.reason}</td>
                                    <td class="px-6 py-4 text-sm">
                                        <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                            l.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 
                                            l.status === 'Rejected' ? 'bg-rose-100 text-rose-700' : 
                                            'bg-amber-100 text-amber-700'
                                        }">
                                            ${l.status}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-right">
                                        ${l.status === 'Pending' ? `
                                            <button onclick="window.updateLeaveStatus('${l.id}', 'Approved')" class="text-emerald-600 hover:text-emerald-800 font-bold mr-3">Approve</button>
                                            <button onclick="window.updateLeaveStatus('${l.id}', 'Rejected')" class="text-rose-600 hover:text-rose-800 font-bold">Reject</button>
                                        ` : '<span class="text-slate-400 italic">Processed</span>'}
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Leaves fetch error:', err);
    }
}

(window as any).updateLeaveStatus = async (id: string, status: string) => {
    try {
        await fetch(`/api/leaves/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        renderLeavesModule();
    } catch (err) {
        console.error('Update leave status error:', err);
    }
};

async function renderTasksModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        // If non-teaching staff, show only their tasks. If admin/HR, show all?
        // Let's assume non-teaching staff has staffId in their user object.
        const url = user.staffId ? `/api/tasks?staffId=${user.staffId}` : '/api/tasks';
        const res = await fetch(url);
        const tasks = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-900">My Tasks</h3>
                    ${user.role === 'Admin' || user.role === 'HR' ? `
                        <button onclick="window.addTask()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                            Assign Task
                        </button>
                    ` : ''}
                </div>
                <div class="grid gap-4">
                    ${tasks.map((t: any) => `
                        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-start">
                            <div>
                                <div class="font-bold text-slate-900">${t.title}</div>
                                <div class="text-sm text-slate-500 mb-2">${t.description}</div>
                                <div class="text-xs text-slate-400">Due: ${t.dueDate}</div>
                            </div>
                            <div class="flex flex-col items-end gap-2">
                                <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase ${t.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                    ${t.status}
                                </span>
                                ${t.status === 'Pending' ? `
                                    <button onclick="window.updateTaskStatus('${t.id}', 'Completed')" class="text-indigo-600 text-xs font-bold hover:underline">Mark Complete</button>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Tasks fetch error:', err);
    }
}

(window as any).updateTaskStatus = async (id: string, status: string) => {
    try {
        await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        renderTasksModule();
    } catch (err) {
        console.error('Update task status error:', err);
    }
};

(window as any).addTask = async () => {
    const title = prompt("Task Title:");
    if (!title) return;
    const description = prompt("Description:");
    const staffId = prompt("Staff ID:");
    const dueDate = prompt("Due Date (YYYY-MM-DD):");

    try {
        await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description, staffId, dueDate })
        });
        renderTasksModule();
    } catch (err) {
        console.error('Add task error:', err);
    }
};

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
    let selectedSubject = 'Mathematics';
    let selectedTime = '09:00 AM';

    const loadAttendance = async (date: string, subject: string) => {
        try {
            const [studentsRes, attendanceRes] = await Promise.all([
                fetch('/api/students'),
                fetch(`/api/attendance?date=${date}&subject=${subject}`)
            ]);
            const students = await studentsRes.json();
            const attendance = await attendanceRes.json();

            const attendanceMap = new Map(attendance.map((a: any) => [a.studentId, a.status]));

            const listContainer = document.getElementById('attendanceList');
            if (listContainer) {
                if (students.length === 0) {
                    listContainer.innerHTML = '<div class="text-center py-12 text-slate-400">No students found.</div>';
                    return;
                }

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
                                    <button onclick="window.markAttendance('${s.id}', 'Present', '${date}', '${subject}', '${selectedTime}')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all">P</button>
                                    <button onclick="window.markAttendance('${s.id}', 'Absent', '${date}', '${subject}', '${selectedTime}')" class="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-all">A</button>
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

    const loadRecentLogs = async () => {
        try {
            const res = await fetch('/api/attendance');
            const allAttendance = await res.json();
            allAttendance.sort((a: any, b: any) => b.date.localeCompare(a.date));
            
            const logsContainer = document.getElementById('recentAttendanceLogs');
            if (logsContainer) {
                const recent = allAttendance.slice(0, 30);
                if (recent.length === 0) {
                    logsContainer.innerHTML = '<div class="text-center py-4 text-slate-400 text-sm">No recent logs.</div>';
                    return;
                }

                const grouped: any = {};
                recent.forEach((curr: any) => {
                    const key = `${curr.date} - ${curr.subject}`;
                    if (!grouped[key]) grouped[key] = { date: curr.date, subject: curr.subject, count: 0 };
                    grouped[key].count++;
                });

                logsContainer.innerHTML = Object.values(grouped).map((g: any) => `
                    <div class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                        <div>
                            <div class="text-sm font-bold text-slate-900">${g.subject}</div>
                            <div class="text-xs text-slate-500">${g.date}</div>
                        </div>
                        <div class="text-xs font-medium text-indigo-600">${g.count} Students</div>
                    </div>
                `).join('');
            }
        } catch (err) {
            console.error('Load logs error:', err);
        }
    };

    dashboardContent.innerHTML = `
        <div class="grid lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2 space-y-8">
                <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div class="p-6 border-b border-slate-50">
                        <h3 class="font-bold text-slate-900 mb-4">Mark Attendance</h3>
                        <div class="grid md:grid-cols-3 gap-4">
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-bold text-slate-500">Select Date:</label>
                                <input type="date" id="attendanceDatePicker" value="${today}" class="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full">
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-bold text-slate-500">Select Subject:</label>
                                <select id="attendanceSubjectPicker" class="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full">
                                    <option value="Mathematics">Mathematics</option>
                                    <option value="Physics">Physics</option>
                                    <option value="Chemistry">Chemistry</option>
                                    <option value="English">English</option>
                                    <option value="History">History</option>
                                </select>
                            </div>
                            <div class="flex flex-col gap-1">
                                <label class="text-xs font-bold text-slate-500">Select Time:</label>
                                <select id="attendanceTimePicker" class="px-3 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-indigo-500 w-full">
                                    <option value="09:00 AM">09:00 AM</option>
                                    <option value="10:30 AM">10:30 AM</option>
                                    <option value="12:00 PM">12:00 PM</option>
                                    <option value="01:30 PM">01:30 PM</option>
                                    <option value="03:00 PM">03:00 PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="p-6">
                        <div id="attendanceList" class="grid gap-4">
                            <div class="text-center py-12 text-slate-400">Loading students...</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="space-y-8">
                <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                    <h4 class="font-bold text-slate-900 mb-4">Recent Attendance Logs</h4>
                    <div id="recentAttendanceLogs">
                        <div class="text-center py-8 text-slate-400 text-sm">Loading logs...</div>
                    </div>
                </div>
                
                <div class="bg-indigo-600 rounded-3xl p-6 text-white shadow-lg shadow-indigo-200">
                    <h4 class="font-bold mb-2">Quick Tip</h4>
                    <p class="text-indigo-100 text-sm">You can mark attendance for future dates to schedule classes in advance.</p>
                </div>
            </div>
        </div>
    `;

    const datePicker = document.getElementById('attendanceDatePicker') as HTMLInputElement;
    const subjectPicker = document.getElementById('attendanceSubjectPicker') as HTMLSelectElement;
    const timePicker = document.getElementById('attendanceTimePicker') as HTMLSelectElement;

    const updateView = () => {
        selectedDate = datePicker.value;
        selectedSubject = subjectPicker.value;
        selectedTime = timePicker.value;
        loadAttendance(selectedDate, selectedSubject);
        loadRecentLogs();
    };

    datePicker.addEventListener('change', updateView);
    subjectPicker.addEventListener('change', updateView);
    timePicker.addEventListener('change', updateView);

    loadAttendance(selectedDate, selectedSubject);
    loadRecentLogs();
}

(window as any).markAttendance = async (studentId: string, status: string, date: string, subject: string, time: string) => {
    try {
        await fetch('/api/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ studentId, status, date, subject, time })
        });
        // Refresh the list
        const datePicker = document.getElementById('attendanceDatePicker') as HTMLInputElement;
        const subjectPicker = document.getElementById('attendanceSubjectPicker') as HTMLSelectElement;
        if (datePicker && subjectPicker) {
            const currentFunc = (window as any).refreshAttendance;
            if (typeof currentFunc === 'function') currentFunc(datePicker.value, subjectPicker.value);
        }
    } catch (err) {
        console.error('Mark attendance error:', err);
    }
};

// Helper to refresh attendance list without full re-render
(window as any).refreshAttendance = async (date: string, subject: string) => {
    const studentsRes = await fetch('/api/students');
    const attendanceRes = await fetch(`/api/attendance?date=${date}&subject=${subject}`);
    const students = await studentsRes.json();
    const attendance = await attendanceRes.json();
    const attendanceMap = new Map(attendance.map((a: any) => [a.studentId, a.status]));

    const listContainer = document.getElementById('attendanceList');
    if (listContainer) {
        const timePicker = document.getElementById('attendanceTimePicker') as HTMLSelectElement;
        const selectedTime = timePicker?.value || '09:00 AM';

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
                            <button onclick="window.markAttendance('${s.id}', 'Present', '${date}', '${subject}', '${selectedTime}')" class="px-3 py-1 bg-emerald-600 text-white rounded-lg text-[10px] font-bold hover:bg-emerald-700 transition-all">P</button>
                            <button onclick="window.markAttendance('${s.id}', 'Absent', '${date}', '${subject}', '${selectedTime}')" class="px-3 py-1 bg-rose-600 text-white rounded-lg text-[10px] font-bold hover:bg-rose-700 transition-all">A</button>
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

async function renderClassesModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/classes');
        const classes = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-900">Manage Classes</h3>
                    <button onclick="window.addClass()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        Add Class
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-slate-100">
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">ID</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Name</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Section</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${classes.map((c: any) => `
                                <tr>
                                    <td class="py-4 text-sm text-slate-600">${c.id}</td>
                                    <td class="py-4 text-sm font-bold text-slate-900">${c.name}</td>
                                    <td class="py-4 text-sm text-slate-600">${c.section}</td>
                                    <td class="py-4 text-right">
                                        <button onclick="window.editClass('${c.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button onclick="window.deleteClass('${c.id}')" class="text-rose-600 hover:text-rose-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error rendering classes:', err);
    }
}

(window as any).addClass = async () => {
    const name = prompt("Enter Class Name (e.g., 10th):");
    const section = prompt("Enter Section (e.g., A):");
    if (!name || !section) return;

    try {
        await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, section })
        });
        renderClassesModule();
    } catch (err) {
        console.error('Error adding class:', err);
    }
};

(window as any).editClass = async (id: string) => {
    const name = prompt("Enter New Class Name:");
    const section = prompt("Enter New Section:");
    if (!name || !section) return;

    try {
        await fetch(`/api/classes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, section })
        });
        renderClassesModule();
    } catch (err) {
        console.error('Error editing class:', err);
    }
};

(window as any).deleteClass = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
        await fetch(`/api/classes/${id}`, { method: 'DELETE' });
        renderClassesModule();
    } catch (err) {
        console.error('Error deleting class:', err);
    }
};

async function renderSubjectsModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const res = await fetch('/api/subjects');
        const subjects = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-900">Manage Subjects</h3>
                    <button onclick="window.addSubject()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        Add Subject
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-slate-100">
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">ID</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Name</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${subjects.map((s: any) => `
                                <tr>
                                    <td class="py-4 text-sm text-slate-600">${s.id}</td>
                                    <td class="py-4 text-sm font-bold text-slate-900">${s.name}</td>
                                    <td class="py-4 text-right">
                                        <button onclick="window.editSubject('${s.id}')" class="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                                        <button onclick="window.deleteSubject('${s.id}')" class="text-rose-600 hover:text-rose-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error rendering subjects:', err);
    }
}

(window as any).addSubject = async () => {
    const name = prompt("Enter Subject Name:");
    if (!name) return;

    try {
        await fetch('/api/subjects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        renderSubjectsModule();
    } catch (err) {
        console.error('Error adding subject:', err);
    }
};

(window as any).editSubject = async (id: string) => {
    const name = prompt("Enter New Subject Name:");
    if (!name) return;

    try {
        await fetch(`/api/subjects/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        renderSubjectsModule();
    } catch (err) {
        console.error('Error editing subject:', err);
    }
};

(window as any).deleteSubject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
        await fetch(`/api/subjects/${id}`, { method: 'DELETE' });
        renderSubjectsModule();
    } catch (err) {
        console.error('Error deleting subject:', err);
    }
};

async function renderAcademicMappingModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    try {
        const [classesRes, subjectsRes, staffRes, mappingRes] = await Promise.all([
            fetch('/api/classes'),
            fetch('/api/subjects'),
            fetch('/api/staff'),
            fetch('/api/class-subjects')
        ]);

        const classes = await classesRes.json();
        const subjects = await subjectsRes.json();
        const staff = await staffRes.json();
        const mappings = await mappingRes.json();

        const classMap = new Map(classes.map((c: any) => [c.id, `${c.name} ${c.section}`]));
        const subjectMap = new Map(subjects.map((s: any) => [s.id, s.name]));
        const staffMap = new Map(staff.map((s: any) => [s.id, s.name]));

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-900">Academic Mapping (Class-Subject-Teacher)</h3>
                    <button onclick="window.addMapping()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                        New Mapping
                    </button>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="border-b border-slate-100">
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Class</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Subject</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Teacher</th>
                                <th class="pb-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-50">
                            ${mappings.map((m: any) => `
                                <tr>
                                    <td class="py-4 text-sm font-bold text-slate-900">${classMap.get(m.classId) || 'Unknown'}</td>
                                    <td class="py-4 text-sm text-slate-600">${subjectMap.get(m.subjectId) || 'Unknown'}</td>
                                    <td class="py-4 text-sm text-slate-600">${staffMap.get(m.teacherId) || 'Unknown'}</td>
                                    <td class="py-4 text-right">
                                        <button onclick="window.deleteMapping('${m.id}')" class="text-rose-600 hover:text-rose-900">Delete</button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;

        (window as any).addMapping = async () => {
            const classOptions = classes.map((c: any) => `${c.id}: ${c.name} ${c.section}`).join('\n');
            const subjectOptions = subjects.map((s: any) => `${s.id}: ${s.name}`).join('\n');
            const staffOptions = staff.filter((s: any) => s.role === 'Teaching Staff').map((s: any) => `${s.id}: ${s.name}`).join('\n');

            const classId = prompt(`Select Class ID:\n${classOptions}`);
            const subjectId = prompt(`Select Subject ID:\n${subjectOptions}`);
            const teacherId = prompt(`Select Teacher ID:\n${staffOptions}`);

            if (!classId || !subjectId || !teacherId) return;

            try {
                const res = await fetch('/api/class-subjects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ classId, subjectId, teacherId })
                });
                const data = await res.json();
                if (!data.success) {
                    alert(data.message || "Failed to create mapping");
                } else {
                    renderAcademicMappingModule();
                }
            } catch (err) {
                console.error('Error adding mapping:', err);
            }
        };

        (window as any).deleteMapping = async (id: string) => {
            if (!confirm("Delete this mapping?")) return;
            try {
                await fetch(`/api/class-subjects/${id}`, { method: 'DELETE' });
                renderAcademicMappingModule();
            } catch (err) {
                console.error('Error deleting mapping:', err);
            }
        };

    } catch (err) {
        console.error('Error rendering mapping module:', err);
    }
}

async function renderAssignedAcademicModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user) return;

    const teacherId = (user as any).staffId || '1';

    try {
        const [classesRes, subjectsRes, mappingRes] = await Promise.all([
            fetch('/api/classes'),
            fetch('/api/subjects'),
            fetch(`/api/class-subjects?teacherId=${teacherId}`)
        ]);

        const classes = await classesRes.json();
        const subjects = await subjectsRes.json();
        const mappings = await mappingRes.json();

        const classMap = new Map(classes.map((c: any) => [c.id, `${c.name} ${c.section}`]));
        const subjectMap = new Map(subjects.map((s: any) => [s.id, s.name]));

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 mb-6">Your Assigned Classes & Subjects</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${mappings.map((m: any) => `
                        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div class="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">${classMap.get(m.classId)}</div>
                            <div class="text-xl font-bold text-slate-900">${subjectMap.get(m.subjectId)}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error rendering assigned academic:', err);
    }
}

async function renderMySubjectsModule() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        const studentRes = await fetch(`/api/students?id=${user.studentId}`);
        const studentData = await studentRes.json();
        const student = studentData[0];
        if (!student) return;

        // Find class ID based on name/section
        const classesRes = await fetch('/api/classes');
        const classes = await classesRes.json();
        const myClass = classes.find((c: any) => c.name === student.grade && c.section === student.section);
        
        if (!myClass) {
            dashboardContent.innerHTML = '<p class="p-6 text-slate-500">No class mapping found for your grade/section.</p>';
            return;
        }

        const [subjectsRes, staffRes, mappingRes] = await Promise.all([
            fetch('/api/subjects'),
            fetch('/api/staff'),
            fetch(`/api/class-subjects?classId=${myClass.id}`)
        ]);

        const subjects = await subjectsRes.json();
        const staff = await staffRes.json();
        const mappings = await mappingRes.json();

        const subjectMap = new Map(subjects.map((s: any) => [s.id, s.name]));
        const staffMap = new Map(staff.map((s: any) => [s.id, s.name]));

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <h3 class="font-bold text-slate-900 mb-6">My Subjects & Teachers (${student.grade} ${student.section})</h3>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    ${mappings.map((m: any) => `
                        <div class="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                            <div class="text-xl font-bold text-slate-900 mb-2">${subjectMap.get(m.subjectId)}</div>
                            <div class="flex items-center gap-2 text-slate-500">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                <span class="text-sm">${staffMap.get(m.teacherId)}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Error rendering my subjects:', err);
    }
}

async function renderAcademicInfoModule() {
    // Parent view is similar to student view
    renderMySubjectsModule();
}

async function renderTimetableModule(role: string) {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        let classId = '';
        let teacherId = '';

        if (role === 'Student' || role === 'Parent') {
            const studentId = user.studentId;
            if (studentId) {
                const studentRes = await fetch(`/api/students?id=${studentId}`);
                const studentData = await studentRes.json();
                const student = studentData[0];
                if (student) {
                    classId = `${student.grade}-${student.section}`;
                }
            }
        } else if (role === 'Teaching Staff') {
            // Assuming teacher has staffId in user object
            teacherId = (user as any).staffId || '1'; // Fallback for demo
        }

        const query = classId ? `?classId=${classId}` : (teacherId ? `?teacherId=${teacherId}` : '');
        const [timetableRes, staffRes] = await Promise.all([
            fetch(`/api/timetable${query}`),
            fetch('/api/staff')
        ]);

        const timetable = await timetableRes.json();
        const staff = await staffRes.json();
        const staffMap = new Map(staff.map((s: any) => [s.id, s.name]));

        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const timeSlots = ['09:00', '10:00', '11:00', '12:00', '01:00', '02:00', '03:00'];

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
                <div class="flex justify-between items-center mb-6">
                    <h3 class="font-bold text-slate-900">Weekly Timetable ${classId ? `(${classId})` : ''}</h3>
                    ${role === 'Admin' ? `
                        <button onclick="window.addTimetableEntry()" class="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all">
                            Add Entry
                        </button>
                    ` : ''}
                </div>
                
                <div class="overflow-x-auto">
                    <table class="w-full border-collapse">
                        <thead>
                            <tr>
                                <th class="p-4 border border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase font-bold text-left">Time</th>
                                ${days.map(day => `<th class="p-4 border border-slate-100 bg-slate-50 text-slate-500 text-xs uppercase font-bold text-center">${day}</th>`).join('')}
                            </tr>
                        </thead>
                        <tbody>
                            ${timeSlots.map(slot => `
                                <tr>
                                    <td class="p-4 border border-slate-100 text-sm font-medium text-slate-600 bg-slate-50">${slot}</td>
                                    ${days.map(day => {
                                        const entry = timetable.find((t: any) => t.day === day && t.startTime === slot);
                                        return `
                                            <td class="p-4 border border-slate-100 min-w-[150px] align-top">
                                                ${entry ? `
                                                    <div class="bg-indigo-50 p-3 rounded-xl border border-indigo-100 relative group">
                                                        <div class="font-bold text-indigo-700 text-sm">${entry.subject}</div>
                                                        <div class="text-xs text-indigo-500 mt-1">${staffMap.get(entry.teacherId) || 'Unknown'}</div>
                                                        ${role === 'Admin' ? `
                                                            <div class="text-[10px] text-indigo-400 mt-1">${entry.classId}</div>
                                                            <div class="flex gap-2 mt-2">
                                                                <button onclick="window.editTimetableEntry('${entry.id}')" class="text-indigo-600 hover:text-indigo-800 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                                                                </button>
                                                                <button onclick="window.deleteTimetableEntry('${entry.id}')" class="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                                </button>
                                                            </div>
                                                        ` : ''}
                                                    </div>
                                                ` : ''}
                                            </td>
                                        `;
                                    }).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Timetable fetch error:', err);
    }
}

(window as any).addTimetableEntry = async () => {
    const classId = prompt("Class ID (e.g., 10th-A):");
    if (!classId) return;
    const subject = prompt("Subject:");
    const teacherId = prompt("Teacher ID:");
    const day = prompt("Day (Monday-Saturday):");
    const startTime = prompt("Start Time (HH:MM, e.g., 09:00):");
    const endTime = prompt("End Time (HH:MM, e.g., 10:00):");

    try {
        const res = await fetch('/api/timetable', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId, subject, teacherId, day, startTime, endTime })
        });
        const data = await res.json();
        if (!data.success) {
            alert(data.message || "Failed to add entry");
        } else {
            renderTimetableModule('Admin');
        }
    } catch (err) {
        console.error('Add timetable entry error:', err);
    }
};

(window as any).editTimetableEntry = async (id: string) => {
    const classId = prompt("Update Class ID (e.g., 10th-A):");
    if (!classId) return;
    const subject = prompt("Update Subject:");
    const teacherId = prompt("Update Teacher ID:");
    const day = prompt("Update Day (Monday-Saturday):");
    const startTime = prompt("Update Start Time (HH:MM, e.g., 09:00):");
    const endTime = prompt("Update End Time (HH:MM, e.g., 10:00):");

    try {
        const res = await fetch(`/api/timetable/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ classId, subject, teacherId, day, startTime, endTime })
        });
        const data = await res.json();
        if (!data.success) {
            alert(data.message || "Failed to update entry");
        } else {
            renderTimetableModule('Admin');
        }
    } catch (err) {
        console.error('Edit timetable entry error:', err);
    }
};

(window as any).deleteTimetableEntry = async (id: string) => {
    if (!confirm("Delete this timetable entry?")) return;
    try {
        await fetch(`/api/timetable/${id}`, { method: 'DELETE' });
        renderTimetableModule('Admin');
    } catch (err) {
        console.error('Delete timetable entry error:', err);
    }
};

async function renderStudentAttendance() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user || !user.studentId) return;

    try {
        const res = await fetch(`/api/attendance?studentId=${user.studentId}`);
        const attendance = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50">
                    <h3 class="font-bold text-slate-900">My Attendance History</h3>
                </div>
                <div class="p-6">
                    <div class="overflow-x-auto">
                        <table class="w-full text-left">
                            <thead class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                                <tr>
                                    <th class="px-6 py-4 font-semibold">Date</th>
                                    <th class="px-6 py-4 font-semibold">Subject</th>
                                    <th class="px-6 py-4 font-semibold">Time</th>
                                    <th class="px-6 py-4 font-semibold">Status</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-slate-50">
                                ${attendance.length > 0 ? attendance.map((a: any) => `
                                    <tr class="hover:bg-slate-50 transition-colors">
                                        <td class="px-6 py-4 text-sm text-slate-700">${a.date}</td>
                                        <td class="px-6 py-4 text-sm text-slate-700 font-medium">${a.subject || 'General'}</td>
                                        <td class="px-6 py-4 text-sm text-slate-500">${a.time || 'N/A'}</td>
                                        <td class="px-6 py-4 text-sm">
                                            <span class="text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${a.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}">
                                                ${a.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('') : '<tr><td colspan="4" class="text-center py-12 text-slate-400">No attendance records found.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Student attendance fetch error:', err);
    }
}

async function renderStudentResults() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user || !user.studentId) return;

    try {
        const res = await fetch(`/api/exams?studentId=${user.studentId}`);
        const results = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50">
                    <h3 class="font-bold text-slate-900">My Exam Results</h3>
                </div>
                <div class="p-6">
                    <div class="grid gap-4">
                        ${results.length > 0 ? results.map((r: any) => `
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <div class="text-sm font-bold text-slate-900">${r.examType}</div>
                                    <div class="text-xs text-slate-500">Subject: General</div>
                                </div>
                                <div class="text-lg font-bold text-indigo-600">${r.marks}%</div>
                            </div>
                        `).join('') : '<div class="text-center py-12 text-slate-400">No exam results found.</div>'}
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Student results fetch error:', err);
    }
}

async function renderStudentFees() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user || !user.studentId) return;

    try {
        const res = await fetch(`/api/fees?studentId=${user.studentId}`);
        const fees = await res.json();

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50">
                    <h3 class="font-bold text-slate-900">Fee Status</h3>
                </div>
                <div class="p-6">
                    <div class="grid gap-4">
                        ${fees.length > 0 ? fees.map((f: any) => `
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div>
                                    <div class="text-sm font-bold text-slate-900">${f.type}</div>
                                    <div class="text-xs text-slate-500">Due Date: ${f.dueDate}</div>
                                </div>
                                <div class="flex items-center gap-4">
                                    <div class="text-sm font-bold text-slate-900">₹${f.amount}</div>
                                    <span class="text-[10px] font-bold uppercase px-2 py-1 rounded-lg ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}">
                                        ${f.status}
                                    </span>
                                </div>
                            </div>
                        `).join('') : '<div class="text-center py-12 text-slate-400">No fee records found.</div>'}
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Student fees fetch error:', err);
    }
}

async function renderParentChildInfo() {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user || !user.studentId) return;

    try {
        const res = await fetch(`/api/students?id=${user.studentId}`);
        const studentData = await res.json();
        const s = studentData[0];

        if (!s) {
            dashboardContent.innerHTML = '<div class="text-center py-12 text-slate-400">Child information not found.</div>';
            return;
        }

        dashboardContent.innerHTML = `
            <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div class="p-6 border-b border-slate-50">
                    <h3 class="font-bold text-slate-900">Child Information</h3>
                </div>
                <div class="p-8">
                    <div class="flex items-center gap-8 mb-12">
                        <div class="w-32 h-32 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-4xl font-bold">
                            ${s.name.charAt(0)}
                        </div>
                        <div>
                            <h2 class="text-3xl font-bold text-slate-900 mb-2">${s.name}</h2>
                            <p class="text-slate-500 text-lg">Student ID: ${s.id}</p>
                        </div>
                    </div>
                    <div class="grid md:grid-cols-2 gap-12">
                        <div class="space-y-6">
                            <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider">Academic Details</h4>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div class="text-xs text-slate-500 mb-1">Grade</div>
                                    <div class="font-bold text-slate-900">${s.grade}</div>
                                </div>
                                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div class="text-xs text-slate-500 mb-1">Section</div>
                                    <div class="font-bold text-slate-900">${s.section}</div>
                                </div>
                                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div class="text-xs text-slate-500 mb-1">Roll Number</div>
                                    <div class="font-bold text-slate-900">${s.rollNo}</div>
                                </div>
                                <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div class="text-xs text-slate-500 mb-1">Admission Date</div>
                                    <div class="font-bold text-slate-900">2023-06-15</div>
                                </div>
                            </div>
                        </div>
                        <div class="space-y-6">
                            <h4 class="text-sm font-bold text-slate-400 uppercase tracking-wider">Contact Information</h4>
                            <div class="space-y-4">
                                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                                        ${getIcon('Mail')}
                                    </div>
                                    <div>
                                        <div class="text-xs text-slate-500">Parent Email</div>
                                        <div class="font-bold text-slate-900">${user.username}@example.com</div>
                                    </div>
                                </div>
                                <div class="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div class="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-400">
                                        ${getIcon('Phone')}
                                    </div>
                                    <div>
                                        <div class="text-xs text-slate-500">Emergency Contact</div>
                                        <div class="font-bold text-slate-900">+91 98765 43210</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } catch (err) {
        console.error('Parent child info fetch error:', err);
    }
}

async function renderParentAttendance() {
    // Reuse student attendance logic but with parent context
    renderStudentAttendance();
}

async function renderParentResults() {
    // Reuse student results logic but with parent context
    renderStudentResults();
}

async function renderDocumentsModule(role: string) {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        const query = `?userId=${user.id}&userRole=${role}`;
        const res = await fetch(`/api/documents${query}`);
        const documents = await res.json();

        dashboardContent.innerHTML = `
            <div class="space-y-6">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-xl font-bold text-slate-900">Document Management</h3>
                        <p class="text-slate-500 text-sm">Manage and view your documents</p>
                    </div>
                    ${role !== 'Admin' ? `
                        <button onclick="window.showUploadModal()" class="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-2">
                            ${getIcon('UserPlus')}
                            Upload Document
                        </button>
                    ` : ''}
                </div>

                <div class="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <table class="w-full text-left">
                        <thead>
                            <tr class="bg-slate-50 border-b border-slate-100">
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">File Name</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Upload Date</th>
                                ${role === 'Admin' || role === 'HR' ? `<th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">User Role</th>` : ''}
                                <th class="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            ${documents.length === 0 ? `
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-slate-400">No documents found</td>
                                </tr>
                            ` : documents.map((doc: any) => `
                                <tr class="hover:bg-slate-50/50 transition-colors">
                                    <td class="px-6 py-4">
                                        <div class="flex items-center gap-3">
                                            <div class="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600">
                                                ${getIcon('FileText')}
                                            </div>
                                            <span class="font-medium text-slate-900">${doc.fileName}</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${doc.fileType.split('/')[1].toUpperCase()}</td>
                                    <td class="px-6 py-4 text-sm text-slate-600">${doc.uploadDate}</td>
                                    ${role === 'Admin' || role === 'HR' ? `<td class="px-6 py-4 text-sm text-slate-600">${doc.userRole}</td>` : ''}
                                    <td class="px-6 py-4 text-right">
                                        <div class="flex justify-end gap-2">
                                            <a href="${doc.filePath}" target="_blank" class="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                                            </a>
                                            <button onclick="window.deleteDocument('${doc.id}')" class="p-2 text-slate-400 hover:text-rose-600 transition-colors">
                                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Upload Modal -->
            <div id="uploadModal" class="hidden fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div class="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
                    <div class="p-6 border-b border-slate-100 flex justify-between items-center">
                        <h3 class="text-lg font-bold text-slate-900">Upload Document</h3>
                        <button onclick="window.closeUploadModal()" class="text-slate-400 hover:text-slate-600">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    <form id="uploadForm" class="p-6 space-y-4">
                        <div class="space-y-2">
                            <label class="text-sm font-bold text-slate-700">Select File (PDF, JPEG, PNG, DOCX)</label>
                            <div class="relative group">
                                <input type="file" id="docFile" name="file" required class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100">
                            </div>
                        </div>
                        <button type="submit" class="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            Upload
                        </button>
                    </form>
                </div>
            </div>
        `;

        const uploadForm = document.getElementById('uploadForm') as HTMLFormElement;
        if (uploadForm) {
            uploadForm.onsubmit = async (e) => {
                e.preventDefault();
                const formData = new FormData(uploadForm);
                formData.append('userId', user.id);
                formData.append('userRole', role);

                try {
                    const uploadRes = await fetch('/api/documents', {
                        method: 'POST',
                        body: formData
                    });
                    const result = await uploadRes.json();
                    if (result.success) {
                        (window as any).closeUploadModal();
                        renderDocumentsModule(role);
                    } else {
                        alert(result.message || 'Upload failed');
                    }
                } catch (err) {
                    console.error('Upload error:', err);
                    alert('An error occurred during upload');
                }
            };
        }

    } catch (err) {
        console.error('Documents fetch error:', err);
    }
}

(window as any).showUploadModal = () => {
    document.getElementById('uploadModal')?.classList.remove('hidden');
};

(window as any).closeUploadModal = () => {
    document.getElementById('uploadModal')?.classList.add('hidden');
};

(window as any).deleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    const user = getCurrentUser();
    if (!user) return;

    try {
        const res = await fetch(`/api/documents/${id}?userId=${user.id}&userRole=${user.role}`, {
            method: 'DELETE'
        });
        const result = await res.json();
        if (result.success) {
            renderDocumentsModule(user.role);
        } else {
            alert(result.message || 'Delete failed');
        }
    } catch (err) {
        console.error('Delete error:', err);
    }
};

async function renderReportsModule(role: string) {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    const user = getCurrentUser();
    if (!user) return;

    try {
        const query = `?role=${role}&userId=${user.id}${user.studentId ? `&studentId=${user.studentId}` : ''}`;
        const res = await fetch(`/api/reports${query}`);
        const data = await res.json();

        let html = `
            <div class="space-y-8">
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="text-2xl font-bold text-slate-900">Reports & Analytics</h3>
                        <p class="text-slate-500">Real-time insights and performance tracking</p>
                    </div>
                </div>
        `;

        if (role === 'Admin') {
            html += `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Total Fees Collected</div>
                        <div class="text-3xl font-bold text-slate-900">₹${data.fees.paid.toLocaleString()}</div>
                        <div class="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-500" style="width: ${(data.fees.paid / data.fees.total * 100).toFixed(1)}%"></div>
                        </div>
                        <div class="mt-2 text-xs text-slate-400">Total: ₹${data.fees.total.toLocaleString()}</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Attendance Rate</div>
                        <div class="text-3xl font-bold text-slate-900">${data.attendance.rate}%</div>
                        <div class="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-indigo-500" style="width: ${data.attendance.rate}%"></div>
                        </div>
                        <div class="mt-2 text-xs text-slate-400">Across all students</div>
                    </div>
                    <div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Avg. Performance</div>
                        <div class="text-3xl font-bold text-slate-900">${data.performance.average}%</div>
                        <div class="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div class="h-full bg-amber-500" style="width: ${data.performance.average}%"></div>
                        </div>
                        <div class="mt-2 text-xs text-slate-400">Based on recent exams</div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-6">Fees Summary</h4>
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <span class="text-slate-600">Paid Fees</span>
                                <span class="font-bold text-emerald-600">₹${data.fees.paid.toLocaleString()}</span>
                            </div>
                            <div class="flex justify-between items-center">
                                <span class="text-slate-600">Pending Fees</span>
                                <span class="font-bold text-rose-500">₹${data.fees.pending.toLocaleString()}</span>
                            </div>
                            <div class="pt-4 border-top border-slate-100 flex justify-between items-center">
                                <span class="font-bold text-slate-900">Total Expected</span>
                                <span class="font-bold text-slate-900">₹${data.fees.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h4 class="font-bold text-slate-900 mb-6">School Overview</h4>
                        <div class="grid grid-cols-2 gap-4">
                            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div class="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">Students</div>
                                <div class="text-2xl font-bold text-slate-900">${data.studentCount}</div>
                            </div>
                            <div class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                <div class="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">Staff</div>
                                <div class="text-2xl font-bold text-slate-900">${data.staffCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        } else if (role === 'Teaching Staff') {
            html += `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Class Performance</div>
                        <div class="text-4xl font-bold text-indigo-600">${data.classPerformance}%</div>
                        <p class="mt-4 text-slate-500 text-sm">Average marks across all assigned classes.</p>
                    </div>
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Attendance Summary</div>
                        <div class="text-4xl font-bold text-emerald-600">${data.attendanceSummary}%</div>
                        <p class="mt-4 text-slate-500 text-sm">Overall attendance rate for your students.</p>
                    </div>
                </div>
            `;
        } else if (role === 'Student' || role === 'Parent') {
            html += `
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Personal Performance</div>
                        <div class="text-4xl font-bold text-indigo-600">${data.performance}%</div>
                        <div class="mt-6 space-y-3">
                            ${data.results.map((res: any) => `
                                <div class="flex justify-between text-sm">
                                    <span class="text-slate-600">${res.examName}</span>
                                    <span class="font-bold text-slate-900">${res.marks}/${res.totalMarks}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <div class="text-slate-500 text-sm font-medium mb-2">Attendance Percentage</div>
                        <div class="text-4xl font-bold text-emerald-600">${data.attendanceRate}%</div>
                        <p class="mt-4 text-slate-500 text-sm">Your overall attendance for the current academic year.</p>
                    </div>
                </div>
            `;
        } else if (role === 'HR') {
            html += `
                <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h4 class="font-bold text-slate-900 mb-6">Employee Summary</h4>
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                            <div class="text-slate-500 text-xs mb-1 uppercase tracking-wider font-bold">Total Employees</div>
                            <div class="text-3xl font-bold text-slate-900">${data.staffSummary.total}</div>
                        </div>
                        <div class="p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                            <div class="text-indigo-500 text-xs mb-1 uppercase tracking-wider font-bold">Teaching Staff</div>
                            <div class="text-3xl font-bold text-indigo-700">${data.staffSummary.teaching}</div>
                        </div>
                        <div class="p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                            <div class="text-emerald-500 text-xs mb-1 uppercase tracking-wider font-bold">Non-Teaching</div>
                            <div class="text-3xl font-bold text-emerald-700">${data.staffSummary.nonTeaching}</div>
                        </div>
                    </div>
                </div>
            `;
        }

        html += `</div>`;
        dashboardContent.innerHTML = html;

    } catch (err) {
        console.error('Reports fetch error:', err);
        dashboardContent.innerHTML = `
            <div class="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
                Failed to load reports. Please try again later.
            </div>
        `;
    }
}

async function renderSettingsModule(role: string) {
    const dashboardContent = document.getElementById('dashboardContent');
    if (!dashboardContent) return;

    if (role !== 'Admin') {
        dashboardContent.innerHTML = `
            <div class="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
                Access Denied. Only administrators can access settings.
            </div>
        `;
        return;
    }

    dashboardContent.innerHTML = `
        <div class="flex justify-center p-12">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    `;

    try {
        const response = await fetch('/api/settings');
        const settings = await response.json();

        let html = `
            <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <!-- General Settings -->
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span class="p-2 bg-indigo-50 text-indigo-600 rounded-lg mr-3">
                                ${getIcon('School')}
                            </span>
                            General Settings
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">School Name</label>
                                <input type="text" id="schoolName" value="${settings.schoolName}" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-slate-700 mb-1">Academic Year</label>
                                <input type="text" id="academicYear" value="${settings.academicYear}" class="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all">
                            </div>
                        </div>
                    </div>

                    <!-- System Settings -->
                    <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 class="text-lg font-bold text-slate-900 mb-6 flex items-center">
                            <span class="p-2 bg-emerald-50 text-emerald-600 rounded-lg mr-3">
                                ${getIcon('LayoutDashboard')}
                            </span>
                            System Configuration
                        </h3>
                        <div class="space-y-4">
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <div class="font-medium text-slate-900">Allow Registration</div>
                                    <div class="text-xs text-slate-500">Enable new student/staff registration</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="allowRegistration" ${settings.systemConfig.allowRegistration ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>
                            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                <div>
                                    <div class="font-medium text-slate-900">Maintenance Mode</div>
                                    <div class="text-xs text-slate-500">Put the system in maintenance mode</div>
                                </div>
                                <label class="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" id="maintenanceMode" ${settings.systemConfig.maintenanceMode ? 'checked' : ''} class="sr-only peer">
                                    <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-600"></div>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Role Settings -->
                <div class="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-bold text-slate-900 flex items-center">
                            <span class="p-2 bg-amber-50 text-amber-600 rounded-lg mr-3">
                                ${getIcon('Users')}
                            </span>
                            Role Management
                        </h3>
                        <button onclick="window.addNewRole()" class="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium flex items-center">
                            ${getIcon('UserPlus')}
                            <span class="ml-2">Add Role</span>
                        </button>
                    </div>
                    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" id="rolesList">
                        ${settings.roles.map((r: string) => `
                            <div class="p-4 border border-slate-100 rounded-2xl bg-slate-50 flex items-center justify-between group">
                                <span class="font-medium text-slate-700">${r}</span>
                                <button class="text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="flex justify-end">
                    <button id="saveSettingsBtn" class="px-8 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 font-bold flex items-center">
                        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                        Save All Changes
                    </button>
                </div>
            </div>
        `;

        dashboardContent.innerHTML = html;

        // Add event listeners
        const saveBtn = document.getElementById('saveSettingsBtn') as HTMLButtonElement;
        if (saveBtn) {
            saveBtn.onclick = async () => {
                const updatedSettings = {
                    schoolName: (document.getElementById('schoolName') as HTMLInputElement).value,
                    academicYear: (document.getElementById('academicYear') as HTMLInputElement).value,
                    systemConfig: {
                        allowRegistration: (document.getElementById('allowRegistration') as HTMLInputElement).checked,
                        maintenanceMode: (document.getElementById('maintenanceMode') as HTMLInputElement).checked,
                        theme: settings.systemConfig.theme
                    },
                    roles: settings.roles
                };

                try {
                    saveBtn.disabled = true;
                    saveBtn.innerHTML = `<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div> Saving...`;
                    
                    const res = await fetch(`/api/settings?role=${role}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedSettings)
                    });
                    
                    if (res.ok) {
                        alert('Settings updated successfully!');
                        renderSettingsModule(role);
                    } else {
                        alert('Failed to update settings.');
                    }
                } catch (err) {
                    console.error('Save error:', err);
                    alert('An error occurred while saving.');
                } finally {
                    saveBtn.disabled = false;
                    saveBtn.innerHTML = `<svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg> Save All Changes`;
                }
            };
        }

        (window as any).addNewRole = async () => {
            const roleName = prompt('Enter new role name:');
            if (roleName && !settings.roles.includes(roleName)) {
                const newRoles = [...settings.roles, roleName];
                const res = await fetch(`/api/settings?role=${role}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ roles: newRoles })
                });
                if (res.ok) {
                    renderSettingsModule(role);
                }
            }
        };

    } catch (err) {
        console.error('Settings fetch error:', err);
        dashboardContent.innerHTML = `
            <div class="bg-rose-50 text-rose-600 p-6 rounded-2xl border border-rose-100">
                Failed to load settings. Please try again later.
            </div>
        `;
    }
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
