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
   * TODO(Lucía): replace with your exact start date. Until you do, the
   * placeholder below keeps the "professionally since 2025" claim true
   * without pretending to know the exact day.
   */
  businessCentralStartDate: "2025-01-01",

  /**
   * Contact details. Leave a value as null to automatically hide the
   * related link/button instead of publishing a broken or fake one.
   */
  professionalEmail: null, // e.g. "lucia@example.com"
  linkedInUrl: null, // e.g. "https://www.linkedin.com/in/..."
  githubUrl: "https://github.com/LuciaEsteban",
  cvPdfUrl: null, // e.g. "assets/files/lucia-esteban-cv.pdf"

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
