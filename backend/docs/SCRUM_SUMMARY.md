# QuickRent — Scrum Summary (Since Part B)

## Overview

Part B was submitted in late February 2026. Since then, the team completed two additional sprints focused on finalizing core features, integrating frontend and backend, and preparing for Part C submission.

---

## Sprint 3 — Backend Feature Completion
**Duration:** Late February – Early March 2026
**Goal:** Complete remaining backend features and begin frontend integration

### Sprint Summary
This sprint focused on completing the backend feature set and beginning frontend integration. Rahul finalized the authentication system and AI chatbot. Silin Zhang completed the vehicle and booking modules. Misha Patel pushed the frontend — user interface, booking flow, admin dashboard, and map search. Abbas continued work on payment and notification systems.

### Stories & Epics Completed

| Story / Epic | Assignee | Link |
|---|---|---|
| Epic: User Authentication | Rahul Ramesh | https://github.com/rahul912313/csye7230-project-team-1-/issues/1 |
| Epic: Vehicle Fleet Management | Silin Zhang | https://github.com/rahul912313/csye7230-project-team-1-/issues/2 |
| Epic: Booking System | Silin Zhang | https://github.com/rahul912313/csye7230-project-team-1-/issues/3 |
| User can register and login with JWT authentication | Rahul Ramesh | https://github.com/rahul912313/csye7230-project-team-1-/issues/10 |
| Admin can add a vehicle with location and images | Silin Zhang | https://github.com/rahul912313/csye7230-project-team-1-/issues/11 |
| User can request a booking and receive a price quote | Silin Zhang | https://github.com/rahul912313/csye7230-project-team-1-/issues/12 |

### Team Contributions
- **Rahul Ramesh** — Completed UserService (registration, login, profile, Firebase token update), ChatbotService with Hugging Face API integration, fallback response system, and all related controllers and routes.
- **Silin Zhang** — Completed vehicle CRUD endpoints, two-phase booking system (request → TTL lock → confirm), booking conflict detection, and transaction management.
- **Abbas (Syed Rizvi)** — Continued work on Stripe payment integration (Strategy pattern) and Firebase notification system (Factory pattern). Work carried into Sprint 4.
- **Misha Patel** — Pushed frontend components: vehicle listing, booking flow UI, admin dashboard, and interactive map with Leaflet.
- **Saumya Gorantala** — Supporting admin dashboard analytics work; in progress.

---

## Sprint 4 — Integration, Testing & Part C Prep
**Duration:** Early March – Late March 2026
**Goal:** Full integration, test suite, CI/CD pipeline, API docs, final cleanup

### Sprint Summary
This sprint focused on integrating all completed features, writing the comprehensive test suite, setting up the CI/CD pipeline, generating API documentation, and cleaning up the codebase for final submission. The scrum board was restructured with an "In Review" column to better reflect the peer review workflow.

### Stories & Epics Completed

| Story / Epic | Assignee | Link |
|---|---|---|
| Epic: Frontend — User Interface and Booking Flow | Misha Patel | https://github.com/rahul912313/csye7230-project-team-1-/issues/14 |
| Frontend — Admin Dashboard and Map Search | Misha Patel | https://github.com/rahul912313/csye7230-project-team-1-/issues/15 |
| Epic: User Portal & Vehicle Discovery | Silin Zhang | https://github.com/rahul912313/csye7230-project-team-1-/issues/5 |
| Payment is processed via Stripe and booking confirmed via webhook | Abbas (Syed Rizvi) | https://github.com/rahul912313/csye7230-project-team-1-/issues/13 |

### In Progress / In Review at time of submission

| Story / Epic | Assignee | Status | Link |
|---|---|---|---|
| Epic: Payment Integration | Abbas (Syed Rizvi) | In Progress | https://github.com/rahul912313/csye7230-project-team-1-/issues/4 |
| Epic: Notifications and AI Chatbot | Rahul Ramesh | In Progress | https://github.com/rahul912313/csye7230-project-team-1-/issues/8 |
| Epic: Admin Dashboard and Analytics | Saumya Gorantala | In Progress | https://github.com/rahul912313/csye7230-project-team-1-/issues/9 |

### Team Contributions
- **Rahul Ramesh** — Set up Jest test suite (76 test cases across 5 files covering Singleton, Repository, UserService, AdminService, ChatbotService patterns), configured GitHub Actions CI/CD pipeline (backend-ci.yml with MongoDB service container), generated JSDoc API documentation, rewrote README with full build and deploy instructions.
- **Silin Zhang** — Finalized booking and vehicle endpoints, resolved merge conflicts, confirmed two-phase booking integrates correctly with Stripe payment flow.
- **Abbas (Syed Rizvi)** — Finalized Stripe payment webhook and notification delivery. Stripe test transactions confirmed working end-to-end.
- **Misha Patel** — Completed full frontend push — admin dashboard, map search, and booking flow, integrated with backend APIs.
- **Saumya Gorantala** — Admin analytics implementation in progress; pending final commit before submission.

---

## What Was Not Done (For Lack of Time)
- **Frontend test suite** — Unit tests for the Next.js frontend were not written. Testing effort was focused on the backend service layer where the core business logic resides.
- **Saumya's admin analytics epic (#9)** — Final implementation is in progress at time of submission; the epic remains open.
