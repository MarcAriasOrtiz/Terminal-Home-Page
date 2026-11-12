# Fine-tuned Incident Labeling

> A fine-tuning pipeline that teaches a small language model to label free-text
> incidents with a company's 51 internal labels — retrained weekly and promoted
> only when it beats the model already running.

## Overview

A company labels incoming incidents using 51 internal labels. This project
trains a small language model (~7B parameters) to do that automatically: a user
types a free-text incident in a mobile app, and the model returns one or more
labels in real time.

The model is retrained weekly from a dataset that grows through a review
process, and a new model is only put into production when it outperforms the
current one.

## The Challenge

- The starting data was poor: unbalanced, noisy, and not enough of it to cover
  51 labels well.
- Classification is multi-label as well as single-label.
- Everything runs on private, self-hosted infrastructure, and the model is small
  (~7B parameters), so it has to understand the text well within that budget.

## Architecture

- A reinforcement process, driven by experts, produces the training data.
- Each week the dataset is used to retrain the model.
- The new model is evaluated against the production model using a golden set,
  and is only promoted if it is better.
- Every training run and model is kept on the server for traceability.
- In production, the mobile app sends the user's text through FastAPI, which asks
  the model for the label in real time.

```
experts → dataset → train (weekly) → evaluate (golden set) → promote if better

mobile app → FastAPI → model → label (real time)
```

## Engineering

Because the real data was poor, part of the training set is generated with AI,
and some real data is adapted to fit. The model is fine-tuned from a base model
with Unsloth, trained on the full dataset with early stopping (training ends when
accuracy stops improving).

The evaluation loop keeps the system honest: the golden set is the reference, and
a model is only swapped in when it beats the current one.

## Security & Infrastructure

Everything is self-hosted on private infrastructure; the data and the model never
leave it.

## My Role

I built the whole pipeline from scratch: the dataset construction, the training,
the golden-set evaluation and promotion loop, and the serving.

## Technologies

External tools and frameworks:

- Unsloth — fine-tuning
- Ollama (llama.cpp) — inference
- PyTorch — training

Custom components built for this project:

- The data-generation and reinforcement process
- The golden-set evaluation and promotion loop
- The training pipeline with early stopping
- The FastAPI serving layer

## Outcome

In production, labeling incidents in real time.
