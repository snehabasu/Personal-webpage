---
name: Sneha Basu
description: Japandi calm, matcha greens, and one bright pink iPod mini.
colors:
  paper: "#F3F1EA"
  paper-recessed: "#EAE7DC"
  paper-raised: "#FBFAF6"
  ink: "#1E221D"
  ink-soft: "#474C44"
  ink-muted: "#676C61"
  line: "#D9D6C9"
  line-strong: "#C9C6B6"
  deep-matcha: "#3F5A2E"
  matcha: "#6E8B3D"
  mid-matcha: "#C9D7A8"
  pale-matcha: "#DDE5C9"
  matcha-mist: "#E9EDDC"
  pale-wood: "#E9DCC4"
  wood-grain: "#B8976A"
  ipod-pink: "#F0559A"
  ipod-pink-deep: "#C2286E"
  pink-on-matcha: "#F7A9CB"
typography:
  display:
    fontFamily: "Shippori Mincho, Hiragino Mincho ProN, Yu Mincho, Georgia, serif"
    fontSize: "clamp(42px, 6.2vw, 84px)"
    fontWeight: 500
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Shippori Mincho, Hiragino Mincho ProN, Yu Mincho, Georgia, serif"
    fontSize: "clamp(32px, 3.6vw, 44px)"
    fontWeight: 500
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Shippori Mincho, Hiragino Mincho ProN, Yu Mincho, Georgia, serif"
    fontSize: "23px"
    fontWeight: 500
    lineHeight: 1.3
  body-large:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, -apple-system, system-ui, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.8
  body:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, -apple-system, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Zen Kaku Gothic New, Hiragino Sans, -apple-system, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
    lineHeight: 1.4
  pixel:
    fontFamily: "Press Start 2P, ui-monospace, monospace"
    fontSize: "10px"
    fontWeight: 400
    lineHeight: 1.7
rounded:
  xs: "4px"
  sm: "6px"
  tile: "12px"
  card: "18px"
  device: "30px"
  pill: "99px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "24px"
  lg: "40px"
  xl: "72px"
  section: "136px"
  section-phone: "96px"
  gutter: "56px"
  gutter-phone: "20px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper-raised}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  button-outline-hover:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
  button-primary-on-matcha:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 22px"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "3px 11px"
  pill-toggle-on:
    backgroundColor: "{colors.deep-matcha}"
    textColor: "{colors.paper-raised}"
    rounded: "{rounded.pill}"
    padding: "6px 14px"
  card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    padding: "40px"
  note-tile:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.tile}"
    padding: "16px 18px 14px"
  tabbar-link-active:
    backgroundColor: "{colors.deep-matcha}"
    textColor: "{colors.paper-raised}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "10px 8px"
---

# Design System: Sneha Basu

## Overview

**Creative North Star: "The Matcha Desk"**

The site is a tidy, warm desk: washi-paper ground, a cup of matcha, paper notes pinned to a tatami mat, and a bright pink iPod mini sitting at the edge. The base is Japandi. That means generous empty space, quiet ink-colored type, natural materials like pale wood and woven tatami, and almost no ornament. The personality comes from objects on the desk, not from decoration on the page. Each object is something a visitor can pick up and use: the iPod plays the podcast, the notes can be dragged, the passport game can be walked through.

Density is low, and the spacing is generous. Sections breathe, with 136px between them on desktop, and each one makes a single statement. Color works in fields, not sprinkles. Whole bands of the page are matcha, and the deep-matcha contact band closes the page like the bottom of a tea bowl. Pink is the one loud voice, and its scarcity is what makes it land.

The feel is soft and tactile. Notes lift gently off the board, buttons are rounded pills, the photo sits in an arched wooden frame, and nothing has a hard edge or a hard shadow.

**Key Characteristics:**
- Washi-paper ground with ink-colored type; matcha owns whole bands of the page.
- A Japanese mincho serif for every heading, and a soft Japanese gothic sans for everything you read.
- One signature object, the pink iPod mini, plus a few small pink accents.
- Soft lift and real offsets on shadows, rounded pills, and arched and woven natural materials.
- Interactive, physical-feeling objects in place of generic cards.

## Colors

A restrained natural palette of paper, ink, matcha and pale wood, broken by exactly one saturated pink.

### Primary
- **Deep Matcha** (`deep-matcha`): the system's anchor color. It fills the contact band and footer, the active pill in toggles and the phone tab bar, company names in the timeline, the emphasised words in the hero heading, and the tatami board's edge bands.
- **Matcha** (`matcha`): a brighter working green for underline accents on hover, collected-stamp dots in the game, and link underline tints.

### Secondary
- **iPod Pink** (`ipod-pink`): the iPod mini's body and click wheel, the hanko-style name seal, focus rings, the dot inside the primary button, one strip of washi tape, and the game character's shirt. Nothing else.
- **Deep iPod Pink** (`ipod-pink-deep`): pink that can carry text on paper, used for the "say hi." link, the playing episode in the episode list, and labels in the game.
- **Pink on Matcha** (`pink-on-matcha`): the softened pink used on the deep-matcha band, for the emphasised word "Curious" in the contact heading and its focus rings.

### Tertiary
- **Pale Wood** (`pale-wood`): hinoki-style wood for the photo's arched frame, the iPod's shelf, and the capstone note.
- **Wood Grain** (`wood-grain`): the darker grain line in wood textures, and the second strip of washi tape.

### Neutral
- **Paper** (`paper`): the page ground everywhere outside the matcha bands.
- **Recessed Paper** (`paper-recessed`): sunken wells, like the photo placeholder.
- **Raised Paper** (`paper-raised`): anything that lifts: cards, notes, the header's mobile menu, and button text on ink.
- **Ink** (`ink`): headings and primary text, the primary button, and the dark podcast note.
- **Soft Ink** (`ink-soft`): body copy and nav links.
- **Muted Ink** (`ink-muted`): dates, meta lines, asides and chip text. It holds 4.5:1 contrast on Paper.
- **Line** (`line`) and **Strong Line** (`line-strong`): 1px hairline dividers between timeline rows and list items, and borders for outline buttons and chips.
- **Matcha Mist** (`matcha-mist`), **Pale Matcha** (`pale-matcha`) and **Mid Matcha** (`mid-matcha`): the green field behind Now Building, text-highlight marker strokes and text selection, and the RL-for-my-game note.

### Named Rules
**The One Pink Rule.** Pink belongs to the iPod. Outside it, pink appears only as small signals: the seal, focus rings, one tape strip, one button dot, and one playing-state highlight. Never use pink for a section background, a heading, or a large button.

**The Fields Not Sprinkles Rule.** Matcha appears as whole regions (a full-bleed band, a board, an active pill) or as a single accent word. Don't scatter green chips and borders across neutral sections.

## Typography

**Display Font:** Shippori Mincho (with Hiragino Mincho, Yu Mincho, Georgia)
**Body Font:** Zen Kaku Gothic New (with Hiragino Sans and the system sans)
**Pixel Font:** Press Start 2P, for the passport game only

**Character:** A Japanese mincho serif with fine strokes and calm proportions sets every heading, which gives the page the stillness of a printed tea menu. A soft, open Japanese gothic carries all reading text, so long passages feel friendly rather than corporate.

### Hierarchy
- **Display** (500, clamp(42px–84px), 1.1): the hero heading only. The emphasised words switch to Deep Matcha at weight 600, never italic.
- **Headline** (500, clamp(32px–44px), 1.15): section titles such as "Now building." and "On the mic", plus the contact heading at a larger size.
- **Title** (500, 17–23px, 1.25–1.4): timeline roles, note titles, episode titles, and writing titles.
- **Body Large** (400, 18px, 1.8): the hero bio, capped at 64ch.
- **Body** (400, 15–16px, 1.65–1.75): descriptions and notes, capped at about 60–62ch.
- **Label** (400–500, 12–14px): dates, meta lines, asides, nav and chips. Numbers use tabular figures.

### Named Rules
**The No Eyebrow Rule.** Headings stand alone. No small labels or section numbers above them; meta lines go below the heading.

**The No Mono Costume Rule.** There is no monospace font in the system. Technical credibility comes from the content, not from typewriter type. The only exception is the pixel font inside the game's own world.

## Layout

- **Container:** a single column, at most 1120px wide, with a 56px side gutter (20px on phones).
- **Full-bleed bands:** Now Building and Contact break out to the full window width. The page clips horizontal overflow so these never cause sideways scrolling.
- **Section rhythm:** sections are 136px apart on desktop and 96px on phones. Each opens with a section head: the title on the left and a short muted aside on the right, which wraps beneath it when narrow.
- **Hero:** an asymmetric two-column grid. The heading runs wide on the left, and the arched photo (260px) sits bottom-aligned on the right. On phones the photo moves above the heading at 170px.
- **Podcast:** the iPod (340px column) sits on the left and the episode details on the right. Below 960px they stack.
- **Breakpoints:** 960px stacks the podcast. 820px collapses the nav, single-columns every grid, and stacks timeline rows. At 640px and under, the passport game is hidden, Now Building notes become a static centered column, and a bottom tab bar replaces the menu button.

## Elevation & Depth

A hybrid system. Most surfaces are flat paper divided by 1px hairlines. Objects that sit *on* the desk lift off it with soft, offset, ambient shadows: notes, the writing card, the game frame, the photo frame and the iPod. Depth always has a real vertical offset and a soft blur; nothing glows.

### Shadow Vocabulary
- **Soft** (`0 1px 2px rgba(30,34,29,0.06), 0 8px 24px -6px rgba(30,34,29,0.14)`): resting cards: the writing feature, the game frame, and the tatami board.
- **Lift** (`0 2px 4px rgba(30,34,29,0.08), 0 22px 40px -12px rgba(30,34,29,0.28)`): framed objects (the photo arch) and overlays (the game's completion card).
- **Note** (`0 1px 2px rgba(30,34,29,0.08), 0 10px 22px -10px rgba(30,34,29,0.32)`): pinned notes at rest. On hover the long shadow grows to 30px of blur, and while dragging to 44px.
- **Device** (layered inset highlights plus `0 26px 36px -16px rgba(120,30,70,0.45)`): the iPod only. It has a pink-tinted cast shadow and inset highlights for the anodized edge.

### Named Rules
**The Objects Lift, Pages Don't Rule.** Only things that could physically sit on the desk get a shadow. Sections, bands and lists stay flat and use hairlines.

**The No Hard Shadow Rule.** Never use a zero-blur offset shadow. Even the pixel game uses soft shadows.

## Shapes

Soft geometry throughout. Interactive controls are full pills (99px). Cards are softly rounded (18px), notes slightly less (12px), and the iPod has device-like corners (30px). The photo uses an arch, round on top and gently squared at the bottom (140px top corners, 18px bottom), like a window in a tea house. Natural textures are drawn with fine repeating CSS lines rather than images: wood grain on the frame and shelf, a woven tatami pattern on the Now Building board. Icons are drawn in-house as 1.6px-stroke line icons with round caps.

## Components

### Buttons
- **Shape:** full pill (99px).
- **Primary:** an ink pill with raised-paper text and a small pink dot (8px, with a soft pink halo) leading the label. On hover it rises 1px with a soft ink shadow.
- **Outline:** a transparent pill with a 1px Strong Line border and ink text. On hover the border darkens to ink and the fill turns Raised Paper.
- **On the matcha band:** primary inverts to a raised-paper fill with ink text. Outline uses a translucent paper border and paper text.
- **Focus:** a 2px iPod Pink outline offset 3px everywhere, or Pink on Matcha inside the contact band.

### Chips
- **Style:** a transparent pill with a 1px Strong Line border and muted 12px label text (timeline tags such as "PM" and "SWE"). Inside notes, chips use the note's own text color for their border.
- **Toggle pills:** connected pill groups (the game's options) with hairline separators. The selected segment fills Deep Matcha.

### Cards / Containers
- **Corner Style:** 18px for cards, 12px for notes.
- **Background:** Raised Paper. Notes may use Ink, Mid Matcha or Pale Wood instead.
- **Shadow Strategy:** Soft for cards, Note for pinned notes (see Elevation & Depth).
- **Border:** none. Separation comes from the lift.
- **Internal Padding:** 40px for feature cards (24–28px on phones), 16–18px for notes.

### Navigation
- **Desktop:** a sticky header on Paper with a hairline bottom border. On the left are the pink seal, the name in mincho and a muted tagline. On the right are lowercase section links in Soft Ink, which on hover draw a 1px matcha underline from left to right.
- **Tablet (641–820px):** a "menu" pill opens a stacked list.
- **Phone (≤640px):** a floating bottom tab bar on Raised Paper with a soft lift, inset 12px from the edges and clear of the home indicator. The section being read is filled Deep Matcha and updates as you scroll.

### Pink iPod Mini (signature component)
A working, faithful iPod mini is the podcast player. It has an anodized pink body with a brushed texture and white end caps, and a grey-green LCD with a glass sheen. The status bar shows the play state and a battery. The click wheel is a pink ring with MENU, previous, next and play/pause, plus a pink center button.
- **Behavior:** rotating around the ring scrolls the episode list (one step per 24°), and on the Now Playing screen it adjusts volume. The center button plays the highlighted episode. MENU slides back to the list. The screen slides between views in 0.42s with a soft ease-out, like the original. A quiet tick sounds on each step, but only after the visitor's first touch.
- **Keyboard:** the wheel takes focus. Arrow keys scroll, Enter selects, Space plays or pauses, and Escape returns to the menu.
- **Text:** all LCD text is at least 11px.

### Tatami Board
Now Building is a woven tatami mat with Deep Matcha edge bands, slightly rotated paper notes, and two strips of washi tape (one pink, one wood). Notes drag and reset on wider screens. On phones they become a static, centered column so page scrolling always works.

### Arched Photo Frame
The headshot sits inside a pale-wood arch frame with fine grain lines and the Lift shadow.

## Do's and Don'ts

### Do:
- **Do** keep pink scarce: it belongs to the iPod, plus small signals (seal, focus ring, button dot, one tape strip, the playing episode).
- **Do** let matcha own whole regions, like full-bleed bands and the board, rather than sprinkling it.
- **Do** set every heading in Shippori Mincho at weight 500, and emphasise with Deep Matcha color and weight 600, never italics.
- **Do** give anything that sits on the desk a soft, offset shadow, and keep everything else flat with 1px hairlines.
- **Do** use full pills for every control, and give each one hover and focus states with the 2px pink focus ring.
- **Do** keep functional text at 11px or larger, including on the iPod screen.
- **Do** make new signature pieces real objects that work, the way the iPod plays and the notes drag.

### Don't:
- **Don't** put small labels or section numbers above headings.
- **Don't** introduce a monospace font outside the game.
- **Don't** use hard zero-blur offset shadows, glows, or gradient text.
- **Don't** use pink for backgrounds, headings, or large buttons.
- **Don't** use Unicode glyphs or emoji as icons. Use the drawn 1.6px line icons.
- **Don't** make draggable or swipe-capturing surfaces on phones that block page scrolling.
