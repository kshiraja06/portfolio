# Portfolio design system

## Direction

The attached six-page brief is the source of truth: a warm, paper-like
background; the supplied star; a rounded display face paired with a monospaced
utility face; and Work, Tinker, and About destinations. Work, Tinker, and About
are separate pages with shared navigation and a persistent theme. Work uses
solid-color project cards and individual case studies; Tinker is a filterable
masonry board; About follows a sectioned biography layout. No portfolio photos
or illustrative project placeholders are used.

The colors below are visual estimates from the supplied PDF cover swatches. The
corresponding CSS custom properties live at the top of `styles.css`.

| Portfolio token | Value | Use |
| --- | --- | --- |
| Paper | `#faf8f3` | Main canvas |
| Surface | `#fffefa` | Raised UI and artwork |
| Ink | `#242122` | Main text and contrast |
| Ink soft | `#625e5e` | Supporting copy |
| Muted | `#918d87` | Captions and secondary labels |
| Line | `#e8e4dc` | Hairlines and dividers |
| Periwinkle | `#91a8e8` | Hero emphasis and accents |
| Pale periwinkle | `#dce2f2` | Soft artwork and selection |
| Lilac | `#c9a9d3` | Star mark and decorative accents |
| Lime | `#c7dd70` | Active navigation and highlights |
| Olive | `#85864f` | Labels and links |

## Type and icons

- **Alata** is the rounded display and body face; **Cousine** is the
  monospaced face for navigation, metadata, and small labels. Both load from
  Google Fonts, with local system fallbacks.
- `assets/star.svg` is the supplied star asset and doubles as the favicon and
  brand mark. Dark-mode sky decorations are five-point stars in varied sizes,
  with a soft animated glow. The moon/sun theme control and arrows use small
  inline SVG or text glyphs. The reference design-system page does not name an
  icon library.
- The reference About page also shows its logo, a map pin, an academic-cap
  symbol, and a filled heart for community content. The source does not identify
  a shared icon pack for these assets.

## Layout and motion

- A centered `1120px` content frame uses a fluid page gutter. Work has a
  two-column project grid and individual case studies; Tinker has a responsive
  three-column CSS masonry pinboard; About pairs a section index with a profile
  and structured sections.
- Work panels use solid colors and rounded corners. Tinker descriptions reveal
  on hover, keyboard focus, or touch. Hairline dividers separate About sections.
- `--duration-fast`, `--duration-medium`, `--duration-slow`, `--ease-out`, and
  `--ease-smooth` define the shared motion vocabulary. Page entry, cross-page
  transitions, project cards, dark-mode stars, and navigation use this system.
  Motion respects `prefers-reduced-motion`; a custom square cursor is only used
  with a fine pointer.
- Theme choice persists between page visits. The loading screen appears once at
  the start of a browsing session. Project cards link directly to their
  individual case studies, whose content mixes comparison panels, process
  columns, outcome tiles, and four-part grids instead of repeating one section
  layout.
- Tinker filters by medium and status. Thought Companions' task list is saved
  in browser storage only.

## About page structure

The About page follows the reference's profile-first structure and section
index: **Hi!**, **Experience**, **Community**, **Philosophy**, **Shelf**,
**Lore**, **Tools**, **Inspiration**, and **Contact**. Biography, experience,
community, favorite, and contact details not supplied in the brief remain
identified as details to come rather than invented personal history.

## Reference system notes

The [Liu Michelle design system](https://liumichelle.com/design-system) documents
the following tokens and type families. They are useful reference material, not
the palette applied to this brief's distinctly warmer visual direction.

### Colors

| Group | Tokens |
| --- | --- |
| Zinc | `zinc-900 #18181b`, `zinc-800 #27272a`, `zinc-700 #3f3f46`, `zinc-600 #52525b`, `zinc-500 #71717a`, `zinc-400 #a1a1aa`, `zinc-300 #d4d4d8`, `zinc-200 #e4e4e7`, `zinc-100 #f4f4f5`, `zinc-50 #fafafa`, `white #ffffff` |
| Blue | `blue-600 #2563eb`, `blue-500 #3b82f6`, `blue-400 #60a5fa`, `blue-300 #93c5fd`, `blue-100 #dbeafe`, `blue-50 #eff6ff` |
| Pink | `pink-500 #ec4899`, `pink-50 #fdf2f8` |
| Adobe accents | `Adobe pink #F63768`, `Adobe pink deep #DE3C82`, `Adobe pink soft #F777B0`, `Adobe blush #FF8EAB`, `Adobe orange #FD9A00`, `Adobe orange soft #FFB748`, `Adobe sky #32A7F9`, `Adobe sky soft #88CEFF`, `Adobe cyan #34A9F3` |
| Status | `emerald-500 #10b981`, `emerald-600 #059669`, `emerald-50 #ecfdf5`, `green-200 #bbf7d0`, `red-500 #ef4444`, `red-400 #f87171` |

### Typography, shape, and elevation

- The reference lists **Figtree**, **SF Pro**, **Courier New**, and **SF Mono**.
  Its text sizes are 12, 14, 16, 18, 20, 24, 30, 36, and 48px, plus a 36px
  display name.
- Radius families range from small community/photo frames through `rounded-xl`,
  `rounded-2xl`, `rounded-3xl`, and a signature `26px` project radius. Pills
  and circles remain round; the page also calls out squircle corners where
  supported.
- Named shadows are `shadow-soft`, `shadow-default`,
  `shadow-default-hover`, `shadow-media`, `shadow-elevated`, and `shadow-glass`.
- The documented spacing rhythm uses 4, 8, 12, 16, 24, 32, 48, 64, and 80px
  steps, with 64px / 24px primary page gutters and 32px mobile gutters.

The reference page does not publish named animation curves or durations, so
this portfolio uses its own small, explicit motion scale rather than claiming
to reproduce undocumented values.
