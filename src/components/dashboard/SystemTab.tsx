import React, { useState } from 'react';
import { 
  Download, Upload, RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle, 
  FileText, Database, Server
} from 'lucide-react';
import { siteContentStore, StaffRole, ROLE_CONFIGS } from '../../services/siteContentStore';

interface SystemTabProps {
  currentRole: StaffRole;
  canExportReset: boolean;
}

export default function SystemTab({ currentRole, canExportReset }: SystemTabProps) {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const jsonStr = siteContentStore.exportBackupJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bridge_college_site_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          const success = siteContentStore.importBackupJson(content);
          if (success) {
            setImportStatus('Backup JSON successfully restored into live site storage!');
          } else {
            setImportStatus('Failed to restore backup: invalid JSON format.');
          }
          setTimeout(() => setImportStatus(null), 4000);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Warning: This will reset all customized careers, adverts, text copy, and graphics back to the factory institutional defaults. Do you want to proceed?')) {
      siteContentStore.resetToDefaults();
      alert('System successfully restored to default settings.');
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. ROLES & PERMISSIONS DIRECTORY */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <ShieldCheck className="w-5 h-5 text-teal-700" />
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Role-Based Access Control (RBAC) Matrix
          </h4>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Authorized staff members have scoped privileges according to their department functions:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {siteContentStore.getRoles().map((role) => {
            const isCurrent = currentRole === role.id;
            const initials = role.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
            return (
              <div
                key={role.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent ? 'bg-teal-50 border-teal-400 ring-2 ring-teal-500/20' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-teal-950 text-white rounded">
                    {initials}
                  </span>
                  {isCurrent && (
                    <span className="text-xxs font-mono font-bold text-teal-800 bg-teal-200/60 px-2 py-0.5 rounded">
                      Active
                    </span>
                  )}
                </div>

                <h5 className="text-xs font-bold text-gray-900">{role.name}</h5>
                <p className="text-xxs text-gray-500 mt-1 line-clamp-2">{role.description}</p>

                <ul className="mt-3 space-y-1 text-xxs text-gray-600 border-t border-slate-200/60 pt-2 font-mono">
                  <li>Careers: {role.permissions.canManageCareers ? '✓ Full' : '✗ No'}</li>
                  <li>Applicants: {role.permissions.canReviewApplications ? '✓ Full' : '✗ No'}</li>
                  <li>Adverts: {role.permissions.canManageAdverts ? '✓ Full' : '✗ No'}</li>
                  <li>Site Copy: {role.permissions.canEditCopy ? '✓ Full' : '✗ No'}</li>
                  <li>Media/Video: {role.permissions.canManageMedia ? '✓ Full' : '✗ No'}</li>
                  <li>Users &amp; Roles: {role.permissions.canManageUsersAndRoles ? '✓ Full' : '✗ No'}</li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. BACKUP & DATA PERSISTENCE */}
      {canExportReset && (
        <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Database className="w-5 h-5 text-indigo-600" />
            <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
              Site Data Backup &amp; Portability (Namecheap Compatible)
            </h4>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            All modifications you make across Careers, Adverts, Text, and Media are stored persistently in browser storage. You can export a full JSON snapshot of your changes to back them up, share them across administrators, or transfer them to another device.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Export */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Download className="w-4 h-4 text-teal-700" />
                Export Site Configuration
              </h5>
              <p className="text-xxs text-gray-500 leading-relaxed">
                Download a complete `.json` file containing all career adverts, candidate applications, top tickers, and copy adjustments.
              </p>
              <button
                onClick={handleDownloadBackup}
                className="w-full py-2 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download JSON Backup
              </button>
            </div>

            {/* Import */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold text-gray-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-indigo-700" />
                Restore from Backup JSON
              </h5>
              <p className="text-xxs text-gray-500 leading-relaxed">
                Upload a previously saved `.json` file to restore all website content instantly.
              </p>
              <input
                type="file"
                id="restore-json-input"
                accept=".json"
                onChange={handleImportFile}
                className="hidden"
              />
              <label
                htmlFor="restore-json-input"
                className="w-full py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer text-center"
              >
                <Upload className="w-4 h-4" />
                Select Backup File
              </label>
            </div>

          </div>

          {importStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4" />
              {importStatus}
            </div>
          )}

          {/* Factory Reset */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-gray-500">
              Want to discard all changes and start fresh with official college seed data?
            </div>
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restore Original Seed Data
            </button>
          </div>

        </div>
      )}

    </div>
  );
}
