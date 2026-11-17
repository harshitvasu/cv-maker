# Single-Page Resume PDF Maker (React)

A modern, professional single-page resume builder built with React and Vite. It provides an interactive left sidebar for editing content in real-time, an authentic A4 single-page preview on the right, and high-resolution PDF export capabilities.

---

## ✨ Features

- **Strict Single-Page Design**:
  - Exact A4 paper dimensions (`210mm x 297mm`).
  - **Live Page Capacity Meter**: Automatically detects if your content fits 100% on a single page or exceeds it.
  - **Auto-Fit Engine**: One-click adjustment to automatically optimize font size and spacing density so content fits strictly on 1 page.
- **Accurate Resume Layout (Prompt Specification)**:
  1. **Name Headline**: Prominently displayed at the top.
  2. **Contact Details**: 3-4 fields (Phone, Email, LinkedIn, Location) formatted cleanly with separators.
  3. **Summary Section**: Clean heading followed by professional summary.
  4. **Skills Section**: High-density bullet points (categorized or general).
  5. **Experience Section**:
     - Header format: `Job title | Company name, Location        Date range(From - to)`
     - Bullet points with measurable achievements.
  6. **Education Section**: Subheading `Education` followed by degrees, institutions, graduation dates, and honors.
- **Export & Print Capabilities**:
  - **Direct PDF Export**: High-resolution 2.5x retina PDF generation using `jsPDF` + `html2canvas`.
  - **Native Browser Print / Save as PDF**: Fully customized `@media print` CSS with zero margins and single-page locks.
- **Quad-Mode Editing & Management**:
  - **Form Fields Mode**: Guided, collapsible accordion cards for Personal Info, Summary, Skills, Experience, Projects, Education, and Single-Page Fit controls.
  - **JSON Mode**: Direct JSON editing with live syntax validation, auto-prettify formatting, clipboard copy, file import/upload, and export/download. Real-time two-way synchronization with the resume preview.
  - **Saved Profiles Manager**: Save multiple resume variations (e.g. "Senior Backend - Stripe", "Fullstack Lead"), switch between them with 1 click, duplicate, rename, or export each version.
  - **AI Resume Tailor (Secure Backend)**: Paste any Job Description (JD) or custom prompt to automatically tailor your summary, skills, and experience bullet points via the dedicated Node.js AI backend (`cv-maker-backend`). Provides a match score, highlights optimizations made, and enforces strict single-page limits with complete security (API keys never touch the client bundle).
- **Scrollable & Responsive Architecture**:
  - Full-container vertical scrolling with custom visible scrollbars.
  - Internal box scrolling for individual section bodies and multi-line textareas.
  - Typography options: Inter, EB Garamond, Roboto, Merriweather.
  - Spacing density controls (Compact, Normal, Relaxed).
  - Canvas zoom controls (Zoom In, Zoom Out, Fit to Window).
  - Instant sample data loader & clean slate reset.
  - LocalStorage persistence to never lose your edits.

---

## 🚀 Getting Started

1. **Install Dependencies** (already installed in workspace):
   ```bash
   npm install
   ```

2. **Start Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

---

## 📁 Project Architecture

```
cv-maker/
├── index.html                 # HTML shell with Google Fonts
├── package.json               # Dependencies (React 18, Vite, jsPDF, html2canvas, lucide-react)
├── vite.config.js             # Vite configuration with React plugin
└── src/
    ├── App.jsx                # Main layout coordinator (Sidebar + Preview + Toolbar)
    ├── main.jsx               # React entry point
    ├── index.css              # A4 sheet styling, typography, print rules
    ├── components/
    │   ├── ResumeForm.jsx     # Left sidebar with dynamic input fields & accordions
    │   ├── ResumePreview.jsx  # Right side single-page A4 canvas matching required format
    │   └── Toolbar.jsx        # Top action bar (Zoom, Page Fit Indicator, Export PDF, Print)
    ├── data/
    │   └── sampleData.js      # Realistic, professional single-page starter template
    └── utils/
        └── exportPdf.js       # High-DPI jsPDF generator and print triggers
```
