import React, { useState, useEffect } from 'react';
import {
  Check,
  Copy,
  Download,
  Upload,
  Sparkles,
  AlertCircle,
  WrapText,
  FileCode
} from 'lucide-react';

export default function JsonEditor({ resumeData, onChange, onLoadSample }) {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(resumeData, null, 2));
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);

  // Sync incoming resumeData changes (e.g. from Form mode or sample load) to jsonText
  useEffect(() => {
    try {
      const currentParsed = JSON.parse(jsonText);
      // Only re-stringify if the object content has actually changed from outside
      if (JSON.stringify(currentParsed) !== JSON.stringify(resumeData)) {
        setJsonText(JSON.stringify(resumeData, null, 2));
        setError(null);
      }
    } catch {
      // If user currently has invalid JSON typed, don't overwrite their work
    }
  }, [resumeData]);

  // Handle user typing into the JSON editor
  const handleTextChange = (e) => {
    const text = e.target.value;
    setJsonText(text);

    try {
      const parsed = JSON.parse(text);
      setError(null);
      // Validate minimal structure
      if (typeof parsed === 'object' && parsed !== null) {
        onChange(parsed);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  // Prettify / Format JSON
  const handlePrettify = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setError(null);
      onChange(parsed);
    } catch (err) {
      setError(`Cannot format invalid JSON: ${err.message}`);
    }
  };

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy JSON:', err);
    }
  };

  // Download JSON file
  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(resumeData?.personalInfo?.fullName || 'resume')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')}_data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Upload JSON file
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        try {
          const parsed = JSON.parse(content);
          const formatted = JSON.stringify(parsed, null, 2);
          setJsonText(formatted);
          setError(null);
          onChange(parsed);
        } catch (err) {
          setError(`Invalid JSON file: ${err.message}`);
        }
      }
    };
    reader.readAsText(file);
    // Reset file input so re-selecting same file works
    e.target.value = '';
  };

  return (
    <div className="json-editor-container">
      {/* Top Toolbar for JSON Editor */}
      <div className="json-toolbar">
        <div className="json-toolbar-actions">
          <button
            type="button"
            className="json-btn"
            onClick={handlePrettify}
            title="Prettify & format JSON with clean indentation"
          >
            <Sparkles size={13} />
            <span>Format</span>
          </button>

          <button
            type="button"
            className="json-btn"
            onClick={handleCopy}
            title="Copy JSON to clipboard"
          >
            {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            type="button"
            className="json-btn"
            onClick={handleDownload}
            title="Download JSON file"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          <label className="json-btn" title="Upload and import a JSON file">
            <Upload size={13} />
            <span>Import</span>
            <input
              type="file"
              accept=".json,application/json"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </label>

          <button
            type="button"
            className={`json-btn ${wordWrap ? 'is-active' : ''}`}
            onClick={() => setWordWrap(!wordWrap)}
            title="Toggle word wrap"
          >
            <WrapText size={13} />
            <span>Wrap</span>
          </button>
        </div>
      </div>

      {/* Live Syntax Validation Status Badge */}
      <div className="json-status-bar">
        {error ? (
          <div className="json-status-badge error">
            <AlertCircle size={14} />
            <span className="truncate">{error}</span>
          </div>
        ) : (
          <div className="json-status-badge success">
            <Check size={14} />
            <span>Valid JSON • Live updating resume preview</span>
          </div>
        )}
      </div>

      {/* Dedicated Scrollable JSON Textarea */}
      <div className="json-textarea-wrapper">
        <textarea
          className={`json-textarea ${wordWrap ? 'wrap-on' : 'wrap-off'}`}
          value={jsonText}
          onChange={handleTextChange}
          placeholder="Paste or write valid resume JSON here..."
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
        />
      </div>

      {/* JSON schema hint footer */}
      <div className="json-footer-hint">
        <span>Structure: <code>personalInfo</code>, <code>summary</code>, <code>skills[]</code>, <code>experiences[]</code>, <code>projects[]</code>, <code>education[]</code>, <code>settings</code></span>
      </div>
    </div>
  );
}
