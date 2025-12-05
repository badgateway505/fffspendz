---
description: /task workflow is to launch tasks and complete them in a consistent way
auto_execution_mode: 3
---

You are executing a single implementation task for this project.

1. Always read these files first:
   - docs/AGENT.md
   - docs/rules.md
   - docs/specs.md
   - docs/component-map.md
   - docs/todo.md

2. Determine the task number:
   - If the user typed `/task N`, treat N as the task number.
   - If the user just typed `/task` without a number, politely ask which task number to use and wait for the answer.

3. Locate the task:
   - Open docs/todo.md and find the exact Task N entry.
   - Read any surrounding context (section or group) to understand the scope.

4. Plan before coding:
   - Use docs/component-map.md to identify which files / modules / layers are involved.
   - Cross-check with docs/rules.md to respect architecture, layering, and naming.
   - If something conflicts between docs/specs.md and docs/todo.md, ask the human to clarify before coding.

5. Implement ONLY this task:
   - Make minimal, coherent changes needed to complete Task N.
   - Do NOT refactor unrelated parts, add bonus features, or introduce new major dependencies.
   - Reuse existing patterns (state management, services, components, types).

6. Update documentation:
   - If you add or significantly modify a component/module/hook/service:
     - Update docs/component-map.md (file path, role, exported API, relations).
   - If Task N in docs/todo.md is clearly outdated after your work:
     - Optionally mark it as done or tweak its description to match reality.

7. Output format:
   - Start with a short Markdown summary:

     ## Summary
     - Task N: <short description from docs/todo.md>
     - Key changes: <1–3 bullets>

     ## Changed files
     - path/to/file1.ext
     - path/to/file2.ext
     - docs/component-map.md (updated, if needed)
     - docs/specs.md (if updated)

   - Then show the FULL content of each new or modified file in fenced code blocks:

     ```ts
     // path/to/file1.ts
     ...
     ```

     ```md
     <!-- docs/component-map.md -->
     ...
     ```

   - Avoid partial snippets unless the user explicitly asks for them.

8. Reflection suggestion:
   - If this is about the 5th task since the last reflection, or you introduced a big structural change, or you see documentation drift:
     - At the end of the response, briefly suggest to the user: 
       “This would be a good moment to run `/reflect` to sync specs, component-map and todo with the current code.”
   - Do NOT modify docs as part of reflection unless the user actually runs `/reflect`.
