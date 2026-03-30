# Sistema IPA — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack web app (Angular + NestJS + SQLite) for evaluating automation potential of organizational processes using the IPA methodology.

**Architecture:** Nx monorepo with Angular 21 frontend, NestJS backend, and shared TypeScript lib for interfaces, DTOs, enums, and IPA calculation functions. Multi-tenant with JWT auth.

**Tech Stack:** Nx 21, Angular 21 (standalone, Signals, Zoneless), Angular Material, NestJS 11, TypeORM + SQLite, JWT, Playwright, Vitest, Jest

---

## Detailed plan

The full task breakdown is maintained in `docs/sdd/TASKS.md` (50 tasks across 13 groups).
The spec is in `docs/sdd/SPEC.md` and the technical plan in `docs/sdd/PLAN.md`.

Execution order follows the groups G1→G13 sequentially.
Each group corresponds to one `feat()` commit.
