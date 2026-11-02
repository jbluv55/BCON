import React, { useState } from 'react';
import { 
  Bell, Building2, Plus, Edit3, Trash2, Eye, EyeOff, Save, CheckCircle2, 
  Megaphone, AlertCircle, ArrowRight, Tag
} from 'lucide-react';
import { TopTickerConfig, SpaceRentalBarConfig, PromoBanner, siteContentStore } from '../../services/siteContentStore';

interface AdvertsTabProps {
  ticker: TopTickerConfig;
  spaceRentalBar: SpaceRentalBarConfig;
  promoBanners: PromoBanner[];
  canManageAdverts: boolean;
}

export default function AdvertsTab({ 
  ticker, 
  spaceRentalBar, 
  promoBanners, 
  canManageAdverts 
}: AdvertsTabProps) {
  // Ticker form state
  const [tickerEnabled, setTickerEnabled] = useState(ticker.enabled);
  const [tickerBadge, setTickerBadge] = useState(ticker.badge);
  const [tickerText, setTickerText] = useState(ticker.text);
  const [tickerActionText, setTickerActionText] = useState(ticker.actionText);
  const [tickerActionTarget, setTickerActionTarget] = useState(ticker.actionTarget);
  const [tickerSavedToast, setTickerSavedToast] = useState(false);

  // Space rental bar state
  const [spaceEnabled, setSpaceEnabled] = useState(spaceRentalBar.enabled);
  const [spaceHeadline, setSpaceHeadline] = useState(spaceRentalBar.headline);
  const [spaceSubtext, setSpaceSubtext] = useState(spaceRentalBar.subtext);
  const [spaceBadge, setSpaceBadge] = useState(spaceRentalBar.badge);
  const [spaceSavedToast, setSpaceSavedToast] = useState(false);

  // Promo banner modal
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerContent, setBannerContent] = useState('');
  const [bannerBadge, setBannerBadge] = useState('Announcement');
  const [bannerBadgeColor, setBannerBadgeColor] = useState('amber');
  const [bannerActionLabel, setBannerActionLabel] = useState('Learn More');
  const [bannerActionTarget, setBannerActionTarget] = useState('admissions');

  const handleSaveTicker = (e: React.FormEvent) => {
    e.preventDefault();
    siteContentStore.updateTicker({
      enabled: tickerEnabled,
      badge: tickerBadge,
      text: tickerText,
      actionText: tickerActionText,
      actionTarget: tickerActionTarget
    });
    setTickerSavedToast(true);
    setTimeout(() => setTickerSavedToast(false), 2500);
  };

  const handleSaveSpaceBar = (e: React.FormEvent) => {
    e.preventDefault();
    siteContentStore.updateSpaceRentalBar({
      enabled: spaceEnabled,
      headline: spaceHeadline,
      subtext: spaceSubtext,
      badge: spaceBadge
    });
    setSpaceSavedToast(true);
    setTimeout(() => setSpaceSavedToast(false), 2500);
  };

  const handleOpenCreateBanner = () => {
    setEditingBannerId(null);
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerContent('');
    setBannerBadge('Campus Notice');
    setBannerBadgeColor('amber');
    setBannerActionLabel('View Details');
    setBannerActionTarget('admissions');
    setIsBannerModalOpen(true);
  };

  const handleOpenEditBanner = (b: PromoBanner) => {
    setEditingBannerId(b.id);
    setBannerTitle(b.title);
    setBannerSubtitle(b.subtitle);
    setBannerContent(b.content);
    setBannerBadge(b.badge);
    setBannerBadgeColor(b.badgeColor);
    setBannerActionLabel(b.actionLabel);
    setBannerActionTarget(b.actionTarget);
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerContent.trim()) return;

    if (editingBannerId) {
      siteContentStore.updatePromoBanner(editingBannerId, {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        content: bannerContent,
        badge: bannerBadge,
        badgeColor: bannerBadgeColor,
        actionLabel: bannerActionLabel,
        actionTarget: bannerActionTarget
      });
    } else {
      siteContentStore.addPromoBanner({
        title: bannerTitle,
        subtitle: bannerSubtitle,
        content: bannerContent,
        badge: bannerBadge,
        badgeColor: bannerBadgeColor,
        actionLabel: bannerActionLabel,
        actionTarget: bannerActionTarget,
        active: true
      });
    }
    setIsBannerModalOpen(false);
  };

  const handleToggleBannerActive = (b: PromoBanner) => {
    siteContentStore.updatePromoBanner(b.id, { active: !b.active });
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('Delete this promo banner advert?')) {
      siteContentStore.deletePromoBanner(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: TOP NEWS & EMERGENCY ALERT TICKER */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-teal-50 text-teal-800 rounded-xl flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Top Header News &amp; Admission Alert Bar</h3>
              <p className="text-xs text-gray-500">
                Small horizontal marquee/ticker situated immediately below the main navbar.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={tickerEnabled}
              onChange={(e) => setTickerEnabled(e.target.checked)}
              disabled={!canManageAdverts}
              className="rounded text-teal-600 focus:ring-teal-500 w-4 h-4"
            />
            <span>{tickerEnabled ? 'Active (Displaying)' : 'Disabled (Hidden)'}</span>
          </label>
        </div>

        {/* Live Preview */}
        <div className="space-y-1.5">
          <span className="text-xxs font-mono font-bold uppercase tracking-wider text-gray-400">Live Preview:</span>
          {tickerEnabled ? (
            <div className="bg-gradient-to-r from-teal-900 to-teal-980 text-teal-100 py-2.5 px-4 rounded-xl border-b border-amber-500 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate">
                <span className="px-2 py-0.5 bg-amber-500 text-teal-950 font-bold font-mono text-xxs rounded">
                  {tickerBadge}
                </span>
                <span className="font-semibold truncate">{tickerText}</span>
              </div>
              <span className="text-amber-400 font-bold underline shrink-0 font-mono text-xxs">
                {tickerActionText}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-gray-400 italic">
              Ticker is currently switched OFF and will not display to website visitors.
            </div>
          )}
        </div>

        {/* Form controls */}
        {canManageAdverts && (
          <form onSubmit={handleSaveTicker} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans pt-2">
            <div className="md:col-span-3">
              <label className="font-semibold block mb-1 text-gray-700">Badge Label</label>
              <input
                type="text"
                value={tickerBadge}
                onChange={(e) => setTickerBadge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-6">
              <label className="font-semibold block mb-1 text-gray-700">Announcement Headline Text</label>
              <input
                type="text"
                value={tickerText}
                onChange={(e) => setTickerText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-3">
              <label className="font-semibold block mb-1 text-gray-700">Action Button Text</label>
              <input
                type="text"
                value={tickerActionText}
                onChange={(e) => setTickerActionText(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-6">
              <label className="font-semibold block mb-1 text-gray-700">Click Destination</label>
              <select
                value={tickerActionTarget}
                onChange={(e) => setTickerActionTarget(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              >
                <option value="admissions">Admissions Portal / Application Form</option>
                <option value="programs">Academic Programmes</option>
                <option value="careers">Careers / Job Opportunities</option>
                <option value="space-rental">Spaces for Rent (Commercial)</option>
                <option value="contact">Contact &amp; Location</option>
              </select>
            </div>

            <div className="md:col-span-6 flex items-end justify-end gap-3">
              {tickerSavedToast && (
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" /> Ticker Updated Live!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Ticker
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 2: SPACE RENTAL HORIZONTAL ADVERT BAR */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Commercial Space Rental Advert Bar</h3>
              <p className="text-xs text-gray-500">
                Gold horizontal bar placed below the News Alert ticker that opens the full Space Rental showcase page.
              </p>
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-700 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={spaceEnabled}
              onChange={(e) => setSpaceEnabled(e.target.checked)}
              disabled={!canManageAdverts}
              className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
            />
            <span>{spaceEnabled ? 'Active (Displaying)' : 'Disabled (Hidden)'}</span>
          </label>
        </div>

        {/* Live Preview */}
        <div className="space-y-1.5">
          <span className="text-xxs font-mono font-bold uppercase tracking-wider text-gray-400">Live Preview:</span>
          {spaceEnabled ? (
            <div className="bg-gradient-to-r from-amber-500 via-amber-450 to-amber-500 text-teal-950 py-2.5 px-4 rounded-xl border-b border-amber-600 shadow-xs flex items-center justify-between text-xs sm:text-sm font-bold">
              <div className="flex items-center gap-2 truncate">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-teal-950 text-amber-400 text-xxs">
                  <Building2 className="w-3 h-3" />
                </span>
                <span className="truncate">{spaceHeadline} <span className="underline decoration-teal-950/40">{spaceSubtext}</span></span>
              </div>
              <span className="text-xxs font-mono font-extrabold uppercase bg-teal-950 text-white px-2.5 py-1 rounded-full shrink-0">
                {spaceBadge}
              </span>
            </div>
          ) : (
            <div className="p-3 bg-slate-100 rounded-xl text-center text-xs text-gray-400 italic">
              Space Rental bar is currently hidden.
            </div>
          )}
        </div>

        {/* Form controls */}
        {canManageAdverts && (
          <form onSubmit={handleSaveSpaceBar} className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-sans pt-2">
            <div className="md:col-span-5">
              <label className="font-semibold block mb-1 text-gray-700">Main Headline</label>
              <input
                type="text"
                value={spaceHeadline}
                onChange={(e) => setSpaceHeadline(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-4">
              <label className="font-semibold block mb-1 text-gray-700">Subtext / CTA Prompt</label>
              <input
                type="text"
                value={spaceSubtext}
                onChange={(e) => setSpaceSubtext(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-3">
              <label className="font-semibold block mb-1 text-gray-700">Side Badge Text</label>
              <input
                type="text"
                value={spaceBadge}
                onChange={(e) => setSpaceBadge(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div className="md:col-span-12 flex items-center justify-end gap-3 pt-2">
              {spaceSavedToast && (
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" /> Space Rental Bar Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold rounded-xl shadow-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Save Space Bar
              </button>
            </div>
          </form>
        )}
      </div>

      {/* SECTION 3: PROMO ADVERT BANNERS / NOTICES */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Promotional Cards &amp; Admission Flyers</h3>
            <p className="text-xs text-gray-500">
              Interactive promotional cards displayed across the campus homepage and portals.
            </p>
          </div>

          {canManageAdverts && (
            <button
              onClick={handleOpenCreateBanner}
              className="px-4 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Promo Banner
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {promoBanners.map((banner) => (
            <div
              key={banner.id}
              className={`p-5 rounded-2xl border transition-all ${
                banner.active ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-50 border-dashed border-slate-300 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className={`text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                  banner.badgeColor === 'amber' ? 'bg-amber-100 text-amber-800' : 'bg-teal-100 text-teal-800'
                }`}>
                  {banner.badge}
                </span>

                <div className="flex items-center gap-1">
                  {canManageAdverts && (
                    <>
                      <button
                        onClick={() => handleToggleBannerActive(banner)}
                        className="p-1.5 text-gray-500 hover:text-gray-800 rounded"
                        title={banner.active ? 'Hide banner' : 'Publish banner'}
                      >
                        {banner.active ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleOpenEditBanner(banner)}
                        className="p-1.5 text-teal-700 hover:text-teal-900 rounded"
                        title="Edit banner"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded"
                        title="Delete banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              <h4 className="text-sm font-bold text-gray-900">{banner.title}</h4>
              <p className="text-xxs text-amber-700 font-semibold uppercase">{banner.subtitle}</p>
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">{banner.content}</p>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-xxs text-gray-400 font-mono">Target: #{banner.actionTarget}</span>
                <span className="text-teal-700 font-bold flex items-center gap-1">
                  {banner.actionLabel} &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT PROMO BANNER MODAL */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-bold text-gray-900">
              {editingBannerId ? 'Edit Promotional Card' : 'Create New Promotional Banner'}
            </h3>

            <form onSubmit={handleSaveBanner} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Headline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2026/2027 Admissions Screening Date"
                  value={bannerTitle}
                  onChange={(e) => setBannerTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Sub-headline</label>
                <input
                  type="text"
                  placeholder="e.g. Registered Nursing (RN) &amp; Midwifery (RM)"
                  value={bannerSubtitle}
                  onChange={(e) => setBannerSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Content Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of the announcement or promotional notice..."
                  value={bannerContent}
                  onChange={(e) => setBannerContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Badge Text</label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={(e) => setBannerBadge(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Badge Color</label>
                  <select
                    value={bannerBadgeColor}
                    onChange={(e) => setBannerBadgeColor(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="amber">Amber / Gold</option>
                    <option value="teal">Teal / Emerald</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Action Button Text</label>
                  <input
                    type="text"
                    value={bannerActionLabel}
                    onChange={(e) => setBannerActionLabel(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1 text-gray-700">Target Page</label>
                  <select
                    value={bannerActionTarget}
                    onChange={(e) => setBannerActionTarget(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                  >
                    <option value="admissions">Admissions</option>
                    <option value="programs">Programmes</option>
                    <option value="careers">Careers</option>
                    <option value="space-rental">Space Rentals</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsBannerModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
