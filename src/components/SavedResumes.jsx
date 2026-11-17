import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Save,
  Check,
  Trash2,
  Copy,
  Edit2,
  Download,
  Calendar,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';

export default function SavedResumes({
  savedProfiles,
  activeProfileId,
  currentResume,
  onSaveCurrent,
  onUpdateActive,
  onLoadProfile,
  onDeleteProfile,
  onDuplicateProfile,
  onRenameProfile
}) {
  const [newTitle, setNewTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onSaveCurrent(newTitle.trim());
    setNewTitle('');
    setIsCreating(false);
  };

  const handleStartRename = (profile) => {
    setEditingId(profile.id);
    setEditingTitle(profile.title);
  };

  const handleSaveRename = (id) => {
    if (editingTitle.trim()) {
      onRenameProfile(id, editingTitle.trim());
    }
    setEditingId(null);
  };

  const handleExportProfileJson = (profile) => {
    const blob = new Blob([JSON.stringify(profile.data, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${profile.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="saved-resumes-container">
      {/* Top Banner / Actions */}
      <div className="saved-resumes-header">
        <div className="saved-header-info">
          <h3>Saved Resume Profiles</h3>
          <span>Switch, duplicate, or save tailored versions</span>
        </div>

        <div className="saved-header-actions">
          <button
            type="button"
            className="saved-action-btn primary"
            onClick={() => setIsCreating(true)}
            title="Save your current edits as a new named version"
          >
            <Plus size={14} />
            <span>Save As New Version</span>
          </button>
        </div>
      </div>

      {/* Quick update active profile button */}
      <div className="saved-quick-update-box">
        <div className="quick-update-text">
          <span>Active Profile:</span>
          <strong>
            {savedProfiles.find((p) => p.id === activeProfileId)?.title || 'Current Working Resume'}
          </strong>
        </div>
        <button
          type="button"
          className="saved-action-btn"
          onClick={onUpdateActive}
          title="Save changes to current profile"
        >
          <Save size={13} />
          <span>Save Changes to Profile</span>
        </button>
      </div>

      {/* Inline Create Form Modal */}
      {isCreating && (
        <form className="saved-create-form" onSubmit={handleCreateSubmit}>
          <label className="form-label">
            Version Name
            <span className="form-label-hint">e.g. "Senior Backend - Stripe JD"</span>
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              autoFocus
              className="form-input"
              placeholder="e.g. Harshit - Staff Engineer (AWS)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <button type="submit" className="saved-action-btn primary">
              <Check size={14} /> Save
            </button>
            <button
              type="button"
              className="saved-action-btn"
              onClick={() => setIsCreating(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* List of Saved Profiles */}
      <div className="saved-profiles-list">
        {savedProfiles.map((profile) => {
          const isActive = profile.id === activeProfileId;
          const expCount = profile.data?.experiences?.length || 0;
          const projCount = profile.data?.projects?.length || 0;
          const lastUpdated = new Date(profile.updatedAt || Date.now()).toLocaleDateString(
            undefined,
            { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
          );

          return (
            <div
              key={profile.id}
              className={`saved-profile-card ${isActive ? 'is-active-card' : ''}`}
            >
              <div className="saved-card-header">
                <div className="saved-card-title-wrap">
                  {editingId === profile.id ? (
                    <div style={{ display: 'flex', gap: '6px', width: '100%' }}>
                      <input
                        type="text"
                        className="form-input"
                        style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                        value={editingTitle}
                        onChange={(e) => setEditingTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveRename(profile.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="btn-icon-save"
                        onClick={() => handleSaveRename(profile.id)}
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <h4 className="saved-card-title">{profile.title}</h4>
                      {isActive && (
                        <span className="saved-badge-active">
                          <Check size={10} /> Active
                        </span>
                      )}
                    </>
                  )}
                </div>

                {editingId !== profile.id && (
                  <button
                    type="button"
                    className="btn-icon-subtle"
                    onClick={() => handleStartRename(profile)}
                    title="Rename version"
                  >
                    <Edit2 size={13} />
                  </button>
                )}
              </div>

              <div className="saved-card-meta">
                <span>
                  <Briefcase size={12} /> {expCount} {expCount === 1 ? 'Job' : 'Jobs'}
                </span>
                {projCount > 0 && (
                  <span>
                    <Layers size={12} /> {projCount} {projCount === 1 ? 'Project' : 'Projects'}
                  </span>
                )}
                <span>
                  <Calendar size={12} /> {lastUpdated}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="saved-card-actions">
                <button
                  type="button"
                  className={`saved-btn-load ${isActive ? 'btn-loaded' : ''}`}
                  onClick={() => onLoadProfile(profile.id)}
                  disabled={isActive}
                  title={isActive ? 'Currently loaded' : 'Load this resume profile'}
                >
                  <FolderOpen size={13} />
                  <span>{isActive ? 'Currently Loaded' : 'Load Resume'}</span>
                </button>

                <button
                  type="button"
                  className="saved-btn-icon"
                  onClick={() => onDuplicateProfile(profile.id)}
                  title="Duplicate this version"
                >
                  <Copy size={13} />
                </button>

                <button
                  type="button"
                  className="saved-btn-icon"
                  onClick={() => handleExportProfileJson(profile)}
                  title="Export this version as JSON"
                >
                  <Download size={13} />
                </button>

                {savedProfiles.length > 1 && (
                  <button
                    type="button"
                    className="saved-btn-icon danger"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete "${profile.title}"? This action cannot be undone.`
                        )
                      ) {
                        onDeleteProfile(profile.id);
                      }
                    }}
                    title="Delete version"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
