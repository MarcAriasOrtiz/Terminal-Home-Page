# Pharmaceutical FAQ Assistant

> A multilingual conversational assistant for a pharmaceutical company's website,
> built on Cognigy, with a focus on understanding what users actually ask.

## Overview

A conversational assistant that answers frequently asked questions on a
pharmaceutical company's website, in German and English. It runs as an addition to
the company's website and handles around 60,000 conversations a month.

I designed and implemented the conversational solutions directly in Cognigy. My
main focus was improving how the assistant detects what users are asking, so that
it can answer correctly.

## The Challenge

When the assistant was first deployed, it answered very few questions correctly.
Users ask the same thing in many different ways, and the assistant was not
recognising those variations reliably.

- The assistant had to understand questions in German and English.
- Answers had to be accurate and appropriate for a regulated sector, with strict
  legal review.
- Some answers depended on data held in the company's systems, which had to be
  accessed under controlled permissions.

## Architecture

The assistant sits between the website and the company's data sources. Questions
are interpreted by Cognigy, matched to the right answer or flow, and enriched with
data where needed.

```
website chat
   └─▶ Cognigy (question detection, flows, German and English)
          ├─▶ answers and content
          ├─▶ CRM data (Salesforce), with role-based access
          └─▶ media from the client's cloud storage
```

## Engineering

**Question detection.** The main work was improving how the assistant detects and
matches user questions in both languages. Compared with the first version, the
assistant became far more reliable at understanding what users asked and returning
the right answer.

**Integrations.** Where an answer needed information from the company's systems,
the assistant retrieved it from the CRM and from the client's cloud storage. Access
followed role-based permissions, which was a key requirement given the sector.

**Working within controls.** Work was documented and assigned in JIRA, in line with
the review and documentation process required for a regulated company.

## Infrastructure

The assistant ran as a web channel integrated into the company's website. The data
sources were the company's own systems, accessed through controlled integrations.

## My Role

I designed and implemented the conversational solutions in Cognigy, focused on
improving question detection in German and English, and worked on the integrations
with the company's data sources.

## Technologies

External tools and frameworks:

- Cognigy — conversational AI platform
- Salesforce — CRM data source
- Cloud blob storage — media source
- JIRA — task and documentation tracking

## Outcome

In production on the company's website, handling around 60,000 conversations a
month. Question detection was significantly improved compared with the initial
version.
