---
name: home-intro
description: Author and maintain the first-visit boot intro of mao.home — its copy, ASCII banners, timing, shortcuts and accessibility rules.
---

# Home Intro

## Purpose

Keep the first screen of mao.home consistent. On the first visit of a session the terminal plays a short boot-style intro: log lines, an ASCII banner, a brief introduction and three shortcuts. It then leaves the visitor at the prompt.

## Where things live

- Copy, shortcuts and timings: `src/terminal/intro.ts`
- Banners: `src/terminal/banners/slant.txt` (wide) and `small.txt` (narrow)
- Rendering and animation: `src/components/Intro.tsx`
- Session flag and the `intro` command: `src/components/Terminal.tsx`, `src/terminal/commands.ts`

## Copy rules

- Write in English, natural and conversational, in the first person.
- Keep the welcome to one line, and the hint to one line that points to `help` and the explorer. Mobile gets its own hint that says "sidebar".
- Use only facts already in `content/`. Do not add employers, metrics or claims.
- Do not add a biography to the intro. The full story belongs in the career section.
- Every shortcut must point to a path that exists. Check `src/terminal/filesystem.ts` before adding one.

## Banners

- Generate them with figlet:
  - Wide: `figlet -f slant "mao.home"`
  - Narrow: `figlet -f small "mao.home"`
- Strip trailing spaces and blank lines before saving.
- Wide banners must fit in 53 columns and narrow ones in 37, so they work on mobile.
- Import them with `?raw`, as the markdown content is imported.

## Behaviour that must stay

- The intro plays once per browser session, tracked with the `sessionStorage` key `mao.home:intro-seen`.
- The `intro` command replays it and clears the terminal first.
- Any click or key skips the rest of the sequence.
- Typing is never blocked: keys still reach the input.
- With `prefers-reduced-motion`, everything appears at once.
- Shortcut buttons run the same command the visitor would type, so the history shows what happened.
- Screen readers get the full text once, through `sr-only` text. The typed characters are `aria-hidden`.

## Checks

- Run `npm run build`.
- Open the site in a new session: the intro plays. Reload: it does not. Run `intro`: it replays.
- Check at about 390px width and on desktop.
- Enable reduced motion and confirm the intro appears without animation.
- Confirm that each shortcut runs its command and that the explorer follows.
