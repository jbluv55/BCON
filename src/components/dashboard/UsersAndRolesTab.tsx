import React, { useState } from 'react';
import { 
  Users, Shield, Key, Plus, Edit3, Trash2, CheckCircle2, XCircle, 
  Eye, EyeOff, Lock, UserCheck, AlertTriangle, ShieldCheck, 
  Briefcase, Megaphone, FileEdit, Video, Database, UserPlus, Search, 
  Copy, Check, RefreshCw, X, LogIn
} from 'lucide-react';
import { 
  RoleDefinition, 
  StaffUserAccount, 
  RolePermissions, 
  siteContentStore 
} from '../../services/siteContentStore';

interface UsersAndRolesTabProps {
  roles: RoleDefinition[];
  users: StaffUserAccount[];
  activeUserId: string;
  canManageUsersAndRoles: boolean;
}

export default function UsersAndRolesTab({
  roles,
  users,
  activeUserId,
  canManageUsersAndRoles
}: UsersAndRolesTabProps) {
  const [subTab, setSubTab] = useState<'users' | 'roles'>('users');
  
  // Search & Filters
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Password visibility map: { [userId]: boolean }
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});
  const [copiedPassMap, setCopiedPassMap] = useState<Record<string, boolean>>({});

  // User Modal State
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [formUsername, setFormUsername] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formDisplayName, setFormDisplayName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRoleId, setFormRoleId] = useState<string>('hr_officer');
  const [formStatus, setFormStatus] = useState<'Active' | 'Suspended'>('Active');
  const [userModalError, setUserModalError] = useState<string | null>(null);

  // Role Modal State
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [formRoleName, setFormRoleName] = useState('');
  const [formRoleKey, setFormRoleKey] = useState('');
  const [formRoleDesc, setFormRoleDesc] = useState('');
  const [formRoleColor, setFormRoleColor] = useState('teal');
  const [formPermissions, setFormPermissions] = useState<RolePermissions>({
    canManageCareers: false,
    canReviewApplications: false,
    canManageAdverts: false,
    canEditCopy: false,
    canManageMedia: false,
    canManageUsersAndRoles: false,
    canExportReset: false
  });
  const [roleModalError, setRoleModalError] = useState<string | null>(null);

  // Success Toasts
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3000);
  };

  // ------------------------------------
  // USER ACTIONS
  // ------------------------------------

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setFormUsername('');
    setFormPassword(generateRandomPassword());
    setFormDisplayName('');
    setFormEmail('');
    setFormRoleId(roles[0]?.id || 'hr_officer');
    setFormStatus('Active');
    setUserModalError(null);
    setIsUserModalOpen(true);
  };

  const handleOpenEditUser = (user: StaffUserAccount) => {
    setEditingUserId(user.id);
    setFormUsername(user.username);
    setFormPassword(user.password);
    setFormDisplayName(user.displayName);
    setFormEmail(user.email);
    setFormRoleId(user.roleId);
    setFormStatus(user.status);
    setUserModalError(null);
    setIsUserModalOpen(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUserModalError(null);

    if (editingUserId) {
      const res = siteContentStore.updateUser(editingUserId, {
        username: formUsername,
        password: formPassword,
        displayName: formDisplayName,
        email: formEmail,
        roleId: formRoleId,
        status: formStatus
      });
      if (!res.success) {
        setUserModalError(res.error || 'Failed to update user account.');
        return;
      }
      showToast(`User account "${formUsername}" updated successfully!`);
    } else {
      const res = siteContentStore.addUser({
        username: formUsername,
        password: formPassword,
        displayName: formDisplayName,
        email: formEmail,
        roleId: formRoleId,
        status: formStatus
      });
      if (!res.success) {
        setUserModalError(res.error || 'Failed to create user account.');
        return;
      }
      showToast(`User account "${formUsername}" created with password!`);
    }

    setIsUserModalOpen(false);
  };

  const handleDeleteUser = (user: StaffUserAccount) => {
    if (confirm(`Are you sure you want to delete user account "${user.username}" (${user.displayName})?`)) {
      const res = siteContentStore.deleteUser(user.id);
      if (!res.success) {
        alert(res.error);
      } else {
        showToast(`User "${user.username}" removed.`);
      }
    }
  };

  const handleSwitchActiveUser = (userId: string) => {
    siteContentStore.setActiveUser(userId);
    const targetUser = users.find(u => u.id === userId);
    showToast(`Switched active session to ${targetUser?.displayName} (@${targetUser?.username})`);
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswordMap(prev => ({ ...prev, [userId]: !prev[userId] }));
  };

  const handleCopyPassword = (userId: string, pass: string) => {
    navigator.clipboard.writeText(pass);
    setCopiedPassMap(prev => ({ ...prev, [userId]: true }));
    setTimeout(() => {
      setCopiedPassMap(prev => ({ ...prev, [userId]: false }));
    }, 2000);
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$';
    let pass = 'BCN_';
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  // ------------------------------------
  // ROLE ACTIONS
  // ------------------------------------

  const handleOpenAddRole = () => {
    setEditingRoleId(null);
    setFormRoleName('');
    setFormRoleKey('');
    setFormRoleDesc('');
    setFormRoleColor('teal');
    setFormPermissions({
      canManageCareers: true,
      canReviewApplications: false,
      canManageAdverts: false,
      canEditCopy: false,
      canManageMedia: false,
      canManageUsersAndRoles: false,
      canExportReset: false
    });
    setRoleModalError(null);
    setIsRoleModalOpen(true);
  };

  const handleOpenEditRole = (role: RoleDefinition) => {
    setEditingRoleId(role.id);
    setFormRoleName(role.name);
    setFormRoleKey(role.id);
    setFormRoleDesc(role.description);
    setFormRoleColor(role.badgeColor || 'teal');
    setFormPermissions({ ...role.permissions });
    setRoleModalError(null);
    setIsRoleModalOpen(true);
  };

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault();
    setRoleModalError(null);

    if (!formRoleName.trim()) {
      setRoleModalError('Role title is required.');
      return;
    }

    if (editingRoleId) {
      const res = siteContentStore.updateRole(editingRoleId, {
        name: formRoleName.trim(),
        description: formRoleDesc.trim(),
        badgeColor: formRoleColor,
        permissions: formPermissions
      });
      if (!res.success) {
        setRoleModalError(res.error || 'Failed to update role.');
        return;
      }
      showToast(`Role "${formRoleName}" updated with new module allocations!`);
    } else {
      const res = siteContentStore.addRole({
        id: formRoleKey.trim() || undefined,
        name: formRoleName.trim(),
        description: formRoleDesc.trim(),
        badgeColor: formRoleColor,
        permissions: formPermissions
      });
      if (!res.success) {
        setRoleModalError(res.error || 'Failed to create role.');
        return;
      }
      showToast(`New role "${formRoleName}" created and ready for user allocation!`);
    }

    setIsRoleModalOpen(false);
  };

  const handleDeleteRole = (role: RoleDefinition) => {
    if (confirm(`Are you sure you want to delete role "${role.name}"?`)) {
      const res = siteContentStore.deleteRole(role.id);
      if (!res.success) {
        alert(res.error);
      } else {
        showToast(`Role "${role.name}" deleted.`);
      }
    }
  };

  const togglePermission = (key: keyof RolePermissions) => {
    setFormPermissions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Filtered Users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.displayName.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.roleId === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (color?: string) => {
    switch (color) {
      case 'amber':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'teal':
        return 'bg-teal-100 text-teal-900 border-teal-300';
      case 'indigo':
        return 'bg-indigo-100 text-indigo-900 border-indigo-300';
      case 'purple':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'emerald':
        return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case 'rose':
        return 'bg-rose-100 text-rose-900 border-rose-300';
      case 'sky':
        return 'bg-sky-100 text-sky-900 border-sky-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="space-y-6" id="users_and_roles_manager">
      
      {/* Toast Notification */}
      {actionSuccess && (
        <div className="fixed top-24 right-8 z-50 bg-teal-900 text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-2 text-xs font-bold animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-amber-400" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Sub tabs: Staff User Accounts vs Role Definitions */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSubTab('users')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              subTab === 'users'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Staff User Accounts ({users.length})
          </button>

          <button
            onClick={() => setSubTab('roles')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
              subTab === 'roles'
                ? 'bg-teal-700 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Shield className="w-4 h-4" />
            Role Definitions &amp; Module Allocation ({roles.length})
          </button>
        </div>

        {canManageUsersAndRoles && (
          <div>
            {subTab === 'users' ? (
              <button
                onClick={handleOpenAddUser}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <UserPlus className="w-4 h-4" />
                Add New Staff User
              </button>
            ) : (
              <button
                onClick={handleOpenAddRole}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                Create New Role &amp; Allocate Modules
              </button>
            )}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SUB-TAB 1: STAFF USER ACCOUNTS (USERNAMES & PASSWORDS)    */}
      {/* ========================================================= */}
      {subTab === 'users' && (
        <div className="space-y-4">
          
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-grow max-w-md">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search username, staff name, or email..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full text-xs py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-600"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500 font-semibold">Filter by Role:</span>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              >
                <option value="All">All Roles</option>
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* User Accounts List */}
          <div className="grid grid-cols-1 gap-3">
            {filteredUsers.map((user) => {
              const assignedRole = roles.find(r => r.id === user.roleId) || {
                id: user.roleId,
                name: user.roleId,
                badgeColor: 'teal'
              };
              const isActiveSession = user.id === activeUserId;
              const isPasswordVisible = !!showPasswordMap[user.id];
              const isCopied = !!copiedPassMap[user.id];

              return (
                <div
                  key={user.id}
                  className={`bg-white p-5 rounded-2xl border transition-all shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    isActiveSession ? 'border-teal-500 ring-2 ring-teal-500/15 bg-teal-50/20' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-900 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded">
                        @{user.username}
                      </span>

                      <span className={`text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${getRoleBadgeStyle(assignedRole.badgeColor)}`}>
                        {assignedRole.name}
                      </span>

                      <span className={`text-xxs font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        user.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                      }`}>
                        ● {user.status}
                      </span>

                      {isActiveSession && (
                        <span className="text-xxs font-mono font-extrabold uppercase bg-amber-400 text-teal-950 px-2 py-0.5 rounded shadow-xs">
                          Active Session
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-gray-900">{user.displayName}</h4>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-sans">
                      <span>{user.email}</span>
                      <span>&bull;</span>
                      
                      {/* Password reveal & copy widget for Super Admin */}
                      <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-mono text-xxs">
                        <Lock className="w-3 h-3 text-gray-400" />
                        <span className="font-bold text-gray-800">
                          {isPasswordVisible ? user.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="p-0.5 text-gray-400 hover:text-gray-700 ml-1"
                          title={isPasswordVisible ? 'Hide password' : 'View password'}
                        >
                          {isPasswordVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                        <button
                          onClick={() => handleCopyPassword(user.id, user.password)}
                          className="p-0.5 text-gray-400 hover:text-teal-700"
                          title="Copy password to clipboard"
                        >
                          {isCopied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>

                      <span>&bull;</span>
                      <span className="text-xxs font-mono">Last Login: {user.lastLogin || 'Never'}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center">
                    
                    {/* Switch to this user */}
                    {!isActiveSession && (
                      <button
                        onClick={() => handleSwitchActiveUser(user.id)}
                        className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                        title="Simulate / Log in as this user to test permissions"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Switch to User
                      </button>
                    )}

                    {canManageUsersAndRoles && (
                      <>
                        <button
                          onClick={() => handleOpenEditUser(user)}
                          className="p-2 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
                          title="Edit User Credentials or Role"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {user.username !== 'admin' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* SUB-TAB 2: ROLE DEFINITIONS & MODULE ALLOCATION MATRIX   */}
      {/* ========================================================= */}
      {subTab === 'roles' && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 gap-4">
            {roles.map((role) => {
              const assignedUserCount = users.filter(u => u.roleId === role.id).length;

              return (
                <div
                  key={role.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-slate-300 transition-all shadow-xs space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-xxs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getRoleBadgeStyle(role.badgeColor)}`}>
                          {role.name}
                        </span>
                        <span className="font-mono text-xxs text-gray-400">
                          Role Key: <code>{role.id}</code>
                        </span>
                        {role.isSystemRole && (
                          <span className="text-xxs font-mono font-extrabold uppercase px-2 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded">
                            System Default
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-sans">{role.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs text-gray-500 font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
                        {assignedUserCount} {assignedUserCount === 1 ? 'Staff User' : 'Staff Users'}
                      </span>

                      {canManageUsersAndRoles && (
                        <>
                          <button
                            onClick={() => handleOpenEditRole(role)}
                            className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors border border-teal-200"
                            title="Edit Role & Module Permissions"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {!role.isSystemRole && role.id !== 'superadmin' && (
                            <button
                              onClick={() => handleDeleteRole(role)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                              title="Delete Role"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Allocated Modules Grid */}
                  <div className="space-y-1.5">
                    <span className="text-xxs font-mono font-bold uppercase tracking-wider text-gray-400">
                      Allocated Site Modules:
                    </span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-1 text-xs">
                      
                      {/* Careers */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canManageCareers ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <Briefcase className="w-3.5 h-3.5 shrink-0" />
                          <span>Careers Postings</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canManageCareers ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>

                      {/* Applications */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canReviewApplications ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <UserCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Applicant CVs</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canReviewApplications ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>

                      {/* Adverts */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canManageAdverts ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <Megaphone className="w-3.5 h-3.5 shrink-0" />
                          <span>Adverts &amp; Banners</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canManageAdverts ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>

                      {/* Site Copy */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canEditCopy ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <FileEdit className="w-3.5 h-3.5 shrink-0" />
                          <span>Text &amp; Copy</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canEditCopy ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>

                      {/* Media */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canManageMedia ? 'bg-teal-50 border-teal-200 text-teal-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <Video className="w-3.5 h-3.5 shrink-0" />
                          <span>Media &amp; Video</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canManageMedia ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>

                      {/* User Management */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canManageUsersAndRoles ? 'bg-purple-50 border-purple-200 text-purple-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                          <span>Users &amp; Roles</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canManageUsersAndRoles ? '✓ Super' : '✗ Denied'}
                        </span>
                      </div>

                      {/* Backup & Reset */}
                      <div className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        role.permissions.canExportReset ? 'bg-amber-50 border-amber-200 text-amber-900' : 'bg-slate-50 border-slate-200 text-gray-400 opacity-60'
                      }`}>
                        <div className="flex items-center gap-1.5 font-bold text-xxs uppercase">
                          <Database className="w-3.5 h-3.5 shrink-0" />
                          <span>Backup &amp; Reset</span>
                        </div>
                        <span className="text-[10px] font-mono mt-2 font-semibold">
                          {role.permissions.canExportReset ? '✓ Allowed' : '✗ Denied'}
                        </span>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 1: ADD / EDIT STAFF USER                           */}
      {/* ========================================================= */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded">
                  {editingUserId ? 'Edit Staff Credentials' : 'New Staff Account'}
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {editingUserId ? `Edit User: @${formUsername}` : 'Create Staff Login & Allocate Role'}
                </h3>
              </div>
              <button onClick={() => setIsUserModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {userModalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{userModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Username *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kemi_hr"
                    value={formUsername}
                    onChange={(e) => setFormUsername(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                  <span className="text-xxs text-gray-400 mt-0.5 block">Unique handle for logging in.</span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-gray-700">Password *</label>
                    <button
                      type="button"
                      onClick={() => setFormPassword(generateRandomPassword())}
                      className="text-xxs text-teal-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <RefreshCw className="w-3 h-3" /> Auto
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Enter password"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs"
                  />
                  <span className="text-xxs text-gray-400 mt-0.5 block">Staff uses this to sign in.</span>
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Full Staff Name / Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mrs. Kemi Alabi"
                  value={formDisplayName}
                  onChange={(e) => setFormDisplayName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Official College Email *</label>
                <input
                  type="email"
                  required
                  placeholder="name@bridgecollege.edu.ng"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Allocate Role *</label>
                  <select
                    value={formRoleId}
                    onChange={(e) => setFormRoleId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                  >
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Account Status</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as 'Active' | 'Suspended')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="Active">Active (Permitted to Log in)</option>
                    <option value="Suspended">Suspended (Access Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs uppercase tracking-wider"
                >
                  {editingUserId ? 'Save User Updates' : 'Create User Account'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: CREATE / EDIT ROLE & ALLOCATE MODULES            */}
      {/* ========================================================= */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-xxs font-mono font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded">
                  RBAC Role Designer
                </span>
                <h3 className="text-xl font-bold text-gray-900 mt-1">
                  {editingRoleId ? 'Edit Role & Module Allocation' : 'Create New Role & Allocate Site Modules'}
                </h3>
              </div>
              <button onClick={() => setIsRoleModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {roleModalError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{roleModalError}</span>
              </div>
            )}

            <form onSubmit={handleSaveRole} className="space-y-4 text-xs font-sans">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Role Title / Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Admissions & Records Lead"
                    value={formRoleName}
                    onChange={(e) => setFormRoleName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Role Key (Identifier)</label>
                  <input
                    type="text"
                    disabled={!!editingRoleId}
                    placeholder="e.g. admissions_lead"
                    value={formRoleKey}
                    onChange={(e) => setFormRoleKey(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl font-mono text-xs disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Role Purpose / Description</label>
                <textarea
                  rows={2}
                  placeholder="Describe what staff members with this role are responsible for..."
                  value={formRoleDesc}
                  onChange={(e) => setFormRoleDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl leading-relaxed"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Badge Color Theme</label>
                <select
                  value={formRoleColor}
                  onChange={(e) => setFormRoleColor(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl font-medium"
                >
                  <option value="teal">Teal (Clinical &amp; Health)</option>
                  <option value="amber">Amber / Gold (Executive)</option>
                  <option value="indigo">Indigo (Media &amp; Communications)</option>
                  <option value="emerald">Emerald (Academic)</option>
                  <option value="purple">Purple (Examinations &amp; CBT)</option>
                  <option value="rose">Rose / Coral (Student Affairs)</option>
                  <option value="sky">Sky Blue (Technical)</option>
                </select>
              </div>

              {/* MODULE ALLOCATION CHECKBOXES */}
              <div className="space-y-2 pt-1 border-t border-slate-100">
                <span className="font-bold text-xs text-gray-800 block">
                  Allocate Permitted Site Management Modules:
                </span>
                <p className="text-xxs text-gray-500">
                  Select which dashboard tabs and features users with this role will be able to access and edit:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  
                  {/* Careers */}
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formPermissions.canManageCareers ? 'bg-teal-50 border-teal-300 text-teal-950' : 'bg-slate-50 border-slate-200 text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formPermissions.canManageCareers}
                      onChange={() => togglePermission('canManageCareers')}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-xs">Careers &amp; Vacancy Adverts</strong>
                      <span className="text-xxs text-gray-500 block leading-tight">Create, edit, close, and publish faculty &amp; staff job openings.</span>
                    </div>
                  </label>

                  {/* Review Applications */}
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formPermissions.canReviewApplications ? 'bg-teal-50 border-teal-300 text-teal-950' : 'bg-slate-50 border-slate-200 text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formPermissions.canReviewApplications}
                      onChange={() => togglePermission('canReviewApplications')}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-xs">Applicant Dossiers &amp; CVs</strong>
                      <span className="text-xxs text-gray-500 block leading-tight">Review candidate resumes, shortlist, and add interview notes.</span>
                    </div>
                  </label>

                  {/* Adverts */}
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formPermissions.canManageAdverts ? 'bg-teal-50 border-teal-300 text-teal-950' : 'bg-slate-50 border-slate-200 text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formPermissions.canManageAdverts}
                      onChange={() => togglePermission('canManageAdverts')}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-xs">News Alert Ticker &amp; Adverts</strong>
                      <span className="text-xxs text-gray-500 block leading-tight">Manage top emergency alert bar, space rental promo, and banners.</span>
                    </div>
                  </label>

                  {/* Site Copy */}
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formPermissions.canEditCopy ? 'bg-teal-50 border-teal-300 text-teal-950' : 'bg-slate-50 border-slate-200 text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formPermissions.canEditCopy}
                      onChange={() => togglePermission('canEditCopy')}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-xs">Site Copy &amp; Text Content</strong>
                      <span className="text-xxs text-gray-500 block leading-tight">Edit homepage headlines, contact channels, and admission dates.</span>
                    </div>
                  </label>

                  {/* Media */}
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formPermissions.canManageMedia ? 'bg-teal-50 border-teal-300 text-teal-950' : 'bg-slate-50 border-slate-200 text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formPermissions.canManageMedia}
                      onChange={() => togglePermission('canManageMedia')}
                      className="mt-0.5 rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-xs">Media, Graphics &amp; Video Tour</strong>
                      <span className="text-xxs text-gray-500 block leading-tight">Update campus video walkthrough URL and photo gallery graphics.</span>
                    </div>
                  </label>

                  {/* Users & Roles Management */}
                  <label className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                    formPermissions.canManageUsersAndRoles ? 'bg-purple-50 border-purple-300 text-purple-950' : 'bg-slate-50 border-slate-200 text-gray-600'
                  }`}>
                    <input
                      type="checkbox"
                      checked={formPermissions.canManageUsersAndRoles}
                      onChange={() => togglePermission('canManageUsersAndRoles')}
                      className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <div>
                      <strong className="block text-xs">User Accounts &amp; Roles</strong>
                      <span className="text-xxs text-gray-500 block leading-tight">Add staff logins, create roles, and allocate modules.</span>
                    </div>
                  </label>

                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold rounded-xl shadow-xs uppercase tracking-wider"
                >
                  {editingRoleId ? 'Save Role Configuration' : 'Create Role'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
