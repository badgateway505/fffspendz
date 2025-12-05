---
description: init workflow generates basic structure of the project based on the user input
auto_execution_mode: 1
---

Follow the /init workflow exactly as described in docs/AGENT.md §5.1.

Always begin with the Discovery phase:
- Ask 5–10 short questions about the project idea:
  goal, users, platform, tech preferences, phases (MVP → Beta → Production), repo details.

After receiving all answers:
- Generate docs/specs.md (Goal, Context, Phases, Flows, Tech Stack, Constraints)
- Generate docs/todo.md (task list)
- Generate docs/component-map.md (initial component structure)

Do not generate production code during /init.
Only documentation and structure.
