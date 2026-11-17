/**
 * Client utility for tailoring resumes via the secure Node.js AI backend.
 * All API keys and direct AI provider calls have been moved server-side.
 */

const API_BASE = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) || '';

export const GROQ_MODELS = [
  { id: 'openai/gpt-oss-120b', label: 'GPT-OSS 120B (High Quality)' },
  { id: 'openai/gpt-oss-20b', label: 'GPT-OSS 20B (Fast & Lightweight)' },
  { id: 'qwen/qwen3.8-27b', label: 'Qwen 3.8 27B (Coding & Multilingual)' },
  { id: 'grok-beta', label: 'Grok Beta (xAI)' }
];

/**
 * Checks backend AI connectivity and status.
 * Returns { configured: boolean, defaultModel: string, models: Array }
 */
export async function checkAiBackendStatus() {
  try {
    const res = await fetch(`${API_BASE}/api/ai/status`);
    if (!res.ok) {
      return { configured: false, error: `Backend responded with HTTP ${res.status}` };
    }
    const data = await res.json();
    return data;
  } catch (err) {
    return { configured: false, error: err.message || 'Cannot connect to backend server' };
  }
}

/**
 * Legacy stub - returns empty string since API key is securely stored on backend.
 */
export function getDefaultGroqApiKey() {
  return '';
}

/**
 * Sends resume modification/tailoring request to the secure Node.js backend.
 *
 * @param {Object} options
 * @param {string} options.mode - 'jd' or 'prompt'
 * @param {Object} options.currentResume
 * @param {string} [options.jobDescription]
 * @param {string} [options.targetRole]
 * @param {string} [options.prompt]
 * @param {string} [options.apiKey] - Optional client session override key
 * @param {string} [options.model]
 * @param {Function} [options.onProgress]
 */
export async function tailorResumeWithGroq({
  mode = 'jd',
  currentResume,
  jobDescription = '',
  targetRole = '',
  prompt = '',
  apiKey = '',
  model = 'openai/gpt-oss-120b',
  onProgress
}) {
  if (mode === 'prompt') {
    if (!prompt || prompt.trim().length < 5) {
      throw new Error('Please enter a clear instruction or prompt for how you want the resume modified.');
    }
  } else {
    if (!jobDescription || jobDescription.trim().length < 20) {
      throw new Error('Please paste a substantive Job Description (at least a few sentences).');
    }
  }

  if (onProgress) {
    onProgress(
      mode === 'prompt'
        ? `Backend is processing your custom prompt with AI (${model})...`
        : `Backend is analyzing JD and optimizing bullet points with AI (${model})...`
    );
  }

  const endpoint = `${API_BASE}/api/ai/tailor`;

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey.trim() ? { 'x-api-key': apiKey.trim() } : {})
      },
      body: JSON.stringify({
        mode,
        currentResume,
        jobDescription,
        targetRole,
        prompt,
        apiKey: apiKey.trim(),
        model
      })
    });
  } catch (netErr) {
    throw new Error(
      `Failed to connect to AI Backend at ${endpoint}. Please ensure the backend server is running (npm run dev in cv-maker-backend). Error: ${netErr.message}`
    );
  }

  if (!response.ok) {
    let errorDetail = '';
    try {
      const errJson = await response.json();
      errorDetail = errJson.error || JSON.stringify(errJson);
    } catch {
      errorDetail = await response.text();
    }
    throw new Error(errorDetail || `AI Backend error (HTTP ${response.status})`);
  }

  if (onProgress) onProgress('Finalizing and validating tailored resume...');

  const data = await response.json();

  if (!data.tailoredResume) {
    throw new Error('Backend did not return a valid tailored resume.');
  }

  return {
    tailoredResume: data.tailoredResume,
    changesSummary: data.changesSummary || [],
    jdMatchScore: data.jdMatchScore ?? null
  };
}

/**
 * Dynamically computes an honest ATS keyword match percentage
 * between candidate resume and job description text.
 */
export function calculateDynamicJdMatch(resume, jdText) {
  if (!jdText || !resume) return null;

  const extractKeywords = (text) => {
    return (text.toLowerCase().match(/\b[a-z]{3,}\b/g) || []).filter(
      (w) =>
        ![
          'the', 'and', 'for', 'with', 'that', 'this', 'from', 'have',
          'will', 'your', 'about', 'must', 'each', 'such', 'when',
          'what', 'which', 'their', 'work', 'role', 'team', 'help',
          'looking', 'opportunity', 'company', 'equal', 'gender',
          'plus', 'good', 'strong', 'ability', 'degree', 'years'
        ].includes(w)
    );
  };

  const jdKeywords = Array.from(new Set(extractKeywords(jdText)));
  if (jdKeywords.length === 0) return null;

  const resumeText = JSON.stringify(resume).toLowerCase();
  let matches = 0;
  for (const kw of jdKeywords) {
    if (resumeText.includes(kw)) {
      matches += 1;
    }
  }

  const matchRatio = matches / jdKeywords.length;
  return Math.min(98, Math.max(10, Math.round(matchRatio * 100)));
}
