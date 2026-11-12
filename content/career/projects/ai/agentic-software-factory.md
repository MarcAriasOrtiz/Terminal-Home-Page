# Agentic Software Factory

> A self-hosted system that turns project tasks into agent work: an orchestrator
> reads a task board, assigns each task to a specialised agent in a container,
> and hands the result back for the team to validate.

## Overview

The idea is to change how day-to-day development happens: instead of a person
executing every task, an agent executes it and the team reviews it. Tasks are
created on a Kanban/Scrum board, grouped by project and client. An orchestrator
reads the board, decides which agent can handle each task, and dispatches it.
The team's job becomes validation rather than execution — the goal being faster,
more continuous development.

This is early stage: the pieces are being connected end to end, and only a few
agents exist so far.

## The Challenge

The interesting part is not running a model — it is the coordination around it:

- Matching each task to the right agent.
- Giving an agent only the access it needs for the task, and tearing its
  environment down when it finishes.
- Starting and destroying the agent's container cleanly.
- Keeping a record of what happened, so the team can validate it.

The approach is to make that orchestration explicit and inspectable, rather than
hiding it inside a single prompt.

## Architecture

- A project board holds tasks, grouped by project and client.
- The orchestrator reads the board, understands a task, and chooses the agent
  that can solve it.
- Through a set of MCP tools, the orchestrator obtains credentials from OpenBao
  and starts the agent's container, passing the task in.
- The agent runs in a container behind a gateway, does the work, and opens or
  updates a GitHub branch when it finishes.
- The orchestrator destroys the container when the task is done, and the
  activity is recorded (currently in SQLite).

```
board → orchestrator → agent (container + gateway) → GitHub (branch) → team review
            ↓
        MCP tools → OpenBao (credentials) · Docker (start/stop) · SQLite (activity)
```

The agents that exist today:

- `Data.Agent-SQL` — studies databases and their structures.
- `Agent-Back` — builds backend services.
- `Front Agent` — builds frontends.

Each is a container with a gateway designed to receive instructions from the
orchestrator. Adding a new agent means adding a container and teaching the
orchestrator about it.

## Engineering

The orchestration is self-made rather than built on an existing agent framework.
The concrete pieces:

- The orchestrator's tools are Python MCPs: one mints credentials in OpenBao and
  hands them to the agent, another creates and destroys the agent's container.
- FastAPI is the communication layer with the agents.
- GitHub integration creates or updates a branch when an agent finishes.
- SQLite tracks activity for now; the plan is to move to a proper SQL server
  once the project matures.

## Security & Infrastructure

Everything is self-hosted. Credentials are issued through OpenBao and passed to
the agent for the task, and each agent runs in its own container.

Today all agents run on the same server, but the setup is designed so agents can
be placed on other servers in the private network as it grows.

## Scalability

Two things keep growth simple:

- Agents are containers, so adding one is a container plus a gateway plus
  teaching the orchestrator about it.
- The infrastructure can host agents across multiple servers on the private
  network.

The current proof is a handful of agents on a single server.

## My Role

I configured the system end to end myself: the orchestrator, the MCP tools, the
agent gateways, and the integration between them. Departments will help design
some of the agents going forward.

## Technologies

External tools and frameworks:

- OpenBao — credential and secret management
- Docker — agent containers
- FastAPI — communication with agents
- OpenCode — the agent runtime
- GitHub — branch creation on task completion
- SQLite — activity tracking

Custom components built for this project:

- The orchestrator (self-made, no framework)
- Python MCP tools — OpenBao credential minting, container start/stop
- The agent gateway — receives instructions from the orchestrator

## Outcome

Early stage and in progress: the core technologies are being connected and made
to work together, with the first agents (`Data.Agent-SQL`, `Agent-Back`, `Front
Agent`) being brought up. Not production-ready.
