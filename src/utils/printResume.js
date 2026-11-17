/**
 * Triggers native browser print with pre-configured single-page CSS print rules.
 * This is the gold standard for resumes:
 * - 100% Vector PDF (infinitely crisp typography, selectable text)
 * - Clickable URLs and links
 * - Fully readable by Applicant Tracking Systems (ATS)
 * - Zero rasterization or canvas conversion
 */
export function printResume() {
  window.print();
}
