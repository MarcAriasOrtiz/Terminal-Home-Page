# Design Direction — mao.home

## Core concept

A modern Linux terminal with a restrained cyberpunk aesthetic.

The website should feel like a personal computing environment built by someone who enjoys Linux, infrastructure, AI and self-hosting.

It is a real interactive portfolio presented through a fictional shell, not a screenshot of a terminal and not a generic developer landing page.

The visual balance should be:
- 65% functional Linux terminal
- 25% modern cyberpunk interface
- 10% personality and playful details

These proportions describe the creative direction, not literal screen measurements.

## Visual identity

### Color palette
- Void black: `#090B10` — main background.
- Graphite: `#111722` — panels and secondary surfaces.
- Terminal green: `#B6FF6C` — prompts, active states and primary accents.
- Cyber cyan: `#55E6FF` — paths, links and secondary accents.
- Neon magenta: `#FF4FD8` — rare decorative highlights.
- Soft white: `#DCE5F0` — primary readable text.
- Muted slate: `#8293A8` — secondary information.

Use CSS custom properties for the palette.

Green and cyan are the main accents. Magenta must remain rare. Avoid excessive glow, large neon text and low-contrast colored paragraphs.

## Typography

- Use a readable monospace font for the shell, prompts, paths and technical metadata.
- Use a clear typographic hierarchy for longer content.
- Prefer restrained weights and sizes over excessive visual effects.
- Keep body text comfortable to read on desktop and mobile.
- Use locally available fonts or well-supported fallbacks; do not require an external font service for the interface to work.

## Layout

- The terminal is the primary interface.
- Use a dark, restrained background with subtle borders and layered surfaces.
- Introduce small system-status indicators and technical metadata where useful.
- Keep spacing consistent and information easy to scan.
- Use subtle grid or scanline effects only when they do not reduce readability.
- Avoid excessive cards, oversized hero sections and generic SaaS layouts.
- Let the content and terminal interactions provide the visual interest.

## Terminal behavior

- Display a believable shell prompt and current working directory.
- Provide command history and clear command output.
- Support `whoami`, `help`, `ls`, `cd` and `cat` as initial commands.
- Provide clickable shortcuts for important commands and sections.
- Unknown commands should return a concise, friendly error.
- Keep command interpretation separate from UI rendering.
- Never execute arbitrary input through an operating system shell.
- Use a virtual filesystem backed by structured content.

## First-visit intro

- Plays once per browser session, when the terminal first loads. The `intro` command replays it.
- Shows boot-style log lines with colour (names white, paths cyan, status green), an ASCII banner, a one-line welcome with a hint, and three shortcuts, then leaves the prompt ready.
- The loading phase is deliberately slower than the welcome, so the visitor feels the system starting.
- Uses a figlet "slant" banner on wide screens and a "small" one on narrow screens.
- Any click or key skips the rest. With `prefers-reduced-motion`, it appears at once.
- Copy and banners live in `src/terminal/intro.ts` and `src/terminal/banners/`.

## Cyberpunk details

Use these sparingly:
- Small uppercase system labels.
- Thin cyan or green borders.
- Subtle active-state glow.
- Small status indicators.
- Carefully placed magenta highlights.
- Minimal motion that responds to user interaction.

The aesthetic should feel modern and intentional, not like a retro hacker movie or a gaming dashboard.

## Content and personality

- Write in natural, conversational English initially.
- Present Marc as an AI professional with a data science background and interests in Linux, self-hosting and home automation.
- Keep the humor dry, personal and occasional.
- Never invent achievements, professional experience or technical expertise.
- Make professional information easy to find.

## Accessibility and responsive design

- Full keyboard accessibility and visible focus states.
- Sufficient contrast for text and controls.
- Respect reduced-motion preferences.
- Never use color alone to communicate meaning.
- On mobile, prioritize readable output, comfortable input controls and access to all key portfolio sections.
- Do not require a keyboard command to access essential information.

## Implementation principle

Build the functional terminal first, then add the visual polish.

Every decorative effect must support the identity without compromising performance, usability or maintainability.
