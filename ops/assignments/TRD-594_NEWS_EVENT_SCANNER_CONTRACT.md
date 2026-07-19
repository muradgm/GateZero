# TRD-594 News/Event Scanner Contract

Status: accepted

## Goal

Implement a local news/event scanner record contract for future market-intelligence context.

## Scope

- Event id, source refs, event time, summary, red flags, stale-reference state, and explicit no
  action-route flag.

## Blocked Scope

- Remote polling, external ingestion workers, action routing, alerts as recommendations, account
  access, execution paths, certainty claims, and performance claims.

## Acceptance

Accepted when event records require local source refs and reject stale or action-routed cases.
