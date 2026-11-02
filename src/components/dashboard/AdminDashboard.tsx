import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Megaphone, FileEdit, Video, ShieldCheck, UserCheck, 
  ArrowLeft, ExternalLink, Sparkles, CheckCircle2, ChevronDown, Lock,
  Users, KeyRound, LogIn, LogOut, AlertCircle, X, Shield, RefreshCw
} from 'lucide-react';
import { useSiteContent } from '../../hooks/useSiteContent';
import CareersTab from './CareersTab';
import AdvertsTab from './AdvertsTab';
import ContentTab from './ContentTab';
import MediaTab from './MediaTab';
import UsersAndRolesTab from './UsersAndRolesTab';
import SystemTab from './SystemTab';
import StaffLoginModal from './StaffLoginModal';
import collegeLogo from '../../assets/images/college_logo.svg';

interface AdminDashboardProps {
  onBackToSite: () => void;
  initialTab?: 'careers' | 'adverts' | 'content' | 'media' | 'users-roles' | 'system';
}

export default function AdminDashboard({ onBackToSite, initialTab = 'careers' }: AdminDashboardProps) {
  const { content, roles, users, activeUser, currentRole, userProfile, store } = useSiteContent();
  const [activeTab, setActiveTab] = useState<'careers' | 'adverts' | 'content' | 'media' | 'users-roles' | 'system'>(initialTab);

  // Staff Credentials Login Modal state (uses clean StaffLoginModal with NO demo credentials)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Auto-switch tab if current role has no permission for activeTab
  useEffect(() => {
    if (activeTab === 'careers' && !userProfile.permissions.canManageCareers && !userProfile.permissions.canReviewApplications) {
      if (userProfile.permissions.canManageUsersAndRoles) setActiveTab('users-roles');
      else if (userProfile.permissions.canManageAdverts) setActiveTab('adverts');
      else if (userProfile.permissions.canEditCopy) setActiveTab('content');
      else if (userProfile.permissions.canManageMedia) setActiveTab('media');
    } else if (activeTab === 'adverts' && !userProfile.permissions.canManageAdverts) {
      if (userProfile.permissions.canManageUsersAndRoles) setActiveTab('users-roles');
      else if (userProfile.permissions.canManageCareers) setActiveTab('careers');
      else if (userProfile.permissions.canEditCopy) setActiveTab('content');
    } else if (activeTab === 'content' && !userProfile.permissions.canEditCopy) {
      if (userProfile.permissions.canManageUsersAndRoles) setActiveTab('users-roles');
      else if (userProfile.permissions.canManageCareers) setActiveTab('careers');
      else if (userProfile.permissions.canManageAdverts) setActiveTab('adverts');
    } else if (activeTab === 'media' && !userProfile.permissions.canManageMedia) {
      if (userProfile.permissions.canManageUsersAndRoles) setActiveTab('users-roles');
      else if (userProfile.permissions.canManageCareers) setActiveTab('careers');
      else if (userProfile.permissions.canEditCopy) setActiveTab('content');
    } else if (activeTab === 'users-roles' && !userProfile.permissions.canManageUsersAndRoles) {
      if (userProfile.permissions.canManageCareers) setActiveTab('careers');
      else if (userProfile.permissions.canManageAdverts) setActiveTab('adverts');
      else if (userProfile.permissions.canEditCopy) setActiveTab('content');
    } else if (activeTab === 'system' && !userProfile.permissions.canExportReset) {
      if (userProfile.permissions.canManageUsersAndRoles) setActiveTab('users-roles');
      else if (userProfile.permissions.canManageCareers) setActiveTab('careers');
      else if (userProfile.permissions.canManageAdverts) setActiveTab('adverts');
    }
  }, [currentRole, userProfile, activeTab]);

  const activeRoleDef = roles.find(r => r.id === activeUser.roleId) || {
    id: activeUser.roleId,
    name: userProfile.roleTitle,
    badgeColor: 'amber'
  };

  // If unauthenticated, immediately display Staff sign-in modal without demo credentials
  if (!store.isAuthenticated()) {
    return (
      <div className="min-h-[80vh] bg-slate-100 flex items-center justify-center p-4">
        <StaffLoginModal
          isOpen={true}
          onClose={onBackToSite}
          onSuccess={() => {}}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-gray-800 flex flex-col font-sans" id="dashboard_root">
      
      {/* TOP DASHBOARD CONTROL NAVBAR */}
      <header className="sticky top-0 z-40 bg-teal-980 text-white border-b-4 border-amber-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* BRAND */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-white border-2 border-amber-400 p-0.5 overflow-hidden shadow-sm shrink-0">
                <img
                  src={collegeLogo}
                  alt="Bridge College"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-base sm:text-lg font-black font-display uppercase tracking-wide text-white">
                    Bridge College
                  </h1>
                  <span className="hidden sm:inline-block px-2 py-0.5 bg-amber-500 text-teal-980 text-xxs font-mono font-extrabold uppercase rounded">
                    Admin Portal
                  </span>
                </div>
                <span className="text-xxs sm:text-xs text-amber-300 font-semibold uppercase tracking-wider block">
                  Staff Role &amp; Module Allocation Suite
                </span>
              </div>
            </div>

              {/* Active Logged-in Staff Display */}
              <div className="flex items-center gap-2.5 bg-teal-900/90 border border-teal-700/80 px-3 py-1.5 rounded-xl text-xs">
                <div className="w-7 h-7 rounded-full bg-amber-500 text-teal-950 font-bold flex items-center justify-center text-xxs font-mono shrink-0 shadow-xs">
                  {userProfile.avatarText}
                </div>
                <div className="text-left leading-tight hidden sm:block">
                  <span className="block font-bold text-white text-xs truncate max-w-[140px] md:max-w-xs">{activeUser.displayName}</span>
                  <span className="block text-[10px] text-amber-300 font-mono">@{activeUser.username} &bull; {activeRoleDef.name}</span>
                </div>
              </div>

              {/* Switch Staff Account Button */}
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className="px-3 py-2 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Switch staff account"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Switch</span>
              </button>

              {/* Log Out Button */}
              <button
                onClick={() => {
                  store.logout();
                  onBackToSite();
                }}
                className="px-3 py-2 bg-red-650 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                title="Log out of Staff Portal"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>

              {/* Back to Public Site */}
              <button
                onClick={onBackToSite}
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/15 cursor-pointer"
                title="Return to public site"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Public Site</span>
              </button>

          </div>
        </div>
      </header>

      {/* DASHBOARD STATUS BAR */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-teal-700 text-white flex items-center justify-center font-mono font-bold text-xxs">
              {userProfile.avatarText}
            </div>
            <div>
              <span className="font-bold text-gray-900">{activeUser.displayName}</span>
              <span className="font-mono text-xxs text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 ml-2">
                @{activeUser.username}
              </span>
              <span className="text-gray-400 text-xxs block sm:inline sm:ml-2">
                &bull; Assigned Role: <strong className="text-teal-900">{activeRoleDef.name}</strong> ({activeUser.email})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xxs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 flex items-center gap-1 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Namecheap Compatible Store
            </span>
          </div>

        </div>
      </div>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow w-full space-y-6">
        
        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Users & Roles Manager Tab (Super Admin Feature) */}
          {userProfile.permissions.canManageUsersAndRoles && (
            <button
              onClick={() => setActiveTab('users-roles')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'users-roles'
                  ? 'bg-amber-500 text-teal-950 shadow-xs ring-2 ring-amber-400'
                  : 'text-gray-700 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4 text-teal-950" />
              Users &amp; Roles Management
              <span className="text-xxs px-1.5 py-0.5 rounded-full bg-teal-950 text-amber-300 font-mono font-bold">
                {users.length} Users &bull; {roles.length} Roles
              </span>
            </button>
          )}

          {/* Careers Tab */}
          {(userProfile.permissions.canManageCareers || userProfile.permissions.canReviewApplications) && (
            <button
              onClick={() => setActiveTab('careers')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'careers'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Careers &amp; Recruitment
              <span className="text-xxs px-1.5 py-0.5 rounded-full bg-white/20 font-mono">
                {content.jobs.length}
              </span>
            </button>
          )}

          {/* Adverts Tab */}
          {userProfile.permissions.canManageAdverts && (
            <button
              onClick={() => setActiveTab('adverts')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'adverts'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <Megaphone className="w-4 h-4" />
              Adverts &amp; Announcements
            </button>
          )}

          {/* Content Tab */}
          {userProfile.permissions.canEditCopy && (
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <FileEdit className="w-4 h-4" />
              Site Text &amp; Copy
            </button>
          )}

          {/* Media Tab */}
          {userProfile.permissions.canManageMedia && (
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'media'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <Video className="w-4 h-4" />
              Media, Graphics &amp; Videos
            </button>
          )}

          {/* System Tab */}
          {userProfile.permissions.canExportReset && (
            <button
              onClick={() => setActiveTab('system')}
              className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'system'
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              System &amp; Backups
            </button>
          )}

        </div>

        {/* ACTIVE TAB CONTAINER */}
        <div className="animate-fadeIn">
          
          {/* USERS & ROLES MANAGER TAB */}
          {activeTab === 'users-roles' && userProfile.permissions.canManageUsersAndRoles && (
            <UsersAndRolesTab
              roles={roles}
              users={users}
              activeUserId={activeUser.id}
              canManageUsersAndRoles={userProfile.permissions.canManageUsersAndRoles}
            />
          )}

          {activeTab === 'careers' && (userProfile.permissions.canManageCareers || userProfile.permissions.canReviewApplications) && (
            <CareersTab
              jobs={content.jobs}
              applications={content.applications}
              canManageCareers={userProfile.permissions.canManageCareers}
              canReviewApplications={userProfile.permissions.canReviewApplications}
            />
          )}

          {activeTab === 'adverts' && userProfile.permissions.canManageAdverts && (
            <AdvertsTab
              ticker={content.ticker}
              spaceRentalBar={content.spaceRentalBar}
              promoBanners={content.promoBanners}
              canManageAdverts={userProfile.permissions.canManageAdverts}
            />
          )}

          {activeTab === 'content' && userProfile.permissions.canEditCopy && (
            <ContentTab
              siteCopy={content.siteCopy}
              canEditCopy={userProfile.permissions.canEditCopy}
            />
          )}

          {activeTab === 'media' && userProfile.permissions.canManageMedia && (
            <MediaTab
              videoConfig={content.videoConfig}
              mediaItems={content.mediaItems}
              canManageMedia={userProfile.permissions.canManageMedia}
            />
          )}

          {activeTab === 'system' && userProfile.permissions.canExportReset && (
            <SystemTab
              currentRole={currentRole}
              canExportReset={userProfile.permissions.canExportReset}
            />
          )}
        </div>

      </main>

      {/* STAFF USERNAME & PASSWORD SIGN-IN MODAL (NO DEMO CREDENTIALS) */}
      <StaffLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={() => setIsLoginModalOpen(false)}
      />

    </div>
  );
}
