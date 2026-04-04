# Inkling Phase 1: UI/UX Specification



Version: 1.0 (Foundation Phase)

Focus: Core Project Management \& Collaborative AI Assistance



### 1\. Vision \& Design Principles



The goal of Phase 1 is to provide a stable, high-performance project management environment where AI acts as a knowledgeable assistant.



Clean Professionalism: High-contrast interface with ample whitespace to ensure AI-generated text is highly legible.



Pull-Based AI: AI features (outside of the initial project setup) are triggered by the user to control costs and prevent information overload.



Optimistic UI: Instant feedback on user actions (e.g., checking a task) while background processes sync with the database.



### 2\. Layout \& Navigation



A persistent Global Sidebar architecture ensures rapid navigation between contexts.



##### 2.1 The Global Sidebar



Top Section: User Profile \& Group Selector (switch between "Marketing Team," "E-commerce Project," etc.).



Navigation Links: \* Home/Dashboard: Overview of deadlines and recent activity.



My Tasks: Aggregated view of all tasks assigned to the current user.



Resource Hub: Centralized storage for presentations, SRS docs, and live demos.



Primary Action: \[+] Start New Project (AI Architect) — Prominent button to launch Mohammed’s conversational flow.



### 3\. Core Functional Views



##### 3.1 The "AI Architect" Chat (Mohammed's Flow)



A dedicated interface for project initiation.



Chat Stream: Standard messaging UI where the user describes the project scope.



The Blueprint Panel (Right Side): A collapsible live-preview pane that updates as the AI identifies tasks and resources.



Displays a "Draft" list of Tasks.



Displays "Draft" Resource requirements (e.g., "Drafting SRS Document...").



The "Commit" Action: A fixed footer button: \[Generate Project Structure]. Clicking this persists the AI's suggestions into the formal database.



##### 3.2 The Task Board (Emanuel \& Dorcas's Flow)



A flexible view for ongoing management.



View Toggle: Switch between List View (detailed, row-based) and Board View (Kanban columns: To-Do, In Progress, Done).



Permission Badges: Small text/icon labels on user avatars (Owner, Editor, Assignee, Viewer).



Task Cards: Displays Title, Due Date, and "Assignee" avatar.



##### 3.3 Task Detail \& "Help" Modal



When a task is clicked, a side-drawer/modal opens with full details.



The "Help me with this task" Button: Branded button located at the top of the description area.



Loading State: A "Searching \& Synthesizing..." progress bar.



The Hybrid Guidance Output (Markdown Rendered):



Quick-Start Guide: Numbered steps to complete the task.



Resource List: Hyperlinks to discovered web resources and internal group files.



AI Insight: A "Pro-Tip" or "Risk Alert" regarding the task.



4\. Interaction Model \& State Management



|Action|UI Response|AI/Backend Requirement|
|-|-|-|
|Assign Task|Instant update on board.|Supabase Row Level Security check.|
|Click "Help Me"|Lock button, show loading.|Trigger Search API + LLM Synthesis.|
|Chat with Architect|Stream text response.|LLM (e.g., Gemini 1.5 Flash) via FastAPI.|
|Submit Deliverable|File upload indicator + Status change.|Update Task status to "Review" or "Done".|





5\. Technical Specifications for UI



Framework: Next.js (React).



Styling: Tailwind CSS (for responsive, utility-first design).



Components: Headless UI or Radix UI (for accessible modals and dropdowns).



AI Output Rendering: react-markdown to handle the hybrid guide formatting.



Iconography: Lucide-React for clean, consistent UI symbols.



6\. Success Metrics for Phase 1 UX



Time to Project Start: Mohammed should be able to go from "Idea" to "Populated Task Board" in under 3 minutes of conversation.



Information Relevance: Users like Dorcas should find at least one "Actionable Link" in 80% of AI-generated guides.



UI Performance: Page transitions and task updates must occur in <200ms.

