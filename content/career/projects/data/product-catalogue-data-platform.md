# Product Catalogue Data Platform

> A data platform that collects product pages from dozens of sources into one
> structure, cleans and normalises them into a single language, and links related
> products across more than 50 million relations.

## Overview

A platform for building and maintaining a large, continuously growing product
catalogue. It gathers product pages and their metadata from many independent
websites, turns them into a common structure, cleans and normalises the result,
and makes it searchable for the product that depends on it.

It is in production for a client and is currently under maintenance. The database
is around 60 GB and grows as new catalogues are added.

## The Challenge

The hard part is not scraping a single website. It is keeping dozens of sources,
each with its own layout and rules, consistent over time:

- Every source describes products differently, so a scraper per site quickly
  becomes a maintenance problem.
- Raw scraped data is inconsistent: fields are missing, formats vary, and the same
  product appears under different names across sources.
- Sites actively protect themselves against automated access, so collection has to
  be resilient to blocking and changes in page behaviour.
- The data has to be queryable instantly, even as the tables grow to millions of
  rows.

## Architecture

The platform separates collection from preparation and preparation from
consumption. Data moves through clear stages, and each stage has one job.

```
sources (dozens of product websites)
   └─▶ scrapers (one shared structure for all sources)
          └─▶ staging database (semi-normalised, raw-but-structured)
                 └─▶ cleaning & normalisation (business rules, Python)
                        └─▶ production tables (clean, single language)
                               ├─▶ probabilistic linking → product relations
                               └─▶ full-text search & query views

API (built by another team) → triggers scraping jobs on demand or on schedule
```

## Engineering

**One structure for all scrapers.** Instead of building a separate scraper for
each source, I designed a shared scraping structure. Each source only defines how
to reach and read its pages; the common structure handles the rest. This keeps
new sources cheap to add and makes the output consistent from the start.

**Staging before production.** Scraped data lands first in a semi-normalised
staging database. This keeps collection fast and decoupled from the rules that
clean the data, and it means raw results can be reprocessed if the rules change.

**Rule-based cleaning.** A Python cleaning algorithm applies business rules to
standardise fields, normalise formats and translate content into one language.
The production tables only receive data that has passed these rules.

**Probabilistic linking.** Once products are clean, a probability-based step
identifies likely matches between products and creates the relations between them.
This is what makes the catalogue navigable across sources rather than just a pile
of records.

**Fast filtering at scale.** The production data lives in Microsoft SQL Server,
using its full-text indexing to filter tables of millions of records almost
instantly.

**On-demand execution.** An API developed by another team connects the platform to
the front-end and back-end services, so scraping jobs can be triggered
automatically rather than only by hand.

## Infrastructure

The platform runs on servers hosted and managed by us for the client, which keeps
the data under the client's control. Scraping runs use rotating network identities
and browser automation to cope with the protections that many sites apply.

## Scalability

The staging/production split is the main scalability decision. Collection can keep
running and growing without blocking consumers, and the cleaned tables stay
optimised for querying as the catalogue grows. The shared scraper structure keeps
the cost of adding a new source low, which matters more than raw throughput for a
catalogue that expands source by source.

## My Role

I designed the scraping architecture, including the shared structure that lets
dozens of sources feed one pipeline, and the separation between staging and
production data. I managed a small team that built the platform from the ground
up, and I was responsible for how the cleaning and normalisation stages were
structured. The on-demand API was developed by another team.

## Technologies

External tools and frameworks:

- Python — scraping, cleaning and linking
- Requests — HTTP collection
- Playwright — browser automation, with stealth techniques
- Microsoft SQL Server — relational storage and full-text search

Custom components built for this project:

- The shared scraper structure
- The staging pipeline
- The rule-based cleaning and normalisation algorithm
- The probabilistic product-linking step

## Outcome

In production for the client and currently under maintenance. The platform holds
around 60 GB of product data, has more than 50 million relations between products,
and continues to grow as new catalogues are added.
