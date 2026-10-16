# Changelog
All notable changes to the **MausamIQ: Climate Change and Seasonal Variation Impact on Agriculture** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2026-10-17

### Added
- **Core Architecture & Documentation Suite:**
  - `docs/PRD.md`: Formal Product Requirements Document.
  - `docs/SRS.md`: Formal Software Requirements Specification with stable traceability IDs (`FR-001`..`FR-020`, `NFR-001`..`NFR-010`, `DATA-001`..`DATA-005`, `SEC-001`..`SEC-004`, `TEST-001`..`TEST-007`).
  - `docs/ARCHITECTURE.md`: C4 system context, component diagrams, data flow specifications.
  - `docs/DATA_SOURCES.md`: IMD, ICAR, KVK, and SAU meteorological dataset provenance and missing-data policies.
  - `docs/RESEARCH_METHODOLOGY.md`: Academic research design, research questions, evaluation framework without fabricated ML metrics.
  - `docs/RISK_METHODOLOGY.md`: Complete mathematical definitions for rainfall anomalies, consecutive dry days (CDD), heavy rain events, and declarative rule aggregation.
  - `docs/API.md`: Comprehensive REST API endpoint contract.
  - `docs/DATABASE.md`: Relational schema design, entity constraints, and indexing strategy.
  - `docs/LOCALIZATION_AND_VOICE.md`: English, Hindi, and Marathi localization architecture, agricultural terminology glossary, and Web Speech API specifications.
  - `docs/TESTING.md`: Scientific benchmark test cases and verification guidelines.
  - `docs/DEPLOYMENT.md`: Environment setup, Dockerization, and production deployment guide.
  - `docs/KNOWN_LIMITATIONS.md`: Spatial resolution boundaries, soil moisture exclusions, and browser compatibility boundaries.
  - `README.md`: High-level product summary, prerequisites, and developer quickstart.
  - `.env.example`: Secure environment configuration template.

- **Backend Scientific Calculation & Domain Engine:**
  - Climate indicator service calculating cumulative rainfall, percentage departure from 30-year IMD LPA normal, consecutive dry days (CDD), and heavy precipitation events.
  - Crop phenology engine mapping sowing dates to active growth stages across 10 Maharashtra crops.
  - Deterministic versioned rule registry with literature citations (ICAR, MPKV Rahuri, Dr. PDKV Akola, VNMKV Parbhani).
  - What-If scenario simulation engine for perturbation testing without data corruption.
  - Multilingual voice intent router mapping natural language transcripts in English, Hindi, and Marathi to structured analytical API queries.
  - FastAPI endpoints for locations, crops, climate summary, assessment generation, what-if simulations, rule inspection, and export.

- **Frontend User Interface & Interaction:**
  - Design system with agricultural visual identity (deep forest green, warm off-white, muted olive, earthy charcoal, clear risk tokens).
  - Full trilingual localization supporting English (`en`), Hindi (`hi`), and Marathi (`mr`).
  - Web Speech API integration with microphone permission checks, live listening pulse, editable transcript buffer, and speech synthesis readout.
  - Interactive Leaflet Maharashtra district map.
  - Interactive climate charts and growth-stage phenological risk timeline.
  - Crop comparison matrix and What-If climate simulation laboratory.
