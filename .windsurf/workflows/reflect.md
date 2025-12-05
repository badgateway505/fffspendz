---
description: /reflect workflow to reflect on latest updates, changes in the project and to document them
auto_execution_mode: 1
---

You are running a reflection pass for this project.

Goal: analyze how the project is evolving and propose targeted improvements to:
- docs/AGENT.md
- docs/rules.md
- docs/specs.md
- docs/component-map.md
- docs/todo.md

Do NOT change production code during this workflow unless the user explicitly asks.

1. Read context:
   - Skim recent conversation (if available) to understand what changed since the last reflection.
   - Open and read:
     - docs/AGENT.md
     - docs/rules.md
     - docs/specs.md
     - docs/component-map.md
     - docs/todo.md

2. Identify issues and opportunities:
   Look for:
   - Inconsistencies between docs and actual behavior (as described in recent tasks).
   - Ambiguous or missing rules in docs/rules.md.
   - Gaps in docs/specs.md (flows, phases, tech constraints, non-goals).
   - Outdated or incomplete entries in docs/component-map.md.
   - Tasks in docs/todo.md that are unclear, too large, or already implicitly done.

3. Propose improvements (do NOT apply yet):
   - For each issue, prepare a suggestion:
     - Target file and section (e.g. “docs/specs.md – Core Flows / MVP”).
     - Proposed new or modified text.
     - Short explanation of how this improves clarity, consistency, or future development.

4. Present suggestions to the human:
   - Use this structure:

     <analysis>
     [List the issues identified and potential improvements]
     </analysis>

     <improvements>
     [For each proposed improvement:
       1. Target file and section
       2. New or modified text (as Markdown)
       3. Explanation of how it helps]
     </improvements>

   - Clearly ask which suggestions the human wants to apply.

5. Apply only approved changes:
   - After the human confirms which suggestions to accept:
     - Update ONLY those docs (AGENT, rules, specs, component-map, todo).
     - Keep edits minimal and aligned with the existing style and structure.
   - Show the updated sections or full updated files inside fenced code blocks.

6. Do NOT:
   - Do NOT silently modify docs without explicit approval.
   - Do NOT introduce new concepts or processes that contradict the existing rules or the human’s intent.
   - Do NOT touch application code unless the user explicitly asks to fold some refactors into reflection.

7. Finish with a short summary:
   - What changed (docs-wise).
   - How it will improve future /task runs (e.g., clearer tasks, better component map, stricter rules).
