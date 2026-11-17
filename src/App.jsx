import React, { useState, useEffect, useCallback } from 'react';
import ResumeForm from './components/ResumeForm';
import ResumePreview from './components/ResumePreview';
import Toolbar from './components/Toolbar';
import { initialResumeData } from './data/sampleData';
import { printResume } from './utils/printResume';

export default function App() {
  // Load saved resume profiles from localStorage or seed with default
  const [savedProfiles, setSavedProfiles] = useState(() => {
    const saved = localStorage.getItem('saved_resume_profiles');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      } catch (e) {
        console.error('Failed to parse saved resume profiles:', e);
      }
    }
    return [
      {
        id: 'profile-default',
        title: 'Default - Harshit Vasu',
        updatedAt: new Date().toISOString(),
        data: initialResumeData
      }
    ];
  });

  const [activeProfileId, setActiveProfileId] = useState(() => {
    return localStorage.getItem('active_resume_profile_id') || 'profile-default';
  });

  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem('resume_pdf_maker_data');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          parsed?.personalInfo?.fullName === 'ALEXANDER MORGAN' ||
          !parsed?.projects
        ) {
          return initialResumeData;
        }
        return parsed;
      } catch (e) {
        return initialResumeData;
      }
    }
    return initialResumeData;
  });

  const [activeTab, setActiveTab] = useState('form');
  const [zoom, setZoom] = useState(0.85);
  const [overflowStatus, setOverflowStatus] = useState(null);

  // Persist current resume edits to localStorage
  useEffect(() => {
    localStorage.setItem('resume_pdf_maker_data', JSON.stringify(resumeData));
  }, [resumeData]);

  // Persist savedProfiles and activeProfileId to localStorage
  useEffect(() => {
    localStorage.setItem('saved_resume_profiles', JSON.stringify(savedProfiles));
  }, [savedProfiles]);

  useEffect(() => {
    localStorage.setItem('active_resume_profile_id', activeProfileId);
  }, [activeProfileId]);

  // Dynamically calculate comfortable zoom on initial load
  useEffect(() => {
    const computeFitZoom = () => {
      const viewportHeight = window.innerHeight - 80;
      const targetHeight = 1123;
      const calculatedZoom = Math.min(1.0, Math.max(0.55, viewportHeight / targetHeight));
      setZoom(Number(calculatedZoom.toFixed(2)));
    };

    computeFitZoom();
  }, []);

  // Save Current Resume as New Profile
  const handleSaveCurrentProfile = (title, optionalData) => {
    const newId = 'profile-' + Date.now();
    const newProfile = {
      id: newId,
      title: title || 'New Resume Version',
      updatedAt: new Date().toISOString(),
      data: optionalData || resumeData
    };

    setSavedProfiles((prev) => [newProfile, ...prev]);
    setActiveProfileId(newId);
    if (optionalData) {
      setResumeData(optionalData);
    }
  };

  // Update existing active profile with latest edits
  const handleUpdateActiveProfile = () => {
    setSavedProfiles((prev) =>
      prev.map((profile) =>
        profile.id === activeProfileId
          ? {
              ...profile,
              updatedAt: new Date().toISOString(),
              data: resumeData
            }
          : profile
      )
    );
  };

  // Load a saved profile into active view
  const handleLoadProfile = (id) => {
    const target = savedProfiles.find((p) => p.id === id);
    if (target) {
      setResumeData(target.data);
      setActiveProfileId(id);
    }
  };

  // Delete a saved profile
  const handleDeleteProfile = (id) => {
    setSavedProfiles((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (activeProfileId === id && filtered.length > 0) {
        setActiveProfileId(filtered[0].id);
        setResumeData(filtered[0].data);
      }
      return filtered;
    });
  };

  // Duplicate a saved profile
  const handleDuplicateProfile = (id) => {
    const target = savedProfiles.find((p) => p.id === id);
    if (target) {
      const newProfile = {
        id: 'profile-' + Date.now(),
        title: `${target.title} (Copy)`,
        updatedAt: new Date().toISOString(),
        data: JSON.parse(JSON.stringify(target.data))
      };
      setSavedProfiles((prev) => [newProfile, ...prev]);
    }
  };

  // Rename a saved profile
  const handleRenameProfile = (id, newTitle) => {
    setSavedProfiles((prev) =>
      prev.map((p) => (p.id === id ? { ...p, title: newTitle } : p))
    );
  };

  // Reset to empty template
  const handleReset = () => {
    if (window.confirm('Clear all resume fields to start fresh?')) {
      setResumeData({
        personalInfo: {
          fullName: '',
          phone: '',
          email: '',
          linkedin: '',
          location: ''
        },
        summary: '',
        skills: [''],
        experiences: [
          {
            id: 'exp-1',
            jobTitle: '',
            companyName: '',
            location: '',
            dateRange: '',
            bullets: ['']
          }
        ],
        projects: [],
        education: [
          {
            id: 'edu-1',
            degree: '',
            institution: '',
            location: '',
            dateRange: '',
            details: ''
          }
        ],
        settings: {
          fontFamily: 'Inter',
          nameFontFamily: 'Cinzel',
          fontSize: 'sm',
          spacing: 'compact',
          accentColor: '#1e293b'
        }
      });
    }
  };

  // Reload rich sample data
  const handleLoadSample = () => {
    setResumeData(initialResumeData);
  };

  // Auto-fit spacing and font size to force strictly into 1 page
  const handleAutoFit = useCallback(() => {
    setResumeData((prev) => {
      let nextSpacing = 'compact';
      let nextFontSize = prev.settings.fontSize;

      if (prev.settings.spacing === 'relaxed') {
        nextSpacing = 'normal';
      } else if (prev.settings.spacing === 'normal') {
        nextSpacing = 'compact';
      } else if (prev.settings.fontSize === 'base') {
        nextFontSize = 'sm';
        nextSpacing = 'compact';
      } else {
        nextFontSize = 'xs';
        nextSpacing = 'compact';
      }

      return {
        ...prev,
        settings: {
          ...prev.settings,
          spacing: nextSpacing,
          fontSize: nextFontSize
        }
      };
    });
  }, []);

  // Browser Print & Native Vector PDF handler
  const handlePrint = () => {
    printResume();
  };

  const handleFitWidth = () => {
    const viewportHeight = window.innerHeight - 90;
    const targetHeight = 1123;
    const calculatedZoom = Math.min(1.1, Math.max(0.5, viewportHeight / targetHeight));
    setZoom(Number(calculatedZoom.toFixed(2)));
  };

  const activeProfile = savedProfiles.find((p) => p.id === activeProfileId);

  return (
    <div className="app-container">
      {/* Left Sidebar: Form, JSON, Saved Resumes & AI Tailor */}
      <ResumeForm
        resumeData={resumeData}
        onChange={setResumeData}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        autoFitPage={handleAutoFit}
        savedProfiles={savedProfiles}
        activeProfileId={activeProfileId}
        onSaveCurrent={handleSaveCurrentProfile}
        onUpdateActive={handleUpdateActiveProfile}
        onLoadProfile={handleLoadProfile}
        onDeleteProfile={handleDeleteProfile}
        onDuplicateProfile={handleDuplicateProfile}
        onRenameProfile={handleRenameProfile}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Right Main Area: Toolbar & Single Page PDF View */}
      <main className="main-preview-area">
        <Toolbar
          zoom={zoom}
          onZoomChange={setZoom}
          onFitWidth={handleFitWidth}
          overflowStatus={overflowStatus}
          onAutoFit={handleAutoFit}
          onPrint={handlePrint}
          activeProfileTitle={activeProfile?.title || 'Default'}
          onQuickSave={handleUpdateActiveProfile}
          onOpenSaved={() => setActiveTab('saved')}
        />

        <div className="preview-viewport">
          <div
            className="resume-wrapper"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              marginBottom: `${Math.max(40, (1 - zoom) * 200)}px`
            }}
          >
            <ResumePreview
              resumeData={resumeData}
              onOverflowChange={setOverflowStatus}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
