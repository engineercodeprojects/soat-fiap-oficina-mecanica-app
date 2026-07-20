# US-F3-DOC-02: ADRs (Architecture Decision Records)

**User Story:** Como Arquiteto, quero registrar as decisoes arquiteturais permanentes como ADRs, para preservar o racional das escolhas e facilitar a evolucao futura do sistema.

**Prioridade:** Alta
**Story Points:** 2
**Status:** To Do
**DDD Domain:** Documentacao
**DDD Layer:** —
**Repositorio:** 4 — `docs/`

## Contexto

O enunciado exige **ADRs para decisoes arquiteturais permanentes** (exemplos:
escolha do padrao de comunicacao, uso de HPA).

## Criterios de Aceite

- [ ] Diretorio `docs/arquitetura/adr/` com template padrao (Titulo, Status, Contexto, Decisao, Consequencias) — formato Nygard
- [ ] Indice de ADRs (`docs/arquitetura/adr/README.md`) com numeracao sequencial (`ADR-0001`, ...)
- [ ] **ADR — Padrao de comunicacao** entre componentes (REST sincrono via API Gateway; eventos internos `@OnEvent`; webhook outbound)
- [ ] **ADR — Uso de HPA** (autoescalonamento por CPU/memoria; min/max; metrics-server)
- [ ] **ADR — Aplicacao como Resource Server** (monolito valida-apenas; Lambda emite o token) ([f3-03](f3-03-app-resource-server.md))
- [ ] **ADR — Plataforma de observabilidade** (Datadog x New Relic x Prometheus/Grafana) — registra a escolha final ([f3-10](f3-10-observabilidade-apm.md))
- [ ] **ADR — API Gateway** (AWS API Gateway x Kong x Traefik)
- [ ] **ADR — Segregacao em 4 repositorios** e estrategia de branches/deploy
- [ ] Cada ADR com status (`Aceita`/`Substituida por ADR-XXXX`) e data
- [ ] ADRs linkadas no README principal e no indice de docs ([f3-doc-06](f3-doc-06-indice-docs-readme.md))
