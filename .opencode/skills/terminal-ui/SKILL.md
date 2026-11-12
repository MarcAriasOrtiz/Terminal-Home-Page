
---
name: terminal-ui
description: Design and implement accessible, responsive terminal-inspired web interfaces with coherent command behavior and filesystem navigation.
---

# Terminal UI

## Principles
- Build a usable interface, not a terminal screenshot.
- Keep command parsing separate from rendering.
- Treat commands as a finite, explicitly supported set.
- Never pass terminal input to an operating system shell.
- Keep command output deterministic and testable.
- Preserve keyboard accessibility and readable mobile layouts.
- Prefer authentic terminal conventions over decorative gimmicks.

## Workflow
1. Inspect the existing implementation and design brief.
2. Identify the smallest interface or behavior to implement.
3. Define expected behavior for the requested commands.
4. Implement within the existing architecture.
5. Verify keyboard interactions, mobile behavior and error states.
6. Report what was tested and what remains incomplete.

