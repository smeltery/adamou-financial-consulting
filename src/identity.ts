import { faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
export const email = "madamou@afin-consulting.com";
export const linkedin =
  "https://www.linkedin.com/in/matt-adamou-p-e-9b7059111/";
export const instagram =
  "https://www.instagram.com/adamoufinancial.consulting/";
const brandIcon = ({ icon: [width, height, , , paths] }: typeof faInstagram) =>
  `<svg viewBox="0 0 ${width} ${height}" aria-hidden="true" fill="currentColor"><!-- Font Awesome Free https://fontawesome.com/license/free CC BY 4.0 -->${[
    paths,
  ]
    .flat()
    .map((path) => `<path d="${path}"/>`)
    .join("")}</svg>`;
export const linkedIcon = brandIcon(faLinkedinIn);
export const instagramIcon = brandIcon(faInstagram);

export function uiIcon(name: string) {
  const paths: Record<string, string> = {
    home: '<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
    person:
      '<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    compass: '<circle cx="12" cy="12" r="9"/><path d="m16 8-2 6-6 2 2-6z"/>',
    briefcase:
      '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4 4"/>',
    close: '<path d="m6 6 12 12M6 18 18 6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    page: '<path d="M6 3h8l4 4v14H6zM14 3v5h4M9 12h6M9 16h6"/>',
    tools:
      '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2"/>',
    contact:
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
    chevron: '<path d="m9 5 7 7-7 7"/>',
    switch: '<path d="m8 8 4-4 4 4M8 16l4 4 4-4"/>',
  };
  return `<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.page}</svg>`;
}
