# GraphRAG Knowledge Agent

> A self-hosted agent that lets an engineering department search and ask
> questions across tens of gigabytes of heterogeneous company documentation.

## Overview

An internal tool for a private company's engineering department to navigate and
query its documentation — around 16–20 GB spanning many formats: images, PDFs,
Word documents, spreadsheets, `.dat` and `.vcf` files, plus engineering schemas
and topography maps.

Rather than a single search index, the system combines a knowledge graph that
holds entities and document metadata with a vector database using three
embeddings. A ReAct agent sits on top and decides which of its many search tools
to use for each question.

## The Challenge

The difficulty is not answering questions — it is turning a large, heterogeneous
corpus into something that can be queried well:

- Documents arrive in many formats, including images and engineering schemas,
  which computer vision has to interpret.
- Ingestion takes time: processing the whole corpus into the graph and the
  vector database runs for about a day.
- One retrieval approach is not enough — questions need both structured context
  from the graph and specific passages from the vectors.

## Architecture

- A document-processing pipeline normalises each document, runs named-entity
  recognition, and splits it into chunks, producing a structured representation.
- An ontology-driven knowledge graph (built with Graphiti on Neo4j) stores the
  entities and their document metadata.
- A vector database (Qdrant) holds three embeddings per chunk, powering a
  multi-hybrid search.
- The query flow is graph-first: the agent looks up the graph for context and
  entities, and only falls back to the vector database when it needs specific
  passages.
- A ReAct agent with more than forty tools performs the searches. Some tools
  only become available after others have run, and the agent reasons about which
  tool to use at each step.
- The interface is built with Flet.

```
documents → processing (NER + chunking)
                ├─▶ knowledge graph  (entities + metadata)
                └─▶ vector database  (3 embeddings)

question → ReAct agent → graph first → vectors if needed → answer
```

## Engineering

The search is hybrid by design: three embeddings give the vector database
coverage and redundancy, while the graph provides the structured context that
pure vector search misses.

The agent is a ReAct loop — it reasons about the question, picks a tool, reads
the result, and continues. The tools are specific searches, and the dependencies
between them (one tool unlocking another) keep the agent from wandering.

Ingestion is incremental: the system remembers which documents it has already
processed, so adding material only processes the new files.

## Security & Infrastructure

Everything is self-hosted on our own servers, which matters because the corpus
is confidential company documentation. When a question needs a more powerful
language model, it is run through STACKIT so that processing stays private.

## My Role

I built the system from scratch: the ingestion pipeline, the ontology-driven
graph, the hybrid search, the agent and its tools, and the interface.

## Technologies

External tools and frameworks:

- Qdrant — vector database
- Graphiti on Neo4j — knowledge graph
- Flet — interface
- STACKIT — cloud for heavier language models

Custom components built for this project:

- The document-processing pipeline (normalisation, NER, chunking)
- The ontology-driven knowledge graph
- The multi-hybrid search (three embeddings)
- The ReAct agent and its search tools

The language models and embeddings are kept private.

## Outcome

Being deployed to the first customer, where the documentation is sensitive.
