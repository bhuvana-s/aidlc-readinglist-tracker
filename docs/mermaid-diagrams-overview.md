# AI-DLC Mermaid Flow Diagrams - Overview

This document provides an overview of all Mermaid flow diagrams that explain how steering files guide the creation of artifacts and code throughout the AI-DLC workflow.

## Diagram Files

### 1. Inception Phase
**File**: `mermaid-inception-phase.md`

Shows the complete Inception Phase workflow including:
- Workspace Detection (determines greenfield vs brownfield)
- Requirements Analysis (with contradiction detection)
- User Stories (with ambiguity resolution)
- Workflow Planning (with content validation)
- Application Design
- Units Generation

**Key Insight**: Each stage reads steering files from `.kiro/aws-aidlc-rule-details/inception/`, creates plan files with questions, waits for user answers, and generates artifact files.

### 2. Construction Phase
**File**: `mermaid-construction-phase.md`

Shows the per-unit loop structure where each unit goes through:
- Functional Design (domain entities, business logic, business rules)
- NFR Requirements (NFR requirements, tech stack decisions)
- NFR Design (NFR patterns, logical components)
- Code Generation Part 1: Planning (detailed step-by-step plan)
- Code Generation Part 2: Generation (execute plan, mark checkboxes)
- Build and Test (after all units complete)

**Key Insight**: The two-part code generation approach creates a detailed checklist first, then executes it step-by-step, marking each checkbox as work completes.

### 3. Operations Phase
**File**: `mermaid-operations-phase.md`

Shows the Operations Phase structure (currently a placeholder):
- Current state: All build/test activities in Construction Phase
- Future expansion: Deployment, monitoring, incident response, maintenance

**Key Insight**: Operations Phase exists in the workflow but is not yet implemented. It's designed for future expansion.

### 4. Unit 1 Detailed Flow (4 Parts)

#### Part 1: Functional Design and NFR Requirements
**File**: `mermaid-unit1-flow-part1.md`

Shows:
- Functional Design stage with 10 questions
- Creation of domain-entities.md, business-logic-model.md, business-rules.md
- NFR Requirements stage with 12 questions
- Creation of nfr-requirements.md, tech-stack-decisions.md

#### Part 2: NFR Design and Code Generation Planning
**File**: `mermaid-unit1-flow-part2.md`

Shows:
- NFR Design stage with 10 questions
- Creation of nfr-design-patterns.md, logical-components.md
- Code Generation Planning with 20 detailed steps

#### Part 3: Code Generation Execution (Steps 1-13)
**File**: `mermaid-unit1-flow-part3.md`

Shows actual code generation:
- Step 1: Project setup (package.json, vite.config.js, index.html, .gitignore)
- Step 2: Design system (global.css with CSS custom properties)
- Step 3: Utility modules (storage, validation, idGenerator, dateUtils)
- Step 4: Context providers (AuthContext, LoadingContext)
- Steps 5-13: Common UI components (Button, Input, Form, Card, Modal, ProgressBar, StarRating, Notification, LoadingSpinner)

#### Part 4: Code Generation Execution (Steps 14-20)
**File**: `mermaid-unit1-flow-part4.md`

Shows final code generation:
- Steps 14-16: Utility components (ErrorBoundary, ProtectedRoute, LoadingOverlay)
- Step 17: App shell and routing (App.jsx, PlaceholderComponent)
- Step 18: Entry point (main.jsx)
- Step 19: README documentation
- Step 20: TESTING checklist
- Final summary: 60+ files, ~3,500 lines of code

## How Steering Files Work

### Steering File Locations
All steering files are located in `.kiro/aws-aidlc-rule-details/` directory:
- `common/` - Common rules (process overview, content validation, question format)
- `inception/` - Inception phase rules (workspace detection, requirements analysis, user stories, etc.)
- `construction/` - Construction phase rules (functional design, NFR requirements, NFR design, code generation)
- `operations/` - Operations phase rules (future)

### Steering File Flow

1. **AI reads steering file** - Gets instructions for the current stage
2. **AI creates plan file** - Generates questions based on steering file guidance
3. **User answers questions** - Provides decisions and preferences
4. **AI analyzes answers** - Checks for contradictions and ambiguities
5. **AI creates clarification** (if needed) - Resolves conflicts
6. **AI generates artifacts** - Creates deliverables based on answers
7. **AI updates state** - Marks stage complete in aidlc-state.md
8. **AI logs audit trail** - Records all interactions in audit.md

### Key Principles

1. **Steering files are read-only** - They guide the process but are never modified
2. **Plans come before artifacts** - Questions are asked before generation
3. **User answers drive generation** - Artifacts reflect user's decisions
4. **Checkboxes track progress** - Code generation plans use checkboxes to track completion
5. **State is continuously updated** - aidlc-state.md and audit.md track all progress
6. **Artifacts build on each other** - Later stages load artifacts from earlier stages

## Color Legend

All diagrams use consistent color coding:

- **Blue boxes** (light blue fill, dark blue border): Steering files (rules)
- **Yellow boxes** (light yellow fill, orange border): Plan files (questions)
- **Green boxes** (light green fill, dark green border): Artifact files (design documents)
- **Teal boxes** (light teal fill, dark teal border): Code files (implementation)
- **Orange boxes** (light orange fill, red border): State tracking files (aidlc-state.md, audit.md)
- **Purple diamonds** (light purple fill, dark purple border): Decision points
- **Light orange boxes** (light orange fill, orange border): Stage markers

## Reading the Diagrams

### Flow Direction
- Diagrams flow top to bottom
- Arrows show dependencies and sequence
- Decision diamonds show branching logic

### File Naming Patterns
- `{unit-name}` - Replaced with actual unit name (e.g., ui-foundation, core-features)
- Plan files end with `-plan.md`
- Clarification files end with `-clarification.md`
- Artifact files have descriptive names (domain-entities.md, nfr-requirements.md, etc.)

### Checkpoint Pattern
In code generation diagrams, you'll see:
1. Step N: Description
2. Creates: File(s) with details
3. Marks: ✓ Step N Complete

This shows the checkpoint pattern where each step is marked complete in the plan file as work finishes.

## Using These Diagrams

### For Understanding AI-DLC
- Start with Inception Phase to see the big picture
- Move to Construction Phase to understand the per-unit loop
- Dive into Unit 1 detailed flow to see actual code generation

### For Implementing AI-DLC
- Use these diagrams as a reference for the expected workflow
- Check that your implementation follows the same patterns
- Verify that steering files are creating the right artifacts

### For Teaching AI-DLC
- Show Inception Phase to explain planning and design
- Show Construction Phase to explain implementation
- Show Unit 1 detailed flow to demonstrate actual code generation
- Use color coding to help learners distinguish file types

## Summary

These Mermaid diagrams provide a complete visual representation of how AI-DLC works:

1. **Steering files** provide the rules and guidance
2. **Plan files** ask questions to gather user input
3. **Artifact files** document decisions and designs
4. **Code files** implement the actual functionality
5. **State files** track progress throughout

The workflow is consistent, traceable, and repeatable, making it easy to understand, implement, and teach.
