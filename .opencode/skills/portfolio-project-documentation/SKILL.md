---
name: Portfolio Project Documentation
description: Create and maintain technically accurate, visually coherent project documentation for mao.home's terminal-inspired portfolio — engineering case studies that demonstrate how Marc approaches problems, without exposing confidential or proprietary details.
---

# Portfolio Project Documentation Skill

## Purpose

Create and maintain technically accurate, visually coherent project documentation for my personal portfolio.

The portfolio is built around a terminal-inspired, editorial aesthetic. Project pages should communicate engineering depth, technical curiosity and the ability to build complete systems.

The goal is not to create conventional project README files, but compelling technical case studies that demonstrate how I approach engineering problems.

## Context

I am an AI R&D Engineer working across:

- Artificial Intelligence and Machine Learning
- Software Engineering
- Data Engineering
- Infrastructure and Systems
- Automation and Agentic Workflows

My work often involves connecting technologies and disciplines to build complete, practical systems.

Projects may involve proprietary company work. Public documentation must never expose confidential information, internal infrastructure details, credentials, customer information or proprietary implementation details.

## Workflow

Before writing or modifying any project documentation:

1. Inspect the existing website structure.
2. Read the Career README to understand the established tone and positioning.
3. Inspect existing project pages and components.
4. Identify the project's actual implementation status.
5. Gather technical information from existing documentation and user-provided context.
6. Identify missing information before making architectural claims.
7. Preserve the existing website conventions and navigation patterns.

Do not modify unrelated pages or components.

## Documentation Principles

### Technical Accuracy

- Never invent technologies, architecture, metrics, implementation details or outcomes.
- Clearly distinguish implemented functionality from planned or experimental work.
- Do not claim that a system is production-ready unless explicitly confirmed.
- Do not describe intended security properties as formally guaranteed.
- Ask the user when important technical information is missing.

### Engineering Perspective

Focus on:

- The problem being solved
- Engineering challenges
- Architectural decisions
- System interactions
- Technical trade-offs
- Infrastructure and deployment
- Security and scalability
- My personal contribution

Explain why components exist and how they interact rather than merely listing technologies.

### Writing Style

- Write all portfolio content in English.
- Use clear, natural technical English.
- Prefer concise paragraphs and meaningful headings.
- Avoid marketing language, exaggerated claims and generic AI buzzwords.
- Do not repeatedly use phrases such as "cutting-edge", "revolutionary" or "state-of-the-art".
- Maintain a thoughtful, engineering-oriented voice.
- Make the content accessible to technical recruiters and experienced engineers.

## Project Page Structure

Use the following structure as a starting point:

```markdown
# Project Name

> A concise technical description of the project.

## Overview

Explain what the project is, what problem it addresses and why it exists.

## The Challenge

Describe the engineering problem and relevant constraints.

## Architecture

Explain the major components and their relationships.

Use diagrams when they provide meaningful technical value.

## Engineering

Describe important implementation details, integrations and engineering decisions.

## Security & Infrastructure

Include this section only when relevant.

## Scalability

Explain architectural decisions related to scalability when supported by actual project information.

## My Role

Describe my actual responsibilities, contributions and ownership.

## Technologies

List the technologies that materially contribute to the project.

## Outcome

Describe the current status and verified results.
```

Do not force every section into every project. Adapt the structure to the project's actual complexity.

## Technology Presentation

Group technologies by their role in the architecture.

Distinguish between:

- External technologies and frameworks
- Infrastructure components
- Custom components developed as part of the project

Do not present custom components as third-party technologies.

## Visual Design

The website uses a dark, terminal-inspired editorial style.

When creating or modifying project pages:

- Follow the existing design system.
- Reuse existing components where appropriate.
- Prefer meaningful technical diagrams over decorative imagery.
- Avoid generic project card layouts.
- Avoid excessive borders, badges and visual clutter.
- Preserve responsive behaviour.
- Support reduced-motion preferences.
- Use subtle animations only when they improve comprehension.

## Implementation

When asked to implement a project page:

1. Inspect the relevant existing components.
2. Understand the current data model and rendering system.
3. Make the smallest coherent changes.
4. Preserve existing navigation conventions.
5. Keep project content separate from presentation logic when consistent with the repository.
6. Verify that the page renders correctly.
7. Report the files modified and any remaining issues.

Do not redesign the entire website unless explicitly requested.

## Final Review

Before finishing, verify:

- Technical claims are grounded in supplied information.
- My contribution is accurately represented.
- The project status is clear.
- No confidential information is exposed.
- The page fits the portfolio's existing tone and visual identity.
- The documentation explains engineering decisions rather than simply listing tools.
