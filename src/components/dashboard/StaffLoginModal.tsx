import React, { useState } from 'react';
import { Lock, User, Eye, EyeOff, AlertCircle, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { siteContentStore } from '../../services/siteContentStore';
import collegeLogo from '../../assets/images/college_logo.svg';

interface StaffLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function StaffLoginModal({ isOpen, onClose, onSuccess }: StaffLoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!username.trim() || !password.trim()) {
      setErrorMsg('Please enter both your staff username and password.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const result = siteContentStore.loginWithCredentials(username.trim(), password.trim());
      setIsSubmitting(false);

      if (!result.success) {
        setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
      } else {
        setUsername('');
        setPassword('');
        setErrorMsg(null);
        onSuccess();
      }
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border-2 border-teal-900/10 space-y-6 relative overflow-hidden">
        
        {/* Top Gold Trim Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-slate-100 transition-colors"
          title="Cancel and return to site"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-amber-400 p-1 mx-auto shadow-md overflow-hidden">
            <img
              src={collegeLogo}
              alt="Bridge College"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <span className="text-xxs font-mono font-extrabold uppercase tracking-widest text-[#b45309] block">
              Bridge College of Nursing &amp; Health Sciences
            </span>
            <h2 className="text-2xl font-black font-display text-teal-950 uppercase tracking-tight mt-0.5">
              Staff Portal Sign-In
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed mt-1 font-sans">
              Enter your official staff credentials to access your authorized administrative dashboard.
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          
          {/* Username Field */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Staff Username *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                autoFocus
                autoCapitalize="none"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none focus:border-teal-600 transition-all bg-slate-50/50"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="text-xs font-bold text-gray-800 block mb-1">
              Staff Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-300 rounded-xl text-xs font-mono focus:ring-2 focus:ring-teal-600 focus:outline-none focus:border-teal-600 transition-all bg-slate-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-700 transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 text-xxs text-gray-400 font-mono pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span>Authorized institutional personnel only. Role modules are allocated upon login.</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-teal-800 to-teal-950 hover:from-teal-850 hover:to-teal-980 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 border-b-2 border-amber-500 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Authenticating Staff...</span>
              ) : (
                <>
                  <span>Sign In &amp; Access Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-amber-400" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2 text-xs font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              Cancel &amp; Return to Website
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
