/**
 * Site configuration — single source of truth for values that are not
 * hard-coded content. Update the values below before publishing.
 *
 * Nothing in this file is invented data: every placeholder must be
 * filled in (or intentionally left as-is to keep the related UI hidden)
 * before the site goes live. See README.md → "Before you publish".
 */
window.SITE_CONFIG = {
  /**
   * Business Central / AL professional start date (YYYY-MM-DD).
   * Used to automatically compute "years / months of experience" across
   * the site, so it never needs to be updated by hand again.
   *
   * Set to March 2025 as confirmed by Lucía. The exact day isn't known,
   * so the 1st is used as a neutral placeholder within that month —
   * adjust it if the precise start day should be reflected instead.
   */
  businessCentralStartDate: "2025-03-01",

  /**
   * Contact details. Leave a value as null to automatically hide the
   * related link/button instead of publishing a broken or fake one.
   */
  professionalEmail: "luciaes.dev@gmail.com",
  linkedInUrl: "https://www.linkedin.com/in/luciaes-dev/",
  githubUrl: "https://github.com/LuciaEsteban",
  cvPdfUrls: {
    en: "assets/files/Lucia-Esteban-CV-EN.pdf",
    es: "assets/files/Lucia-Esteban-CV-ES.pdf",
  },

  /**
   * Contact form endpoint. Messages are delivered straight to the inbox
   * through FormSubmit (https://formsubmit.co) — no backend needed on
   * GitHub Pages. The very first message triggers a one-time
   * "Activate form" email to this address; once confirmed, every
   * message arrives automatically. Set to null to fall back to opening
   * the visitor's email app instead.
   */
  contactFormEndpoint: "https://formsubmit.co/ajax/luciaes.dev@gmail.com",

  /**
   * Optional. Only set this if Lucía has explicitly decided to publish
   * her current employer's name on the public site.
   */
  currentCompanyDisplayName: null,

  /**
   * Education dates. Leave as null where the exact date is not defined
   * yet (e.g. an ongoing degree with no fixed graduation date).
   */
  education: {
    damCompletedYear: null, // e.g. "2023"
    computerEngineeringStartYear: null, // e.g. "2024"
  },
};
