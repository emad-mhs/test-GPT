export const paths = {
  // Auth Paths
  login() {
    return '/auth/login';
  },

  register() {
    return '/auth/register';
  },

  resetPassword() {
    return '/auth/reset';
  },

  // Public Paths
  home() {
    return '/';
  },

  // Admin Paths
  usersPage() {
    return '/secretary/users';
  },

  userPage({ userId }: { userId: string }) {
    return `/secretary/users/${userId}`;
  },

  userSettingsPage({ userId }: { userId: string }) {
    return `/secretary/users/${userId}/settings`;
  },

  departmentsPage() {
    return '/secretary/departments';
  },

  departmentPage({ departmentId }: { departmentId: string }) {
    return `/secretary/departments/${departmentId}`;
  },

  departmentSettingsPage({ departmentId }: { departmentId: string }) {
    return `/secretary/departments/${departmentId}/settings`;
  },

  // Employee Paths
  profilePage({ userId }: { userId: string }) {
    return `/secretary/profile/${userId}`;
  },

  secretaryDashboard() {
    return '/secretary';
  },

  auditLogsPage() {
    return '/secretary/audit-logs';
  },

  trackingPage() {
    return '/secretary/tracking';
  },

  mailsPage() {
    return '/secretary/mails';
  },

  mailPage({ mailId }: { mailId: string }) {
    return `/secretary/mails/${mailId}`;
  },

  mailSettingsPage({ mailId }: { mailId: string }) {
    return `/secretary/mails/${mailId}/settings`;
  },

  contactsPage() {
    return '/secretary/contacts';
  },

  contactPage({ contactId }: { contactId: string }) {
    return `/secretary/contacts/${contactId}`;
  },

  contactSettingsPage({ contactId }: { contactId: string }) {
    return `/secretary/contacts/${contactId}/settings`;
  },

  documentsPage() {
    return '/secretary/documents';
  },

  documentPage({ documentId }: { documentId: string }) {
    return `/secretary/documents/${documentId}`;
  },

  categoriesPage() {
    return '/secretary/categories';
  },

  categoryPage({ categoryId }: { categoryId: string }) {
    return `/secretary/categories/${categoryId}`;
  },

  categorySettingsPage({ categoryId }: { categoryId: string }) {
    return `/secretary/categories/${categoryId}/settings`;
  },

  // WORKSPACE ROUTES

  workspacesPage() {
    return '/secretary/workspaces';
  },

  workspacePage({ workspaceId }: { workspaceId: string }) {
    return `/secretary/workspaces/${workspaceId}`;
  },

  membersPage({ workspaceId }: { workspaceId: string }) {
    return `/secretary/workspaces/${workspaceId}/members`;
  },

  projectPage({
    workspaceId,
    projectId,
  }: {
    workspaceId: string;
    projectId: string;
  }) {
    return `/secretary/workspaces/${workspaceId}/projects/${projectId}`;
  },

  projectSettingsPage({
    workspaceId,
    projectId,
  }: {
    workspaceId: string;
    projectId: string;
  }) {
    return `/secretary/workspaces/${workspaceId}/projects/${projectId}/settings`;
  },

  tasksPage({ workspaceId }: { workspaceId: string }) {
    return `/secretary/workspaces/${workspaceId}/tasks`;
  },

  taskPage({ workspaceId, taskId }: { workspaceId: string; taskId: string }) {
    return `/secretary/workspaces/${workspaceId}/tasks/${taskId}`;
  },
};
