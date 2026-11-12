# Ventilation Decision Support Pilot

> A pilot system that uses building sensor data, weather observations and machine
> learning models to recommend when a building's ventilation should be switched on
> or off over the coming hours.

## Overview

A pilot project for two public buildings in Catalonia, owned by a regional public
administration. Each building is divided into several monitored zones, around 18
in one and 12 in the other. The system collects indoor air-quality data, combines
it with weather observations and produces, per zone, a recommendation of the
periods in which ventilation should run.

The pilot was designed as a foundation for a larger project: its purpose was to
show what could be built and to leave a working base of data, pipelines and models
for that next phase.

## The Challenge

Ventilation is a clear case of a decision that depends on several changing factors
at once: indoor CO₂ and air quality, temperature, how many people are present and
the outside weather. The challenge was to turn these signals into a decision that
is consistent, explainable and traceable.

- Sensors report at different moments and in different formats, so raw readings
  had to be brought into one structure before they could be used.
- Every zone behaves differently, so a single model for the whole building would
  not be representative.
- The output had to be usable by people responsible for the building, so it needed
  to be a clear schedule for the coming hours, not a raw prediction.

## Architecture

Data flows from the sensors to a real-time dashboard, and from the same
database into a training pipeline that feeds a serving API.

```
LoRaWAN sensors: CO₂, temperature, air quality, occupancy
   └─▶ RAK WisGate gateway
          └─▶ ChirpStack ─▶ Redis ─▶ ThingsBoard (MQTT, real-time view)
                                          └─▶ PostgreSQL (time series)
                                                 │
Meteorological stations ─────────────────────────┤
                                                 ▼
                              Daily training pipeline (one-week batches)
                              Several model families per zone
                                       │
                          ┌────────────┴────────────┐
                          ▼                         ▼
                 MLflow (metrics, artifacts,   Model store (Docker volume)
                 best model per zone)                 │
                                                      ▼
                              Serving API (Docker)
                              input: building location
                              output: ventilation periods for the next hours
```

## Engineering

**Data acquisition.** Sensors report over LoRaWAN to a RAK WisGate gateway. The
data goes through ChirpStack, then through Redis, and reaches ThingsBoard over
MQTT for real-time visualisation. ThingsBoard stores the readings in PostgreSQL,
and PostgreSQL is also the source for model training, so the dashboard and the
models work from the same data.

**Training pipeline.** The pipeline runs every day and trains on a rolling batch
of one week of data. Weather observations from the regional meteorological
stations close to each building are combined with the sensor readings. Each
pipeline run includes training and validation for every zone.

**Per-zone model selection.** For each zone the pipeline trains around eight
candidate models, from gradient boosting and regression models to Random Forest
regression, and evaluates them with R², MAE and RMSE. The best-performing model
is kept for that zone. In most zones the best result came from XGBoost, though not
in all of them, which is why every zone was evaluated independently.

**Traceability with MLflow.** MLflow stored the full history of the models: the
parameters and metrics of each candidate, how the best model was chosen, and
visualisations of each training dataset, so the data behind every model could be
inspected later.

**Serving.** The best model per zone is written to a volume shared with the serving
API, which runs in Docker. The pipeline updates the models daily, and the API
always serves the most recent version. Given a building's location, the API returns
the periods in which ventilation should be on or off over the following hours.

## Infrastructure

The system ran on servers hosted for the client. MLflow was hosted separately on
its own server. The API and the pipeline shared a Docker volume for the model
files.

Actuation was outside the scope of this system. The API produced recommendations;
switching the ventilation on or off was handled by the client's own systems, which
the team did not control.

## My Role

I built the core of the system: the data acquisition path into the database, the
processing layer, the training and validation pipeline, the per-zone model
selection and the serving API. I was responsible for all of the machine learning
work. A colleague helped with the initial documentation of the project. The team
also delivered documentation of the machine learning process and the pipeline.

## Technologies

External tools and frameworks:

- LoRaWAN, RAK WisGate gateway — sensor connectivity
- ChirpStack — LoRaWAN network server
- Redis — message relay
- ThingsBoard — real-time visualisation and MQTT broker
- PostgreSQL — time-series storage
- XGBoost, Random Forest and other regression models — machine learning
- MLflow — experiment tracking and artifact storage
- Docker — deployment of the serving API

Custom components built for this project:

- The data acquisition and processing layer
- The training and validation pipeline
- The per-zone model selection process
- The serving API
- The machine learning process and pipeline documentation

## Outcome

Delivered as a pilot, with the data pipeline, the training and validation process,
the model tracking and the serving API handed over. The pilot was designed as a
foundation for a larger project. Operational results were not measured, and the
team does not have visibility of how the system was used after handover, so no
energy or air-quality impact is claimed.
