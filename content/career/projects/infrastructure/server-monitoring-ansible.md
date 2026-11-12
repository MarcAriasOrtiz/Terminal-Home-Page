# Server Monitoring with Ansible

> A monitoring stack for around fifteen servers, deployed through an idempotent
> Ansible role so that new servers can be added without manual setup.

## Overview

Centralised monitoring for the company's server fleet, around fifteen machines
that report over the private network. The stack has been in use for about three
years and keeps growing as new servers are added.

It answers two practical questions: when a machine needs attention before it
becomes a problem, and how to bring a new machine under monitoring without
repeating manual steps.

## The Challenge

Capacity problems on servers usually build up slowly and surface at the worst
moment. Without monitoring, they are found by someone noticing a failed job or a
slow system.

- Disk space and memory pressure need to be watched continuously, not checked by
  hand.
- Some alerts are routine and should trigger maintenance, while others are only
  worth raising when they persist.
- The fleet changes over time, so deploying the monitoring agent to a new machine
  has to be repeatable.

## Architecture

Each server runs a lightweight exporter that exposes its metrics. Prometheus
collects them, Grafana visualises them, and alerts are sent by email. All traffic
stays inside the private network.

```
servers (private network)
   └─▶ node_exporter (managed by Ansible, runs as a systemd service)
          └─▶ Prometheus
                 ├─▶ Grafana dashboards
                 └─▶ alerts ─▶ email
```

## Engineering

**Role-based automation.** The deployment is written as an Ansible playbook
organised by roles. The monitoring role installs node_exporter, configures it as a
systemd service so it starts on boot and keeps running, and can be applied again
without side effects. Running it against a new machine is enough to bring that
machine under monitoring.

**Dashboards.** Grafana dashboards show free disk space, memory usage, CPU load,
network traffic and running processes for each server.

**Alerting, with two different intents.**

- Low free disk space triggers an alert that prompts cleanup scripts to run.
- Memory kept at a high level for a sustained period on critical servers raises an
  alert to check whether that consumption is expected, rather than reacting to
  short spikes.

## Infrastructure

Metrics travel over the private network only. The monitoring endpoints are not
exposed publicly, and servers are added to the stack through the same playbook
that installs the agent.

## Scalability

Adding a server means adding it to the Ansible inventory and running the role.
Because the role is idempotent, it can be applied to the whole fleet as often as
needed, which keeps the configuration consistent as the number of machines grows.

## My Role

I designed the whole monitoring solution, from the Ansible role structure to the
dashboards and alert rules, and I maintain it.

## Technologies

External tools and frameworks:

- Prometheus — metrics collection
- Grafana — dashboards
- node_exporter — host metrics
- Ansible — automation and deployment
- systemd — service management

Custom components built for this project:

- The Ansible playbook and monitoring role
- The dashboards and alert rules

## Outcome

In use for about three years across around fifteen servers, and still expanding as
new servers are added.
