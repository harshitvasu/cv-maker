import React, { useEffect, useRef } from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

// Crisp inline SVG for LinkedIn
const LinkedinIcon = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ display: 'inline-block', verticalAlign: 'middle' }}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export default function ResumePreview({ resumeData, onOverflowChange }) {
  const pageRef = useRef(null);

  // Check whether content fits within single A4 page
  useEffect(() => {
    const checkOverflow = () => {
      if (!pageRef.current) return;
      const el = pageRef.current;
      const scrollHeight = el.scrollHeight;
      const clientHeight = el.clientHeight;
      const overflowRatio = scrollHeight / clientHeight;
      const isOverflowing = scrollHeight > clientHeight + 4; // allow 4px leeway
      
      if (onOverflowChange) {
        onOverflowChange({
          isOverflowing,
          ratio: Math.round(overflowRatio * 100),
          scrollHeight,
          clientHeight
        });
      }
    };

    checkOverflow();
    window.addEventListener('resize', checkOverflow);
    return () => window.removeEventListener('resize', checkOverflow);
  }, [resumeData, onOverflowChange]);

  const { personalInfo, summary, skills, experiences, projects = [], education, settings } = resumeData;

  // Selected typography font family for body
  const resolveFontFamily = (fontName, fallback = '"Inter", sans-serif') => {
    switch (fontName) {
      case 'Cinzel':
        return '"Cinzel", Georgia, serif';
      case 'Montserrat':
        return '"Montserrat", -apple-system, sans-serif';
      case 'Playfair Display':
        return '"Playfair Display", Georgia, serif';
      case 'EB Garamond':
        return '"EB Garamond", Garamond, serif';
      case 'Merriweather':
        return '"Merriweather", serif';
      case 'Roboto':
        return '"Roboto", sans-serif';
      case 'Inter':
        return '"Inter", -apple-system, sans-serif';
      default:
        return fallback;
    }
  };

  const fontStyle = {
    fontFamily: resolveFontFamily(settings.fontFamily, '"Inter", sans-serif')
  };

  // Distinct font for Name Headline ("Harshit Vasu")
  const nameFontStyle = {
    fontFamily: resolveFontFamily(settings.nameFontFamily || 'Cinzel', '"Cinzel", serif'),
    letterSpacing: (settings.nameFontFamily || 'Cinzel') === 'Cinzel' ? '0.06em' : '0.03em'
  };

  // Filter non-empty contact items
  const contactItems = [];
  if (personalInfo.phone) {
    contactItems.push({
      key: 'phone',
      icon: <Phone size={12} />,
      label: personalInfo.phone,
      href: `tel:${personalInfo.phone}`
    });
  }
  if (personalInfo.email) {
    contactItems.push({
      key: 'email',
      icon: <Mail size={12} />,
      label: personalInfo.email,
      href: `mailto:${personalInfo.email}`
    });
  }
  if (personalInfo.linkedin) {
    const cleanLinkedin = personalInfo.linkedin.replace(/^https?:\/\//, '');
    contactItems.push({
      key: 'linkedin',
      icon: <LinkedinIcon size={12} />,
      label: cleanLinkedin,
      href: personalInfo.linkedin.startsWith('http')
        ? personalInfo.linkedin
        : `https://${personalInfo.linkedin}`
    });
  }
  if (personalInfo.location) {
    contactItems.push({
      key: 'location',
      icon: <MapPin size={12} />,
      label: personalInfo.location,
      href: null
    });
  }

  return (
    <div
      id="resume-page-container"
      ref={pageRef}
      className={`single-page-paper font-size-${settings.fontSize || 'sm'} spacing-${settings.spacing || 'compact'}`}
      style={fontStyle}
    >
      <div className="resume-content">
        {/* ================= 1. NAME HEADLINE & CONTACT DETAILS ================= */}
        <header className="resume-header">
          <h1 className="resume-name-headline" style={nameFontStyle}>
            {personalInfo.fullName || 'YOUR NAME'}
          </h1>

          <div className="resume-contact-details">
            {contactItems.map((item, idx) => (
              <React.Fragment key={item.key}>
                {idx > 0 && <span className="contact-separator">•</span>}
                {item.href ? (
                  <a
                    href={item.href}
                    className="contact-item"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <span className="contact-item">{item.label}</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </header>

        {/* ================= 2. SUMMARY SECTION ================= */}
        {summary && summary.trim().length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading">Summary</h2>
            <p className="resume-summary-text">{summary}</p>
          </section>
        )}

        {/* ================= 3. SKILLS SECTION (BULLET POINTS) ================= */}
        {skills && skills.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading">Skills</h2>
            <ul className="resume-skills-list">
              {skills.map((skill, index) => {
                // If skill contains a colon, bold the prefix for professional presentation
                const colonIdx = skill.indexOf(':');
                if (colonIdx > 0 && colonIdx < 30) {
                  const prefix = skill.slice(0, colonIdx + 1);
                  const rest = skill.slice(colonIdx + 1);
                  return (
                    <li key={index} className="resume-skill-item">
                      <strong>{prefix}</strong>
                      {rest}
                    </li>
                  );
                }
                return (
                  <li key={index} className="resume-skill-item">
                    {skill}
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {/* ================= 4. EXPERIENCE SECTION ================= */}
        {/* Format: Job title | Company name, Location \t\t\t Date range(From - to) */}
        {experiences && experiences.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading">Experience</h2>
            <div className="experience-list">
              {experiences.map((exp) => (
                <article key={exp.id} className="experience-item">
                  <div className="experience-header-line">
                    <div className="experience-title-company">
                      <span className="experience-job-title">{exp.jobTitle}</span>
                      <span className="experience-separator">|</span>
                      <span className="experience-company-loc">
                        {exp.companyName}
                        {exp.location ? `, ${exp.location}` : ''}
                      </span>
                    </div>
                    <div className="experience-date-range">
                      {exp.dateRange}
                    </div>
                  </div>

                  {/* Points of the experience */}
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="experience-bullets">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="experience-bullet-item">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= 5. PROJECTS SECTION (May be blank/omitted) ================= */}
        {projects && projects.length > 0 && projects.some(p => p.projectName?.trim() || (p.bullets && p.bullets.some(b => b.trim()))) && (
          <section className="resume-section">
            <h2 className="resume-section-heading">Projects</h2>
            <div className="experience-list">
              {projects.map((proj) => (
                <article key={proj.id} className="experience-item">
                  <div className="experience-header-line">
                    <div className="experience-title-company">
                      <span className="experience-job-title">{proj.projectName}</span>
                      {proj.technologies && (
                        <>
                          <span className="experience-separator">|</span>
                          <span className="experience-company-loc">{proj.technologies}</span>
                        </>
                      )}
                    </div>
                    {proj.dateRange && (
                      <div className="experience-date-range">
                        {proj.dateRange}
                      </div>
                    )}
                  </div>

                  {proj.bullets && proj.bullets.length > 0 && (
                    <ul className="experience-bullets">
                      {proj.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="experience-bullet-item">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* ================= 6. EDUCATION SECTION ================= */}
        {/* Followed by the degrees */}
        {education && education.length > 0 && (
          <section className="resume-section">
            <h2 className="resume-section-heading">Education</h2>
            <div className="education-list">
              {education.map((edu) => (
                <article key={edu.id} className="education-item">
                  <div className="education-header-line">
                    <div className="education-degree-inst">
                      <span className="education-degree">{edu.degree}</span>
                      <span className="experience-separator">|</span>
                      <span className="experience-company-loc">
                        {edu.institution}
                        {edu.location ? `, ${edu.location}` : ''}
                      </span>
                    </div>
                    <div className="education-date-range">
                      {edu.dateRange}
                    </div>
                  </div>

                  {edu.details && (
                    <div className="education-details">
                      {edu.details}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Screen-only footer watermark */}
      <div className="page-limit-footer">
        Single-Page Print Layout (A4)
      </div>
    </div>
  );
}
