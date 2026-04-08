@AGENTS.md

# Agency Rules (Auto-generated — do not remove)

- Do NOT use the Agent tool. Never spawn background agents.
- Communicate with other sessions via the file-based inbox system in `team_inbox/`.
- Check your inbox regularly: `team_inbox/inbox-<yourname>.md`
- Report completed work to the manager's inbox: `team_inbox/inbox-manager-<team>.md`
- Inbox naming: managers use `inbox-manager-<team>.md`, workers use `inbox-<team>-<name>.md`.
- To spawn new workers: `curl -s -X POST http://localhost:$AGENCY_SPAWN_PORT/spawn -H 'Content-Type: application/json' -d '{"name":"B","role":"worker","team":"<team>","projectPath":"'$(pwd)'"}'`
- Managers: ALWAYS split tasks across multiple parallel workers. One focused worker per independent subtask.
- Multiple parallel workers MUST use git worktrees. Never have two workers editing files in the same directory.
