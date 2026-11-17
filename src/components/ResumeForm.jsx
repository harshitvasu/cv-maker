import React, { useState } from 'react';
import {
  User,
  FileText,
  Wrench,
  Briefcase,
  GraduationCap,
  Sliders,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RotateCcw,
  FileCode,
  LayoutList,
  FolderGit2,
  Bookmark,
  Sparkles as SparklesIcon
} from 'lucide-react';
import JsonEditor from './JsonEditor';
import SavedResumes from './SavedResumes';
import JdTailor from './JdTailor';

export default function ResumeForm({
  resumeData,
  onChange,
  onReset,
  onLoadSample,
  autoFitPage,
  savedProfiles = [],
  activeProfileId,
  onSaveCurrent,
  onUpdateActive,
  onLoadProfile,
  onDeleteProfile,
  onDuplicateProfile,
  onRenameProfile,
  activeTab: controlledTab,
  onTabChange
}) {
  const [internalTab, setInternalTab] = useState('form');
  const activeTab = controlledTab !== undefined ? controlledTab : internalTab;
  const setActiveTab = onTabChange || setInternalTab;

  const [openSections, setOpenSections] = useState({
    personal: true,
    summary: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    settings: false
  });

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Personal Info change handler
  const handlePersonalChange = (field, value) => {
    onChange({
      ...resumeData,
      personalInfo: {
        ...resumeData.personalInfo,
        [field]: value
      }
    });
  };

  // Summary change handler
  const handleSummaryChange = (value) => {
    onChange({
      ...resumeData,
      summary: value
    });
  };

  // Skills bullet points handlers
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...resumeData.skills];
    updatedSkills[index] = value;
    onChange({
      ...resumeData,
      skills: updatedSkills
    });
  };

  const handleAddSkill = () => {
    onChange({
      ...resumeData,
      skills: [...resumeData.skills, 'New Skill bullet point...']
    });
  };

  const handleRemoveSkill = (index) => {
    const updatedSkills = resumeData.skills.filter((_, i) => i !== index);
    onChange({
      ...resumeData,
      skills: updatedSkills
    });
  };

  // Experience handlers
  const handleExperienceChange = (id, field, value) => {
    const updatedExperiences = resumeData.experiences.map((exp) => {
      if (exp.id === id) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    onChange({
      ...resumeData,
      experiences: updatedExperiences
    });
  };

  const handleAddExperience = () => {
    const newExp = {
      id: 'exp-' + Date.now(),
      jobTitle: 'Job Title',
      companyName: 'Company Name',
      location: 'City, State',
      dateRange: 'Jan 2023 - Present',
      bullets: [
        'Key achievement or responsibility with measurable impact.',
        'Collaborated with cross-functional teams to deliver project on schedule.'
      ]
    };
    onChange({
      ...resumeData,
      experiences: [...resumeData.experiences, newExp]
    });
  };

  const handleRemoveExperience = (id) => {
    onChange({
      ...resumeData,
      experiences: resumeData.experiences.filter((exp) => exp.id !== id)
    });
  };

  const handleExpBulletChange = (expId, bulletIndex, value) => {
    const updatedExperiences = resumeData.experiences.map((exp) => {
      if (exp.id === expId) {
        const newBullets = [...exp.bullets];
        newBullets[bulletIndex] = value;
        return { ...exp, bullets: newBullets };
      }
      return exp;
    });
    onChange({
      ...resumeData,
      experiences: updatedExperiences
    });
  };

  const handleAddExpBullet = (expId) => {
    const updatedExperiences = resumeData.experiences.map((exp) => {
      if (exp.id === expId) {
        return {
          ...exp,
          bullets: [...exp.bullets, 'Achieved outcome by implementing new strategy.']
        };
      }
      return exp;
    });
    onChange({
      ...resumeData,
      experiences: updatedExperiences
    });
  };

  const handleRemoveExpBullet = (expId, bulletIndex) => {
    const updatedExperiences = resumeData.experiences.map((exp) => {
      if (exp.id === expId) {
        return {
          ...exp,
          bullets: exp.bullets.filter((_, i) => i !== bulletIndex)
        };
      }
      return exp;
    });
    onChange({
      ...resumeData,
      experiences: updatedExperiences
    });
  };

  // Projects handlers
  const handleProjectChange = (id, field, value) => {
    const updatedProjects = (resumeData.projects || []).map((proj) => {
      if (proj.id === id) {
        return { ...proj, [field]: value };
      }
      return proj;
    });
    onChange({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const handleAddProject = () => {
    const newProj = {
      id: 'proj-' + Date.now(),
      projectName: 'Project Name',
      technologies: 'Technologies used',
      dateRange: '2023',
      bullets: [
        'Built and launched feature with measurable outcomes.'
      ]
    };
    onChange({
      ...resumeData,
      projects: [...(resumeData.projects || []), newProj]
    });
  };

  const handleRemoveProject = (id) => {
    onChange({
      ...resumeData,
      projects: (resumeData.projects || []).filter((proj) => proj.id !== id)
    });
  };

  const handleProjBulletChange = (projId, bulletIndex, value) => {
    const updatedProjects = (resumeData.projects || []).map((proj) => {
      if (proj.id === projId) {
        const newBullets = [...proj.bullets];
        newBullets[bulletIndex] = value;
        return { ...proj, bullets: newBullets };
      }
      return proj;
    });
    onChange({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const handleAddProjBullet = (projId) => {
    const updatedProjects = (resumeData.projects || []).map((proj) => {
      if (proj.id === projId) {
        return {
          ...proj,
          bullets: [...proj.bullets, 'Key feature or contribution.']
        };
      }
      return proj;
    });
    onChange({
      ...resumeData,
      projects: updatedProjects
    });
  };

  const handleRemoveProjBullet = (projId, bulletIndex) => {
    const updatedProjects = (resumeData.projects || []).map((proj) => {
      if (proj.id === projId) {
        return {
          ...proj,
          bullets: proj.bullets.filter((_, i) => i !== bulletIndex)
        };
      }
      return proj;
    });
    onChange({
      ...resumeData,
      projects: updatedProjects
    });
  };

  // Education handlers
  const handleEducationChange = (id, field, value) => {
    const updatedEducation = resumeData.education.map((edu) => {
      if (edu.id === id) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    onChange({
      ...resumeData,
      education: updatedEducation
    });
  };

  const handleAddEducation = () => {
    const newEdu = {
      id: 'edu-' + Date.now(),
      degree: 'B.S. in Field of Study',
      institution: 'University Name',
      location: 'City, State',
      dateRange: '2019 - 2023',
      details: 'Relevant coursework, honors, or GPA'
    };
    onChange({
      ...resumeData,
      education: [...resumeData.education, newEdu]
    });
  };

  const handleRemoveEducation = (id) => {
    onChange({
      ...resumeData,
      education: resumeData.education.filter((edu) => edu.id !== id)
    });
  };

  // Settings change
  const handleSettingChange = (field, value) => {
    onChange({
      ...resumeData,
      settings: {
        ...resumeData.settings,
        [field]: value
      }
    });
  };

  return (
    <aside className="sidebar">
      {/* Sidebar Header */}
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <Briefcase size={22} />
          <div>
            <h1>Single-Page Resume Maker</h1>
            <span>Fill details • Formats strictly to 1 page</span>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div className="sidebar-mode-toggle">
        <button
          type="button"
          className={`mode-tab-btn ${activeTab === 'form' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('form')}
          title="Edit using interactive form fields"
        >
          <LayoutList size={14} />
          <span>Form</span>
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${activeTab === 'json' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('json')}
          title="Edit directly as JSON code"
        >
          <FileCode size={14} />
          <span>JSON</span>
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${activeTab === 'saved' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('saved')}
          title="Saved resume profiles & versions"
        >
          <Bookmark size={14} />
          <span>Saved ({savedProfiles?.length || 0})</span>
        </button>
        <button
          type="button"
          className={`mode-tab-btn ${activeTab === 'tailor' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('tailor')}
          title="Auto-tailor resume for a Job Description using Grok AI"
        >
          <SparklesIcon size={14} color="#8b5cf6" />
          <span>AI Tailor</span>
        </button>
      </div>

      {/* Render Active View: JSON Mode, Saved Profiles, AI Tailor, or Form Fields */}
      {activeTab === 'json' && (
        <JsonEditor
          resumeData={resumeData}
          onChange={onChange}
          onLoadSample={onLoadSample}
        />
      )}

      {activeTab === 'saved' && (
        <SavedResumes
          savedProfiles={savedProfiles}
          activeProfileId={activeProfileId}
          currentResume={resumeData}
          onSaveCurrent={onSaveCurrent}
          onUpdateActive={onUpdateActive}
          onLoadProfile={onLoadProfile}
          onDeleteProfile={onDeleteProfile}
          onDuplicateProfile={onDuplicateProfile}
          onRenameProfile={onRenameProfile}
        />
      )}

      {activeTab === 'tailor' && (
        <JdTailor
          currentResume={resumeData}
          activeProfileTitle={
            savedProfiles.find((p) => p.id === activeProfileId)?.title || 'Current Template'
          }
          onSaveAsNewTemplate={(title, tailored) => {
            onSaveCurrent(title, tailored);
            setActiveTab('form');
          }}
        />
      )}

      {activeTab === 'form' && (
        /* Scrollable Form Fields Area */
        <div className="sidebar-scroll-area">
          {/* Quick Action Buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn-add-item"
              style={{ flex: 1, backgroundColor: '#ffffff' }}
              onClick={onLoadSample}
              title="Load sample professional single-page resume"
            >
              <Sparkles size={14} />
              Load Sample
            </button>
            <button
              type="button"
              className="btn-add-item"
              style={{ flex: 1, backgroundColor: '#ffffff' }}
              onClick={onReset}
              title="Clear all fields"
            >
              <RotateCcw size={14} />
              Clear
            </button>
          </div>

          {/* 1. PERSONAL INFORMATION */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.personal ? 'is-open' : ''}`}
              onClick={() => toggleSection('personal')}
            >
              <div className="section-title-wrap">
                <User size={18} />
                <span className="section-title">Personal Headline & Contact</span>
              </div>
              {openSections.personal ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.personal && (
              <div className="section-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">
                      Name Headline
                      <span className="form-label-hint">Shown at top</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. HARSHIT VASU"
                      value={resumeData.personalInfo?.fullName || ''}
                      onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Headline Font
                      <span className="form-label-hint">Name styling</span>
                    </label>
                    <select
                      className="form-input"
                      value={resumeData.settings?.nameFontFamily || 'Cinzel'}
                      onChange={(e) => handleSettingChange('nameFontFamily', e.target.value)}
                    >
                      <option value="Cinzel">Cinzel (Executive Serif - Recommended)</option>
                      <option value="Montserrat">Montserrat (Modern Bold Sans)</option>
                      <option value="EB Garamond">EB Garamond (Classic Prestigious)</option>
                      <option value="Playfair Display">Playfair Display (Luxury Editorial)</option>
                      <option value="Inter">Inter (Clean Minimalist Sans)</option>
                      <option value="Roboto">Roboto (Crisp Technical Sans)</option>
                      <option value="Merriweather">Merriweather (Sturdy Serif)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. +1 (555) 234-5678"
                      value={resumeData.personalInfo?.phone || ''}
                      onChange={(e) => handlePersonalChange('phone', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="e.g. alex@example.com"
                      value={resumeData.personalInfo?.email || ''}
                      onChange={(e) => handlePersonalChange('email', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. linkedin.com/in/alex"
                      value={resumeData.personalInfo?.linkedin || ''}
                      onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. San Francisco, CA"
                      value={resumeData.personalInfo?.location || ''}
                      onChange={(e) => handlePersonalChange('location', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 2. SUMMARY SECTION */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.summary ? 'is-open' : ''}`}
              onClick={() => toggleSection('summary')}
            >
              <div className="section-title-wrap">
                <FileText size={18} />
                <span className="section-title">Summary</span>
              </div>
              {openSections.summary ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.summary && (
              <div className="section-body">
                <div className="form-group">
                  <label className="form-label">
                    Professional Summary
                    <span className="form-label-hint">2-4 impactful lines</span>
                  </label>
                  <textarea
                    className="form-textarea scrollable-input"
                    rows={4}
                    placeholder="Summarize your professional experience, key strengths, and achievements..."
                    value={resumeData.summary || ''}
                    onChange={(e) => handleSummaryChange(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. SKILLS SECTION (BULLET POINTS) */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.skills ? 'is-open' : ''}`}
              onClick={() => toggleSection('skills')}
            >
              <div className="section-title-wrap">
                <Wrench size={18} />
                <span className="section-title">Skills (Bullet Points)</span>
                <span className="section-badge">{resumeData.skills?.length || 0}</span>
              </div>
              {openSections.skills ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.skills && (
              <div className="section-body">
                <span className="form-label-hint">
                  Add bullet points for skills (e.g. category-based or skill highlights):
                </span>
                <div className="bullet-list">
                  {(resumeData.skills || []).map((skill, index) => (
                    <div key={index} className="bullet-item">
                      <div className="bullet-dot-indicator" />
                      <div className="bullet-input-wrap">
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Languages: JavaScript, Python, TypeScript"
                          value={skill}
                          onChange={(e) => handleSkillChange(index, e.target.value)}
                        />
                      </div>
                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => handleRemoveSkill(index)}
                        title="Remove skill bullet"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleAddSkill}
                >
                  <Plus size={15} /> Add Skill Bullet
                </button>
              </div>
            )}
          </div>

          {/* 4. EXPERIENCE SECTION */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.experience ? 'is-open' : ''}`}
              onClick={() => toggleSection('experience')}
            >
              <div className="section-title-wrap">
                <Briefcase size={18} />
                <span className="section-title">Experience</span>
                <span className="section-badge">{resumeData.experiences?.length || 0}</span>
              </div>
              {openSections.experience ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.experience && (
              <div className="section-body">
                <span className="form-label-hint">
                  Format: <code>Job title | Company name, Location &nbsp;&nbsp;&nbsp; Date range</code>
                </span>

                {(resumeData.experiences || []).map((exp, expIdx) => (
                  <div key={exp.id || expIdx} className="item-card">
                    <div className="item-card-header">
                      <span className="item-card-num">Position #{expIdx + 1}</span>
                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => handleRemoveExperience(exp.id)}
                        title="Delete experience"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Job Title</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Senior Software Engineer"
                          value={exp.jobTitle || ''}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'jobTitle', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Company Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Stripe"
                          value={exp.companyName || ''}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'companyName', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. San Francisco, CA"
                          value={exp.location || ''}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'location', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Date Range (From - to)</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Jan 2022 - Present"
                          value={exp.dateRange || ''}
                          onChange={(e) =>
                            handleExperienceChange(exp.id, 'dateRange', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Experience Bullet Points */}
                    <div className="form-group">
                      <label className="form-label">Experience Points (Bullets)</label>
                      <div className="bullet-list">
                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="bullet-item">
                            <div className="bullet-dot-indicator" />
                            <div className="bullet-input-wrap">
                              <textarea
                                rows={2}
                                className="form-textarea scrollable-input"
                                style={{ minHeight: '52px', fontSize: '0.82rem' }}
                                placeholder="Action verb + context + measurable result..."
                                value={bullet}
                                onChange={(e) =>
                                  handleExpBulletChange(exp.id, bIdx, e.target.value)
                                }
                              />
                            </div>
                            <button
                              type="button"
                              className="btn-icon-danger"
                              onClick={() => handleRemoveExpBullet(exp.id, bIdx)}
                              title="Remove bullet"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-add-item"
                        style={{ marginTop: '6px' }}
                        onClick={() => handleAddExpBullet(exp.id)}
                      >
                        <Plus size={14} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleAddExperience}
                >
                  <Plus size={15} /> Add Experience
                </button>
              </div>
            )}
          </div>

          {/* 5. PROJECTS SECTION (May be blank/optional) */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.projects ? 'is-open' : ''}`}
              onClick={() => toggleSection('projects')}
            >
              <div className="section-title-wrap">
                <FolderGit2 size={18} />
                <span className="section-title">Projects</span>
                <span className="section-badge">{resumeData.projects?.length || 0}</span>
              </div>
              {openSections.projects ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.projects && (
              <div className="section-body">
                <span className="form-label-hint">
                  Optional. If empty or left blank, this section will not appear on the resume.
                </span>

                {(resumeData.projects || []).map((proj, pIdx) => (
                  <div key={proj.id || pIdx} className="item-card">
                    <div className="item-card-header">
                      <span className="item-card-num">Project #{pIdx + 1}</span>
                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => handleRemoveProject(proj.id)}
                        title="Delete project"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Project Name</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. MD Lite CMS"
                          value={proj.projectName || ''}
                          onChange={(e) =>
                            handleProjectChange(proj.id, 'projectName', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Technologies / Tools</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Express.js, React, MongoDB, AWS"
                          value={proj.technologies || ''}
                          onChange={(e) =>
                            handleProjectChange(proj.id, 'technologies', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date Range / Link (optional)</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 2023 or github.com/username/project"
                        value={proj.dateRange || ''}
                        onChange={(e) =>
                          handleProjectChange(proj.id, 'dateRange', e.target.value)
                        }
                      />
                    </div>

                    {/* Project Bullet Points */}
                    <div className="form-group">
                      <label className="form-label">Project Details (Bullets)</label>
                      <div className="bullet-list">
                        {(proj.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="bullet-item">
                            <div className="bullet-dot-indicator" />
                            <div className="bullet-input-wrap">
                              <textarea
                                rows={2}
                                className="form-textarea scrollable-input"
                                style={{ minHeight: '52px', fontSize: '0.82rem' }}
                                placeholder="Key achievement, architecture, or outcome..."
                                value={bullet}
                                onChange={(e) =>
                                  handleProjBulletChange(proj.id, bIdx, e.target.value)
                                }
                              />
                            </div>
                            <button
                              type="button"
                              className="btn-icon-danger"
                              onClick={() => handleRemoveProjBullet(proj.id, bIdx)}
                              title="Remove bullet"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        type="button"
                        className="btn-add-item"
                        style={{ marginTop: '6px' }}
                        onClick={() => handleAddProjBullet(proj.id)}
                      >
                        <Plus size={14} /> Add Bullet Point
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleAddProject}
                >
                  <Plus size={15} /> Add Project
                </button>
              </div>
            )}
          </div>

          {/* 6. EDUCATION SECTION */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.education ? 'is-open' : ''}`}
              onClick={() => toggleSection('education')}
            >
              <div className="section-title-wrap">
                <GraduationCap size={18} />
                <span className="section-title">Education</span>
                <span className="section-badge">{resumeData.education?.length || 0}</span>
              </div>
              {openSections.education ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.education && (
              <div className="section-body">
                {(resumeData.education || []).map((edu, eduIdx) => (
                  <div key={edu.id || eduIdx} className="item-card">
                    <div className="item-card-header">
                      <span className="item-card-num">Degree #{eduIdx + 1}</span>
                      <button
                        type="button"
                        className="btn-icon-danger"
                        onClick={() => handleRemoveEducation(edu.id)}
                        title="Delete education"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. B.S. in Computer Science & Engineering"
                        value={edu.degree || ''}
                        onChange={(e) =>
                          handleEducationChange(edu.id, 'degree', e.target.value)
                        }
                      />
                    </div>

                    <div className="grid-2">
                      <div className="form-group">
                        <label className="form-label">Institution / University</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. UC Berkeley"
                          value={edu.institution || ''}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'institution', e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Location</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="e.g. Berkeley, CA"
                          value={edu.location || ''}
                          onChange={(e) =>
                            handleEducationChange(edu.id, 'location', e.target.value)
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Date Range / Graduation Year</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 2017 - 2021"
                        value={edu.dateRange || ''}
                        onChange={(e) =>
                          handleEducationChange(edu.id, 'dateRange', e.target.value)
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Honors / Details (optional)
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. Magna Cum Laude • Dean's Honor List • GPA 3.9"
                        value={edu.details || ''}
                        onChange={(e) =>
                          handleEducationChange(edu.id, 'details', e.target.value)
                        }
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  className="btn-add-item"
                  onClick={handleAddEducation}
                >
                  <Plus size={15} /> Add Degree
                </button>
              </div>
            )}
          </div>

          {/* 6. SINGLE-PAGE FITTING & TYPOGRAPHY TUNING */}
          <div className="form-section">
            <button
              type="button"
              className={`section-header-btn ${openSections.settings ? 'is-open' : ''}`}
              onClick={() => toggleSection('settings')}
            >
              <div className="section-title-wrap">
                <Sliders size={18} />
                <span className="section-title">Single-Page Fit Controls</span>
              </div>
              {openSections.settings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            {openSections.settings && (
              <div className="section-body">
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Headline Name Font</label>
                    <select
                      className="form-input"
                      value={resumeData.settings?.nameFontFamily || 'Cinzel'}
                      onChange={(e) => handleSettingChange('nameFontFamily', e.target.value)}
                    >
                      <option value="Cinzel">Cinzel (Executive Serif)</option>
                      <option value="Montserrat">Montserrat (Modern Bold Sans)</option>
                      <option value="EB Garamond">EB Garamond (Classic Prestigious)</option>
                      <option value="Playfair Display">Playfair Display (Luxury Editorial)</option>
                      <option value="Inter">Inter (Clean Modern Sans)</option>
                      <option value="Roboto">Roboto (Crisp Technical Sans)</option>
                      <option value="Merriweather">Merriweather (Sturdy Serif)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Body & Section Font</label>
                    <select
                      className="form-input"
                      value={resumeData.settings?.fontFamily || 'Inter'}
                      onChange={(e) => handleSettingChange('fontFamily', e.target.value)}
                    >
                      <option value="Inter">Inter (Clean Modern Sans)</option>
                      <option value="EB Garamond">EB Garamond (Classic Executive Serif)</option>
                      <option value="Roboto">Roboto (Crisp Technical Sans)</option>
                      <option value="Merriweather">Merriweather (Editorial Serif)</option>
                      <option value="Montserrat">Montserrat (Geometric Sans)</option>
                    </select>
                  </div>
                </div>

                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Font Size</label>
                    <select
                      className="form-input"
                      value={resumeData.settings?.fontSize || 'sm'}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    >
                      <option value="xs">Compact (xs)</option>
                      <option value="sm">Normal (sm)</option>
                      <option value="base">Spacious (base)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Spacing Density</label>
                    <select
                      className="form-input"
                      value={resumeData.settings?.spacing || 'compact'}
                      onChange={(e) => handleSettingChange('spacing', e.target.value)}
                    >
                      <option value="compact">Compact (Tight single page)</option>
                      <option value="normal">Normal</option>
                      <option value="relaxed">Relaxed</option>
                    </select>
                  </div>
                </div>

                <button
                  type="button"
                  className="btn-add-item"
                  style={{ backgroundColor: '#eff6ff', borderColor: '#bfdbfe', color: '#1d4ed8' }}
                  onClick={autoFitPage}
                >
                  <Sparkles size={14} /> Auto-Fit to 1 Page Automatically
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
