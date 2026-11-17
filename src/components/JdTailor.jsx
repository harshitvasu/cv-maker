import React, { useState, useEffect } from 'react';
import {
  Wand2,
  Sparkles,
  Key,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  Check,
  RotateCcw,
  Zap,
  ShieldCheck,
  FolderPlus,
  FileText,
  MessageSquareCode,
  Code,
  Copy
} from 'lucide-react';
import {
  tailorResumeWithGroq,
  checkAiBackendStatus,
  GROQ_MODELS
} from '../utils/groqApi';

export default function JdTailor({
  currentResume,
  activeProfileTitle = 'Current Resume',
  onSaveAsNewTemplate
}) {
  // Option 1: 'jd' (Job Description) | Option 2: 'prompt' (Custom Prompt)
  const [aiMode, setAiMode] = useState('jd');

  // Mode 1: JD inputs
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');

  // Mode 2: Prompt inputs
  const [customPrompt, setCustomPrompt] = useState('');
  const [showExactJson, setShowExactJson] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Auto-saved template name state
  const [templateName, setTemplateName] = useState('');
  const [isTemplateNameEdited, setIsTemplateNameEdited] = useState(false);

  // Settings & state
  const [customApiKey, setCustomApiKey] = useState('');
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [model, setModel] = useState('openai/gpt-oss-120b');

  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);

  const [backendStatus, setBackendStatus] = useState({ checked: false, configured: false, error: null });

  useEffect(() => {
    let isMounted = true;
    checkAiBackendStatus().then((status) => {
      if (isMounted) {
        setBackendStatus({
          checked: true,
          configured: Boolean(status?.configured),
          error: status?.error || null
        });
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const hasKey = Boolean(customApiKey.trim() || backendStatus.configured);

  // Auto-sync template name when role or prompt changes (unless manually edited)
  useEffect(() => {
    if (!isTemplateNameEdited) {
      if (aiMode === 'jd') {
        setTemplateName(
          targetRole.trim()
            ? `Tailored - ${targetRole.trim()}`
            : `Tailored - ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
        );
      } else {
        const snippet = customPrompt.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 24);
        setTemplateName(
          snippet
            ? `Prompt: ${snippet}`
            : `Prompt - ${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`
        );
      }
    }
  }, [targetRole, customPrompt, aiMode, isTemplateNameEdited]);

  const promptSuggestions = [
    'Make all bullet points more metric-driven with quantified percentages, requests/sec, and latency.',
    'Highlight distributed systems, high availability, and microservices architecture across experiences.',
    'Rephrase summary and experience bullets to target a Staff / Lead Backend Engineer role.',
    'Condense and tighten bullet phrasing to maximize single-page whitespace and visual breathing room.'
  ];

  const handleCopyExactJson = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(currentResume, null, 2));
      setCopiedJson(true);
      setTimeout(() => setCopiedJson(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleStartTailorAndAutoLoad = async (e) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsGenerating(true);

    // Determine final title
    let finalTitle = templateName.trim();
    if (!finalTitle) {
      finalTitle =
        aiMode === 'prompt'
          ? (customPrompt.trim().slice(0, 24)
              ? `Prompt: ${customPrompt.replace(/[^a-zA-Z0-9 ]/g, '').trim().slice(0, 24)}`
              : `Prompt Modified (${new Date().toLocaleDateString()})`)
          : (targetRole.trim()
              ? `Tailored - ${targetRole.trim()}`
              : `Tailored for JD (${new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' })})`);
    }

    try {
      const result = await tailorResumeWithGroq({
        mode: aiMode,
        currentResume,
        jobDescription,
        targetRole,
        prompt: customPrompt,
        apiKey: customApiKey,
        model,
        onProgress: (msg) => setProgressMsg(msg)
      });

      // IMMEDIATELY SAVE AS NEW TEMPLATE AND LOAD IT AUTOMATICALLY ON SCREEN
      onSaveAsNewTemplate(finalTitle, result.tailoredResume);
    } catch (err) {
      console.error('Tailoring error:', err);
      setErrorMsg(err.message || 'An error occurred while calling Groq API.');
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="jd-tailor-container">
      {/* Header */}
      <div className="jd-tailor-header">
        <div className="jd-title-wrap">
          <Zap size={18} style={{ color: '#f59e0b' }} />
          <div>
            <h3>AI Resume Tailor (Groq Ultra-Fast)</h3>
            <span>Executes AI & automatically loads the new template</span>
          </div>
        </div>
      </div>

      <div className="jd-tailor-scrollable">
        {/* API Key Status Banner */}
        <div className="api-key-status-card">
          <div className="api-key-info">
            <Key size={15} />
            <div style={{ flex: 1 }}>
              <div className="api-key-title">
                {hasKey ? (
                  <span className="key-ok">
                    <CheckCircle2 size={13} /> AI Backend Connected
                  </span>
                ) : (
                  <span className="key-missing">
                    <AlertTriangle size={13} /> Missing AI API Key
                  </span>
                )}
              </div>
              <p className="api-key-subtitle">
                {hasKey
                  ? customApiKey.trim()
                    ? 'Using custom session key override'
                    : 'Active via Node.js backend (.env)'
                  : 'Add GROQ_API_KEY / GROK_API_KEY to cv-maker-backend/.env or enter a session key below.'}
              </p>
            </div>
            <button
              type="button"
              className="btn-text-subtle"
              onClick={() => setShowKeyInput(!showKeyInput)}
            >
              {showKeyInput ? 'Hide' : 'Configure'}
            </button>
          </div>

          {showKeyInput && (
            <div className="api-key-input-row">
              <input
                type="password"
                className="form-input"
                placeholder="gsk_xxxxxxxxxxxxxxxxxxxxxxxx"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
              />
              <span className="form-label-hint">
                Overrides .env key for this browser session.
              </span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form className="jd-form" onSubmit={handleStartTailorAndAutoLoad}>
          {/* Mode Selector: 1. Job Description vs 2. Custom Prompt */}
          <div className="ai-tailor-mode-toggle">
            <button
              type="button"
              className={`ai-toggle-btn ${aiMode === 'jd' ? 'is-active' : ''}`}
              onClick={() => {
                setAiMode('jd');
                setIsTemplateNameEdited(false);
              }}
            >
              <FileText size={14} />
              <span>1. Job Description (JD)</span>
            </button>
            <button
              type="button"
              className={`ai-toggle-btn ${aiMode === 'prompt' ? 'is-active' : ''}`}
              onClick={() => {
                setAiMode('prompt');
                setIsTemplateNameEdited(false);
              }}
            >
              <MessageSquareCode size={14} />
              <span>2. Custom Prompt</span>
            </button>
          </div>

          {/* Template Protection Notice */}
          <div className="template-protection-banner">
            <ShieldCheck size={15} color="#059669" />
            <span>
              Base Template: <strong>"{activeProfileTitle}"</strong> will stay untouched. The result is automatically loaded as a new template.
            </span>
          </div>

          {/* OPTION 1: JOB DESCRIPTION MODE */}
          {aiMode === 'jd' && (
            <>
              <div className="form-group">
                <label className="form-label">
                  Target Role / Job Title
                  <span className="form-label-hint">e.g. Senior Backend Engineer</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Backend Engineer - Distributed Systems"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Paste Job Description (JD)
                  <span className="form-label-hint">Requirements, tech stack, responsibilities</span>
                </label>
                <textarea
                  className="form-textarea scrollable-input"
                  style={{ minHeight: '160px', maxHeight: '280px', fontSize: '0.82rem' }}
                  placeholder="Paste the full job posting text here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {/* OPTION 2: CUSTOM PROMPT MODE */}
          {aiMode === 'prompt' && (
            <>
              <div className="prompt-mode-notice">
                <ShieldCheck size={14} color="#2563eb" />
                <span>
                  <strong>Exact JSON Transmission:</strong> Your exact resume JSON is sent to Groq and modified according to your prompt without deleting any sections.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Prompt / Instructions for Groq
                  <span className="form-label-hint">Tell Groq how to modify the resume</span>
                </label>
                <textarea
                  className="form-textarea scrollable-input"
                  style={{ minHeight: '130px', maxHeight: '260px', fontSize: '0.82rem' }}
                  placeholder="e.g.: Quantify all experience bullet points with concrete metrics, latency improvements, and uptime. Reframe the summary to emphasize Senior Distributed Systems Engineer leadership. Do not delete any sections."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  required
                />
              </div>

              {/* Quick Suggestion Chips */}
              <div className="prompt-suggestions-box">
                <span className="form-label-hint">Quick prompt ideas:</span>
                <div className="prompt-chips-wrap">
                  {promptSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className="prompt-chip-btn"
                      onClick={() => {
                        setCustomPrompt(suggestion);
                        setIsTemplateNameEdited(false);
                      }}
                    >
                      <Sparkles size={11} />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Collapsible Exact JSON Viewer */}
              <div className="exact-json-preview-card">
                <div className="exact-json-header">
                  <button
                    type="button"
                    className="btn-text-subtle"
                    style={{ fontSize: '0.74rem' }}
                    onClick={() => setShowExactJson(!showExactJson)}
                  >
                    <Code size={13} />
                    <span>{showExactJson ? 'Hide Exact JSON Payload' : 'Inspect Exact JSON Being Sent to Groq'}</span>
                  </button>

                  {showExactJson && (
                    <button
                      type="button"
                      className="btn-text-subtle"
                      style={{ fontSize: '0.74rem' }}
                      onClick={handleCopyExactJson}
                    >
                      {copiedJson ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                      <span>{copiedJson ? 'Copied!' : 'Copy JSON'}</span>
                    </button>
                  )}
                </div>

                {showExactJson && (
                  <textarea
                    readOnly
                    className="json-textarea"
                    style={{ height: '170px', fontSize: '0.72rem', marginTop: '6px' }}
                    value={JSON.stringify(currentResume, null, 2)}
                  />
                )}
              </div>
            </>
          )}

          {/* New Template Save Name (Prompted/Configured upfront) */}
          <div className="form-group" style={{ marginTop: '2px' }}>
            <label className="form-label">
              Save As New Template Name
              <span className="form-label-hint">Automatically loaded upon completion</span>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                required
                className="form-input"
                placeholder="e.g. Tailored - Senior Backend (Stripe)"
                value={templateName}
                onChange={(e) => {
                  setTemplateName(e.target.value);
                  setIsTemplateNameEdited(true);
                }}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Groq Model</label>
              <select
                className="form-input"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <optgroup label="Groq (Ultra-Fast Free Tier)">
                  {GROQ_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Single-Page Fit</label>
              <div className="single-page-badge-notice">
                <Check size={13} color="#10b981" />
                <span>Enforces 1-Page Limits</span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="jd-error-card">
              <AlertTriangle size={16} />
              <div>
                <strong>Could not tailor resume:</strong>
                <p>{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Main Action Button: Executes & Auto-Loads */}
          <button
            type="submit"
            className="btn-tailor-primary"
            disabled={isGenerating || (aiMode === 'jd' ? !jobDescription.trim() : !customPrompt.trim())}
          >
            {isGenerating ? (
              <>
                <Loader2 size={16} className="spin-animation" />
                <span>{progressMsg || 'Executing & Auto-Loading...'}</span>
              </>
            ) : (
              <>
                <Wand2 size={16} />
                <span>
                  {aiMode === 'jd'
                    ? 'Tailor Resume & Auto-Load'
                    : 'Execute Prompt & Auto-Load'}
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
