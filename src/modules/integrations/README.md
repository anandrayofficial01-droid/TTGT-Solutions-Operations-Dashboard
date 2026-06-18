# TTGT Solutions Data Integrations Module (Isolated Namespace)

## Core Responsibilities
- Synchronize data from multiple source connectors (Google Sheets, REST/GraphQL endpoints).
- Support column column mapping, scheduled syncing, and test connection handshakes.
- Manage webhook stream events from marketplaces (such as Shopify Plus, Amazon SP-API, Flipkart SKU lists).

## Module Folder Structure
- `components/` - Sub-components purely related to Integrations (e.g. `IntegrationsModule`, `DataSourceManager`).
- `services/` - Sub-service abstractions mapping directly to backend data sync triggers (`IntegrationService`).
- `types/` - Shared specific sync logs and connector schema definitions.

## Defined Interfaces
All automated stream sync engines communicate across the platform strictly through our dynamic `IntegrationService` API interfaces to ensure zero side-effects.
