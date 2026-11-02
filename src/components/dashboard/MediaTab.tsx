import React, { useState } from 'react';
import { 
  Video, Image as ImageIcon, Plus, Edit3, Trash2, Save, CheckCircle2, 
  ExternalLink, Upload, Star, Play
} from 'lucide-react';
import { MediaVideoConfig, EditableMediaItem, siteContentStore } from '../../services/siteContentStore';

interface MediaTabProps {
  videoConfig: MediaVideoConfig;
  mediaItems: EditableMediaItem[];
  canManageMedia: boolean;
}

export default function MediaTab({ videoConfig, mediaItems, canManageMedia }: MediaTabProps) {
  // Video config state
  const [videoTitle, setVideoTitle] = useState(videoConfig.title);
  const [videoCaption, setVideoCaption] = useState(videoConfig.caption);
  const [videoUrl, setVideoUrl] = useState(videoConfig.videoUrl || '');
  const [videoSavedToast, setVideoSavedToast] = useState(false);

  // Media items modal state
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [editingMediaId, setEditingMediaId] = useState<string | null>(null);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaCategory, setMediaCategory] = useState<EditableMediaItem['category']>('Building');
  const [mediaDescription, setMediaDescription] = useState('');
  const [mediaImageUrl, setMediaImageUrl] = useState('');
  const [mediaFeatured, setMediaFeatured] = useState(true);

  const handleSaveVideo = (e: React.FormEvent) => {
    e.preventDefault();
    siteContentStore.updateVideoConfig({
      title: videoTitle,
      caption: videoCaption,
      videoUrl: videoUrl.trim()
    });
    setVideoSavedToast(true);
    setTimeout(() => setVideoSavedToast(false), 2500);
  };

  const handleOpenAddMedia = () => {
    setEditingMediaId(null);
    setMediaTitle('');
    setMediaCategory('Building');
    setMediaDescription('');
    setMediaImageUrl('');
    setMediaFeatured(true);
    setIsMediaModalOpen(true);
  };

  const handleOpenEditMedia = (item: EditableMediaItem) => {
    setEditingMediaId(item.id);
    setMediaTitle(item.title);
    setMediaCategory(item.category);
    setMediaDescription(item.description);
    setMediaImageUrl(item.imageUrl);
    setMediaFeatured(!!item.featured);
    setIsMediaModalOpen(true);
  };

  const handleSaveMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim() || !mediaImageUrl.trim()) return;

    if (editingMediaId) {
      siteContentStore.updateMediaItem(editingMediaId, {
        title: mediaTitle,
        category: mediaCategory,
        description: mediaDescription,
        imageUrl: mediaImageUrl,
        featured: mediaFeatured
      });
    } else {
      siteContentStore.addMediaItem({
        title: mediaTitle,
        category: mediaCategory,
        description: mediaDescription,
        imageUrl: mediaImageUrl,
        featured: mediaFeatured
      });
    }

    setIsMediaModalOpen(false);
  };

  const handleDeleteMedia = (id: string, title: string) => {
    if (confirm(`Remove "${title}" from the campus graphics gallery?`)) {
      siteContentStore.deleteMediaItem(id);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* SECTION 1: CAMPUS TOUR VIDEO CONTROLS */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <div className="w-9 h-9 bg-teal-50 text-teal-800 rounded-xl flex items-center justify-center">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Campus Video Tour Management</h3>
            <p className="text-xs text-gray-500">
              Manage the embedded campus walkthrough tour video shown on the homepage and about section.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveVideo} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold block mb-1 text-gray-700">Video Title</label>
              <input
                type="text"
                disabled={!canManageMedia}
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-gray-700">Custom Video Source / URL</label>
              <input
                type="text"
                disabled={!canManageMedia}
                placeholder="Leave blank to use default built-in college_tour.mp4, or provide custom MP4/video link"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold block mb-1 text-gray-700">Video Caption / Description</label>
            <input
              type="text"
              disabled={!canManageMedia}
              value={videoCaption}
              onChange={(e) => setVideoCaption(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl"
            />
          </div>

          {canManageMedia && (
            <div className="flex items-center justify-end gap-3 pt-1">
              {videoSavedToast && (
                <span className="text-emerald-700 text-xs font-semibold flex items-center gap-1 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4" /> Video Configuration Saved!
                </span>
              )}
              <button
                type="submit"
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs uppercase tracking-wider flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                Update Video Tour
              </button>
            </div>
          )}
        </form>
      </div>

      {/* SECTION 2: CAMPUS GRAPHICS & GALLERY */}
      <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-gray-900">Campus Photos &amp; Graphics Gallery</h3>
            <p className="text-xs text-gray-500">
              Manage clinical labs, lecture halls, and exterior building imagery displayed across the campus tour.
            </p>
          </div>

          {canManageMedia && (
            <button
              onClick={handleOpenAddMedia}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-teal-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add Campus Photo / Graphic
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mediaItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-xxs font-mono font-bold uppercase tracking-wider px-2 py-0.5 bg-black/60 text-white rounded">
                    {item.category}
                  </span>
                  {item.featured && (
                    <span className="absolute top-2 right-2 p-1 bg-amber-500 text-teal-950 rounded-full" title="Featured item">
                      <Star className="w-3 h-3 fill-current" />
                    </span>
                  )}
                </div>

                <div className="p-4 space-y-1">
                  <h4 className="text-sm font-bold text-gray-900">{item.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{item.description}</p>
                </div>
              </div>

              {canManageMedia && (
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleOpenEditMedia(item)}
                    className="p-1.5 text-teal-700 hover:bg-teal-50 rounded"
                    title="Edit Photo Info"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(item.id, item.title)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    title="Remove Photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CREATE / EDIT MEDIA MODAL */}
      {isMediaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-bold text-gray-900">
              {editingMediaId ? 'Edit Graphic Information' : 'Add New Campus Photo / Graphic'}
            </h3>

            <form onSubmit={handleSaveMedia} className="space-y-3 text-xs font-sans">
              <div>
                <label className="font-semibold block mb-1 text-gray-700">Photo Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Clinical Nursing Simulation Ward"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Category</label>
                <select
                  value={mediaCategory}
                  onChange={(e) => setMediaCategory(e.target.value as EditableMediaItem['category'])}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                >
                  <option value="Building">Building / Campus Grounds</option>
                  <option value="Labs">Clinical Labs &amp; Wards</option>
                  <option value="ICT Room">ICT &amp; CBT Suite</option>
                  <option value="Lecture Halls">Lecture Halls</option>
                  <option value="Library">Library</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of facility shown..."
                  value={mediaDescription}
                  onChange={(e) => setMediaDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1 text-gray-700">Image Source URL or Local Upload *</label>
                <input
                  type="text"
                  required
                  placeholder="https://... or choose file below"
                  value={mediaImageUrl}
                  onChange={(e) => setMediaImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl"
                />
              </div>

              {/* File upload simulator / reader */}
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-3 text-center space-y-1">
                <input
                  type="file"
                  id="media-file-input"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="media-file-input"
                  className="inline-block px-3 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-gray-700 hover:bg-slate-100 cursor-pointer"
                >
                  Or Select Local Graphic File
                </label>
                <p className="text-xxs text-gray-400">JPG, PNG, WebP supported</p>
              </div>

              {mediaImageUrl && (
                <div className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img src={mediaImageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsMediaModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Graphic
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
