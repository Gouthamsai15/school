import { User } from './auth.ts';

export type PermissionAction = 
    | 'ADD_STUDENT' 
    | 'MARK_ATTENDANCE' 
    | 'MANAGE_EMPLOYEES' 
    | 'PROCESS_FINANCE' 
    | 'MANAGE_TRANSPORT'
    | 'VIEW_REPORTS';

const rolePermissions: Record<string, PermissionAction[]> = {
    "Admin": ['ADD_STUDENT', 'MARK_ATTENDANCE', 'MANAGE_EMPLOYEES', 'PROCESS_FINANCE', 'MANAGE_TRANSPORT', 'VIEW_REPORTS'],
    "Teaching Staff": ['MARK_ATTENDANCE', 'VIEW_REPORTS'],
    "HR": ['MANAGE_EMPLOYEES', 'VIEW_REPORTS'],
    "Accounts": ['PROCESS_FINANCE', 'VIEW_REPORTS'],
    "Transport": ['MANAGE_TRANSPORT', 'VIEW_REPORTS'],
    "Admission": ['ADD_STUDENT'],
    "Non-Teaching Staff": ['VIEW_REPORTS'],
    "Student": [],
    "Parent": [],
    "Guest": []
};

export function hasPermission(user: User, action: PermissionAction): boolean {
    return rolePermissions[user.role]?.includes(action) || false;
}

export function getProtectedHeaders(user: User) {
    return {
        'Content-Type': 'application/json',
        'x-user-role': user.role
    };
}
