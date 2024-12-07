import { User } from '../types/user';

export const ROLES = {
  SUPERADMIN: 'superadmin',
  ADMIN: 'admin',
  VOLUNTEER: 'volunteer'
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const hasPermission = (userRole: Role, requiredRole: Role): boolean => {
  const roleHierarchy = {
    [ROLES.SUPERADMIN]: 3,
    [ROLES.ADMIN]: 2,
    [ROLES.VOLUNTEER]: 1
  };

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
};

export const canManageUsers = (role: Role): boolean => {
  return role === ROLES.SUPERADMIN;
};

export const canManageMissions = (role: Role): boolean => {
  return role === ROLES.ADMIN || role === ROLES.SUPERADMIN;
};

export const canViewMissions = (role: Role): boolean => {
  return true; // All roles can view missions
};

export const canSignUpForMissions = (role: Role): boolean => {
  return role === ROLES.VOLUNTEER;
};