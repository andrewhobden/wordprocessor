/**
 * Skip Links Component
 * Provides keyboard navigation shortcuts to main page sections
 * Essential for WCAG 2.1 Guideline 2.4.1 (Bypass Blocks)
 */

// Skip links for accessible navigation

interface SkipLink {
  href: string;
  label: string;
}

const skipLinks: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#toolbar', label: 'Skip to toolbar' },
  { href: '#editor', label: 'Skip to editor' },
];

export function SkipLinks() {
  return (
    <nav aria-label="Skip links">
      {skipLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="skip-link"
          onClick={(e) => {
            e.preventDefault();
            const target = document.querySelector(link.href);
            if (target instanceof HTMLElement) {
              target.focus();
              target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
