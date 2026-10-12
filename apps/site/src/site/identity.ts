import { faInstagram, faLinkedinIn } from "@fortawesome/free-brands-svg-icons";
export const email = "madamou@afin-consulting.com";
export const linkedin =
  "https://www.linkedin.com/in/matt-adamou-p-e-9b7059111/";
export const instagram =
  "https://www.instagram.com/adamoufinancial.consulting/";
const brandIcon = ({
  icon: [width, height, , , paths],
}: typeof faInstagram) => /* HTML */ `
  <svg viewBox="0 0 ${width} ${height}" aria-hidden="true" fill="currentColor">
    <!-- Font Awesome Free https://fontawesome.com/license/free CC BY 4.0 -->
    ${[paths]
      .flat()
      .map(
        (path) => /* HTML */ `
          <path d="${path}" />
        `,
      )
      .join("")}
  </svg>
`;
export const linkedIcon = brandIcon(faLinkedinIn);
export const instagramIcon = brandIcon(faInstagram);

export function uiIcon(name: string) {
  const paths: Record<string, string> = {
    tag: '<path d="M3 3h7l11 11-7 7L3 10Z"/><circle cx="7" cy="7" r="1"/>',
    balance:
      '<path d="M12 3v18M5 21h14M4 7h16M6 7l-4 8h8L6 7Zm12 0-4 8h8l-4-8Z"/>',
    growth: '<path d="M4 20V4M4 20h17M7 15l5-5 4 2 5-7M16 5h5v5"/>',
    loan: '<path d="m3 9 9-6 9 6H3ZM5 12v6m7-6v6m7-6v6M3 21h18"/>',
    inflation:
      '<circle cx="12" cy="12" r="9"/><path d="M8 16l8-8M8 8h.01M16 16h.01"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4m10-4v4M3 11h18M7 15h2m4 0h2m-8 3h2"/>',
    checklist:
      '<path d="m3 6 2 2 3-4m3 2h10M3 13l2 2 3-4m3 2h10M3 20l2 2 3-4m3 2h10"/>',
    wallet:
      '<path d="M20 8V5H5a2 2 0 0 0-2 2v12h18V8H5a1 1 0 0 1 0-2M21 12h-6v4h6"/><path d="M17 14h.01"/>',
    debt: '<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M3 8h18M8 21h8M12 17v4M7 12h3"/>',
    target:
      '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    conversation:
      '<path d="M21 11a8 8 0 0 1-8 8H7l-4 3V11a9 9 0 0 1 18 0Z"/><path d="M7 10h10M7 14h6"/>',
    phone:
      '<path d="m7 3 3 5-3 3a16 16 0 0 0 6 6l3-3 5 3-1 4C10 22 2 14 3 4Z"/>',
    shield:
      '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
    download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
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
  return /* HTML */ `
    <svg
      class="ui-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      ${paths[name] || paths.page}
    </svg>
  `;
}
