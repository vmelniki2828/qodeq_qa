import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../utils/api';

const UserProfileContext = createContext(null);

const PROFILE_STORAGE_KEY = 'userProfile';
const ME_URL = '/api/v1/profile/user/me';

export const useUserProfile = () => {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error('useUserProfile must be used within UserProfileProvider');
  return ctx;
};

/**
 * Доступы по департаментам.
 * null = всем, строка = один отдел, массив = несколько отделов.
 */
export const FEATURE_DEPARTMENT = {
  '/dashboard': null,
  '/integrations': 'quality_assurance',
  '/projects': 'quality_assurance',
  '/chats': ['quality_assurance', 'support'],
  '/agents': ['quality_assurance', 'support'],
  '/tags': 'quality_assurance',
  '/statistics': null,
  '/groups-qa': 'quality_assurance',
  '/group-supports': ['quality_assurance', 'support'],
  '/metrics': ['quality_assurance', 'support'],
  '/settings': 'quality_assurance',
  '/manual-check': 'quality_assurance',
  '/admin': ['quality_assurance', 'support'],
};

/**
 * Роли, которым доступен раздел (в рамках своего департамента).
 * Если путь не указан — проверка по роли не выполняется.
 * Projects: только quality_assurance + admin, team_lead, head.
 * Chats: QA — admin, team_lead, head, agent; support — team_lead, head, agent, supervisor.
 * Agents: QA — admin, team_lead, head; support — team_lead, head.
 * Groups QA: quality_assurance — admin, team_lead, head, agent (agent только GET).
 * Groups Support: support — admin, team_lead, head.
 */
export const FEATURE_ROLES = {
  '/projects': { quality_assurance: ['admin', 'team_lead', 'head'] },
  '/chats': {
    quality_assurance: ['admin', 'team_lead', 'head', 'agent'],
    support: ['team_lead', 'head', 'agent', 'supervisor'],
  },
  '/agents': {
    quality_assurance: ['admin', 'team_lead', 'head'],
    support: ['team_lead', 'head'],
  },
  '/groups-qa': { quality_assurance: ['admin', 'team_lead', 'head', 'agent'] },
  '/group-supports': {
    quality_assurance: ['admin', 'team_lead', 'head'],
    support: ['admin', 'team_lead', 'head'],
  },
  '/metrics': {
    quality_assurance: ['admin', 'team_lead', 'head'],
    support: ['team_lead', 'head'],
  },
  '/settings': { quality_assurance: ['admin', 'team_lead', 'head'] },
  '/admin': {
    quality_assurance: ['admin', 'team_lead', 'head'],
    support: ['admin', 'team_lead', 'head'],
  },
};

/**
 * Доступ к методам по фиче.
 * Projects: GET, POST, PATCH, DELETE — только quality_assurance + admin, team_lead, head.
 * Chats: quality_assurance — GET, PATCH (admin, team_lead, head, agent); support — GET (team_lead, head, agent, supervisor).
 * Agents: quality_assurance — GET, POST, PATCH, DELETE (admin, team_lead, head); support — GET, POST, PATCH, DELETE (team_lead, head).
 * Groups QA: quality_assurance — admin, team_lead, head полный доступ; agent только GET.
 * Groups Support: support — admin, team_lead, head полный доступ.
 * Metrics: quality_assurance — admin, team_lead, head; support — team_lead, head (GET, POST, PATCH, DELETE).
 * Settings: quality_assurance — admin, team_lead, head (GET, PATCH).
 */
export const ACCESS_RULES = {
  projects: {
    quality_assurance: { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
    support: null,
  },
  chats: {
    quality_assurance: { roles: ['admin', 'team_lead', 'head', 'agent'], methods: ['GET', 'PATCH'] },
    support: { roles: ['team_lead', 'head', 'agent', 'supervisor'], methods: ['GET'] },
  },
  agents: {
    quality_assurance: { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
    support: { roles: ['team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
  },
  groupsQa: {
    quality_assurance: [
      { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
      { roles: ['agent'], methods: ['GET'] },
    ],
    support: null,
  },
  groupsSupport: {
    quality_assurance: { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
    support: { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
  },
  metrics: {
    quality_assurance: { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
    support: { roles: ['team_lead', 'head'], methods: ['GET', 'POST', 'PATCH', 'DELETE'] },
  },
  settings: {
    quality_assurance: { roles: ['admin', 'team_lead', 'head'], methods: ['GET', 'PATCH'] },
    support: null,
  },
};

const isDepartmentAllowed = (allowed, department) => {
  if (allowed == null) return true;
  if (Array.isArray(allowed)) return department && allowed.includes(department);
  return department === allowed;
};

const isRoleAllowedForPath = (path, department, role) => {
  const rolesByDept = FEATURE_ROLES[path];
  if (!rolesByDept || !department) return true;
  const roles = rolesByDept[department];
  if (!roles) return false;
  return role && roles.includes(role);
};

/**
 * Видимость раздела в меню: отдел разрешён и (если заданы роли) роль подходит.
 */
export const canAccessFeature = (path, department, role) => {
  const allowedDept = FEATURE_DEPARTMENT[path];
  if (!isDepartmentAllowed(allowedDept, department)) return false;
  return isRoleAllowedForPath(path, department, role);
};

/**
 * Разрешён ли метод для фичи при текущих department и role.
 * rule может быть объектом { roles, methods } или массивом таких объектов (разные роли — разные методы).
 */
export const canUseMethod = (feature, method, department, role) => {
  const byDept = ACCESS_RULES[feature];
  if (!byDept) return false;
  const rule = department ? byDept[department] : null;
  if (!rule) return false;
  const rules = Array.isArray(rule) ? rule : [rule];
  return rules.some((r) => r.roles.includes(role) && r.methods.includes(method));
};

export const UserProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);

  const loadProfile = useCallback(async () => {
    try {
      const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch (e) {
          console.error('Parse saved profile', e);
        }
      }
      const response = await apiFetch(ME_URL, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.error('Load profile', e);
    }
    return null;
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const department = profile?.department || null;
  const role = profile?.role || null;

  const value = {
    profile,
    setProfile,
    loadProfile,
    department,
    role,
    canAccessFeature: (path) => canAccessFeature(path, department, role),
    canUseMethod: (feature, method) => canUseMethod(feature, method, department, role),
  };

  return (
    <UserProfileContext.Provider value={value}>
      {children}
    </UserProfileContext.Provider>
  );
};
