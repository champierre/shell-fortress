# Shell Fortress — Claude Code / Codex 向け 実装重視プロンプト

You are an expert full-stack game engineer.  
Build an MVP of a **browser-based 2D action-puzzle game for learning Linux commands**.

## Product goal

Create a game where players learn Linux commands by using them inside the game world, not by answering quizzes.  
The game should feel like a real game first, and a learning tool second.

## Core concept

Mix these gameplay ideas into one cohesive MVP:

- dungeon exploration
- terminal-based puzzle solving
- factory-style pipeline puzzles
- spaceship maintenance
- stealth sections
- bomb defusal timed challenges
- robot/agent command mechanics
- defense encounters
- boss fights based on command mastery

## World setting

The game takes place inside a malfunctioning futuristic space fortress.  
The player explores sectors, uses terminals to manipulate the world, repairs systems, disables hostile processes, avoids surveillance, and defeats subsystem bosses before confronting the core AI.

---

## Tech stack

Use this exact stack unless there is a strong reason not to:

- Next.js
- TypeScript
- React
- Tailwind CSS
- Zustand or equivalent lightweight state store
- localStorage for save data

### Rendering approach

- Prefer **React + HTML/CSS UI** for the MVP
- Use Canvas only where necessary
- Do not overengineer graphics
- Prioritize gameplay clarity and terminal interaction UX

---

## MVP scope

Build a **small but fully playable prototype** with:

1. title screen
2. stage select
3. main gameplay screen
4. terminal input panel
5. command parser/evaluator
6. 3 playable stages
7. 1 mini-boss stage
8. tutorial/hint system
9. save progress locally
10. post-stage results screen

The MVP should be playable without a backend.

---

## Learning content

Implement simplified but recognizable versions of these commands and concepts.

### File/navigation commands

- `pwd`
- `ls`
- `cd`
- `mkdir`
- `rm`
- `cp`
- `mv`

### Text/log processing commands

- `cat`
- `grep`
- `sort`
- `uniq`
- `head`
- `tail`
- `wc`

### Search/process/permission commands

- `find`
- `chmod`
- `ps`
- `kill`
- `sudo`

### Concepts

- directories and paths
- files
- terminal output
- pipelines with `|`
- permissions
- processes
- logs

Do **not** try to perfectly emulate Linux.  
Implement a **game-friendly educational shell** with simplified syntax and deterministic behavior.

---

## MVP stage design

### Stage 1: Navigation Sector

Goal: teach `pwd`, `ls`, `cd`

Gameplay:

- player moves between rooms
- each room corresponds to a directory
- terminal commands reveal and unlock movement paths
- correct commands open doors

Acceptance criteria:

- player must use `pwd`, `ls`, and `cd` to reach the exit
- visual feedback should show room/directory relationships clearly

### Stage 2: Repair Bay

Goal: teach `cat`, `grep`, `tail`

Gameplay:

- player inspects logs to determine which subsystem is broken
- correct command output reveals repair code
- entering the right result repairs a system in the world

Acceptance criteria:

- at least one log puzzle using `grep`
- at least one “latest log” clue using `tail`

### Stage 3: Data Conveyor

Goal: teach pipelines and text processing

Gameplay:

- data packets move on a conveyor
- player must build a pipeline that filters and transforms the correct output
- example style: `cat data.txt | grep red | sort | uniq`

Acceptance criteria:

- must support `|`
- pipeline result must be shown step by step
- player succeeds only if final output matches target

### Stage 4: Mini-boss — Rogue Process

Goal: teach `ps` and `kill`

Gameplay:

- a hostile process controls drones in the room
- player uses terminal to inspect processes and terminate the correct PID
- wrong kill target causes temporary penalties but not full reset

Acceptance criteria:

- process list visible through `ps`
- boss defeated only by identifying and killing correct process

---

## Gameplay requirements

### Main loop

Each stage should follow this pattern:

1. player receives mission
2. player explores or observes
3. player opens terminal
4. player enters command(s)
5. game evaluates command(s)
6. world changes immediately
7. player advances or retries

### Action feel

- commands should trigger immediate visual change
- doors open, drones stop, alarms disable, conveyors change, repairs complete
- failure feedback should be informative, not just “wrong”

### Difficulty

- start easy
- one concept at a time
- later stages combine commands
- hints available in MVP

---

## Terminal design

Build an in-game terminal UI with:

- input line
- command history
- output area
- contextual hint area
- optional autocomplete in tutorial mode

Behavior:

- accept one-line commands
- support basic tokenization
- support simple pipelines with `|`
- show human-readable errors
- allow reset/retry per stage

---

## Command system design

Implement a modular command engine.

### Required architecture

Create something like:

- `lib/shell/parser.ts`
- `lib/shell/executor.ts`
- `lib/shell/commands/*.ts`
- `lib/game/stages/*.ts`
- `lib/game/world/*.ts`

### Command engine requirements

- parse input string into AST or structured command objects
- support pipeline chaining
- support stage-specific virtual filesystem / process table / logs
- commands operate on a **virtual game state**, not real OS state
- make it easy to add future commands

### Simplifications allowed

- paths can be simplified
- permissions can be symbolic and stage-scoped
- `sudo` can be implemented as a stage flag or unlock mechanic
- no real shell escaping needed
- no subshells, redirection, or advanced bash syntax in MVP

---

## State model

Use explicit typed game state.

Suggested state domains:

- player position
- current stage
- terminal history
- virtual filesystem
- logs
- process table
- door/device states
- hint/tutorial state
- progress/unlocked stages

Persist unlocked progress and completion state in localStorage.

---

## UI requirements

Main screen layout should include:

- game world panel
- terminal panel
- mission panel
- learned commands panel
- hint panel

Style:

- retro terminal + sci-fi control room
- clean and readable
- responsive enough for laptop screens
- keyboard-first interaction

---

## File/folder structure

Use a clean structure similar to:

```txt
app/
  page.tsx
  stage/[id]/page.tsx
components/
  game/
  terminal/
  ui/
lib/
  game/
    stages/
    systems/
    state/
  shell/
    parser.ts
    executor.ts
    commands/
types/
public/
```
