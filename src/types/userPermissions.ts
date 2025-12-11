import type { IUser } from './user.d.js';

// Role-based permissions
export const USER_PERMISSIONS = {
  // Vehicle Management
  VEHICLES_VIEW: 'vehicles:view',
  VEHICLES_CREATE: 'vehicles:create',
  VEHICLES_UPDATE: 'vehicles:update',
  VEHICLES_DELETE: 'vehicles:delete',
  VEHICLES_VIEW_INTERNAL: 'vehicles:view:internal', // Can see acquisition cost, internal notes
  
  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_UPDATE: 'users:update',
  USERS_DELETE: 'users:delete',
  
  // System Management
  SYSTEM_SETTINGS: 'system:settings',
  SYSTEM_REPORTS: 'system:reports',
  
  // Master Data Management
  MASTER_DATA_VIEW: 'masterdata:view',
  MASTER_DATA_MANAGE: 'masterdata:manage',
} as const;

export const ROLE_PERMISSIONS: Record<IUser['role'], string[]> = {
  superAdmin: Object.values(USER_PERMISSIONS),
  admin: [
    USER_PERMISSIONS.VEHICLES_VIEW,
    USER_PERMISSIONS.VEHICLES_CREATE,
    USER_PERMISSIONS.VEHICLES_UPDATE,
    USER_PERMISSIONS.VEHICLES_DELETE,
    USER_PERMISSIONS.VEHICLES_VIEW_INTERNAL,
    USER_PERMISSIONS.USERS_VIEW,
    USER_PERMISSIONS.USERS_CREATE,
    USER_PERMISSIONS.USERS_UPDATE,
    USER_PERMISSIONS.SYSTEM_REPORTS,
    USER_PERMISSIONS.MASTER_DATA_VIEW,
    USER_PERMISSIONS.MASTER_DATA_MANAGE,
  ],
  manager: [
    USER_PERMISSIONS.VEHICLES_VIEW,
    USER_PERMISSIONS.VEHICLES_CREATE,
    USER_PERMISSIONS.VEHICLES_UPDATE,
    USER_PERMISSIONS.VEHICLES_VIEW_INTERNAL,
    USER_PERMISSIONS.USERS_VIEW,
    USER_PERMISSIONS.SYSTEM_REPORTS,
    USER_PERMISSIONS.MASTER_DATA_VIEW,
  ],
  salesperson: [
    USER_PERMISSIONS.VEHICLES_VIEW,
    USER_PERMISSIONS.MASTER_DATA_VIEW,
  ],
};
