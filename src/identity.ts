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
