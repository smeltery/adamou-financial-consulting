# Brand guide

The public `/brand/` page includes a downloadable, text-free SVG mountain mark,
redrawn from the supplied business card. Keep its proportions and use the mark
on a light background with clear space equal to one peak’s height.

| Role                                 | Color     |
| ------------------------------------ | --------- |
| Deep blue / text and calls to action | `#204F60` |
| Warm paper / background              | `#F7F4EB` |
| Sage / illustration and accents      | `#78978E` |
| Sand / illustration accent           | `#E7C78C` |

Georgia headlines and system sans-serif body text need no external font requests.
Use clear, personal, practical language. Avoid pressure, jargon, invented
credentials, and promises of specific financial outcomes.

The hero uses a locally hosted Unsplash photograph of a mountain path by
[Valentin](https://unsplash.com/photos/winding-path-through-a-green-mountain-valley-MIfIDLi_PIE),
free under the [Unsplash License](https://unsplash.com/license). The logo stays SVG. Matt’s provided portrait appears in
the About section. The LinkedIn icon accompanies the profile link; it does not
imply an affiliation or endorsement.

Services and contact details come from the supplied business cards. LinkedIn
was behind a sign-in wall, so no additional biography or credentials were
inferred from it.

The 1200 × 630 social card is `/assets/afin-social.png`. Rebuild the editable SVG
and PNG with `bun scripts/social.ts` after changing the brand design.

Social brand icons use [Font Awesome Free](https://fontawesome.com/license/free)
(CC BY 4.0); their marks identify linked profiles, not endorsements.

The dedicated `/assets/afin-favicon.svg` uses a warm-paper tile and a heavier stroke for contrast at small sizes in light and dark tabs. The primary logo stays unchanged.

## Workspace social preview

The private app uses its own 1200 × 630 card at
`https://afin-workspace.vercel.app/afin-workspace-social.png`. It shares the
marketing site's mountain photograph, symbol, palette, and type treatment, with
workspace-specific copy. Rebuild both editable SVG and PNG using
`bun scripts/social.ts --workspace` from the repository root.

The image and social metadata are public branding only; they never include
client records or dashboard screenshots. The workspace remains marked noindex
and requires authentication for client data. Update the absolute Open Graph and
Twitter image URLs in `apps/console/index.html` if its production domain changes.
