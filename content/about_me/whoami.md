---
kind: whoami
name: Marc Arias Ortiz
role: Applied AI engineer
tagline: Teaching smaller models to do one job well, and building the systems around them so they actually run.
labels: Machine learning, NLP, R&D, LLM fine-tuning, AI agents, Knowledge systems, Infrastructure
---

I trained as a data scientist and ==biological systems engineer==, and spent the last five years moving from machine learning and NLP research into ==practical AI engineering==: adapting models, wiring up data and tools, and making the whole thing hold together in the real world.

:::featured
### Small models that run on real hardware

Most problems do not need a giant frontier model. I work with ==small and medium language models==, fine-tuning them for a specific task, quantising them when size or latency matters, and checking whether the adapted version actually beats the baseline before packaging it to ==run locally==.

- **Task-specific fine-tuning**: adapting open-weight models to narrow, well-defined jobs
- **Quantisation**: trading model size and speed against quality where it makes sense
- **Honest evaluation**: measuring if the adapted model actually solves the problem
- **Local packaging**: shipping models that run on your own hardware without an API bill

> The goal is a modest model doing one job well, not the biggest model or a default API call. Fine-tuning only helps when the task, data and evaluation actually line up.
:::

## Agents backed by real retrieval, not just a prompt

When I build AI agents for work, the interesting part is rarely the chat interface. It is the ==data and retrieval plumbing== underneath that lets an agent navigate gigabytes of messy documentation without making things up.

That usually means building and populating vector databases, structuring ==knowledge graphs==, and wiring retrieval pipelines that connect models, tools, databases and internal services into workflows people can actually rely on.

## Infrastructure because I like knowing how the box works

Infrastructure is a genuine interest for me, not an afterthought. I like understanding a system ==end to end==, setting it up from scratch, and fixing the parts that creak.

I would much rather get my hands dirty and wire the services together myself than treat the stack as a black box. If a job is repetitive, I automate it; if two pieces of software need to talk, I build the bridge.

:::flow
- Fine-tune & quantise
- Check if it works
- Wire up retrieval & tools
- Run it end to end
:::

:::personal
==Arch Linux== runs my day-to-day. At home I self-host services on an old laptop, tinker with home automation, and occasionally build over-engineered side projects nobody asked for, mostly to see if I can make them work.

Not every service gets 24/7 uptime, though. I am also a dad.
:::
