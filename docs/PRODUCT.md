
# Product Brief — mao.home

## Goal
Create a personal homepage that doubles as a professional portfolio,
using a Linux filesystem and shell as its main metaphor.

## Audience
- Engineering and AI hiring managers.
- Technical peers and potential collaborators.
- Curious visitors who enjoy Linux and self-hosting.

## Identity
Marc Arias Ortiz is a data scientist by background whose work
has evolved through machine learning, NLP and AI-related R&D.

He enjoys Linux, maintaining an Arch Linux desktop, self-hosting
services on an old laptop, home automation and experimenting
with personal AI agents.

He is also a dad. Personal details should feel natural and
respectful, not like forced branding.

## Main experience
The visitor starts at /home/mao.

The interface resembles a shell with a prompt, command history
and a filesystem that can be explored.

The experience must also be understandable without terminal knowledge.

## Initial filesystem
/home/mao/
├── README.md
├── about_me/
├── career/
│   ├── README.md
│   ├── experience/
│   ├── projects/
│   ├── skills-certifications/
│   ├── cv.md
│   └── profile.md
├── stack/
├── homelab/
├── smart-home/
└── contact/

## Initial release
- A responsive terminal-inspired homepage.
- A working whoami command.
- A useful ls command.
- A readable README / welcome screen.
- Navigation to professional sections.
- Clear contact and LinkedIn links.
- A conventional way to find or download the CV.

## Out of scope for the first release
- A real Linux shell or server-side command execution.
- A real AI agent connected to the smart home.
- Authentication or a personal backend.
- Complex terminal emulation before the basic UX works.

## Success criteria
A visitor can understand who Marc is, what he does,
what he builds and how to contact him within a short visit.

The site remains usable on mobile and without terminal expertise.

