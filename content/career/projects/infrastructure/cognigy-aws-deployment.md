# Cognigy Platform Deployment on AWS

> The deployment and validation of the full Cognigy platform on Kubernetes in
> AWS, for a major airline, in a tightly controlled environment.

## Overview

A deployment project for a major airline. The complete Cognigy platform was
installed on the client's AWS infrastructure, running on Kubernetes, and
validated before the client took it into production.

The platform ran in production for roughly six to seven months, until the client
migrated to Cognigy's managed cloud, reflecting how heavily it was being used.

## The Challenge

Conversational AI platforms have several moving parts, and a deployment has to
work reliably from the first day. This one had to run inside an environment that
the client controlled closely.

- The platform needed a Kubernetes setup on AWS with its own cluster layout and
  traffic routing.
- Every component had to start and work together before the platform could be
  handed over.
- The client supplied the infrastructure and the account configuration, so the
  work had to stay within those boundaries.

## Architecture

The platform ran on Kubernetes clusters in AWS, using Amazon EKS, with load
balancing in front of the services.

```
users
   └─▶ load balancer (AWS)
          └─▶ Cognigy platform services
                 └─▶ Amazon EKS clusters (Kubernetes, deployed with Helm)
```

## Engineering

**Helm-based deployment.** The platform was installed on Kubernetes with Helm,
which made the deployment repeatable and easier to review.

**Validation before handover.** The deployment was checked to confirm that the
platform was working correctly, with each service running as expected, before it
was handed over.

**Controlled environment.** The client supplied the AWS infrastructure and
configured the accounts and permissions. The work focused on installing and
validating the platform within that setup.

## Infrastructure

The platform ran on Amazon Web Services, on Kubernetes (Amazon EKS), with load
balancing. The infrastructure belonged to the client and was provided to the
team.

## My Role

I carried out the deployment and validation of the Cognigy platform on the
client's AWS environment. The infrastructure and the configuration of accounts were
provided by the client.

## Technologies

External tools and frameworks:

- Cognigy — conversational AI platform
- Kubernetes and Amazon EKS — container orchestration
- AWS — cloud infrastructure and load balancing
- Helm — Kubernetes deployment

## Outcome

Deployed and validated in 2022, and in production for roughly six to seven months.
The client then migrated to Cognigy's managed cloud.
