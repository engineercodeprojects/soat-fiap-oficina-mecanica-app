# US-F3-DOC-07: QA Plans (backfill + Fase 3)

**User Story:** Como QA/Avaliador, quero um QA Plan para cada historia da Fase 3 (e o backfill das historias sem plano), para garantir que todos os criterios de aceite sao validaveis e rastreaveis.

**Prioridade:** Media
**Story Points:** 5
**Status:** To Do
**DDD Domain:** Documentacao / Qualidade
**DDD Layer:** —
**Repositorio:** 4 — `docs/qa-plans/`

## Contexto

O `CLAUDE.md` exige um **QA_PLAN por User Story**. Hoje existem apenas 7 planos
(US-00, 04, 05, 14, 18, 19, 20) para 30+ historias. A Fase 3 adiciona novas
historias que tambem precisam de plano.

## Criterios de Aceite

- [ ] QA Plan para cada historia da Fase 3 (formato `docs/qa-plans/QA_PLAN_US-F3-XX.md`) usando a skill `/qa-plan`
- [ ] Cobertura prioritaria dos fluxos criticos: **autenticacao por CPF** (f3-01/02/03), **deploy no EKS** (f3-06), **CI/CD** (f3-08), **observabilidade** (f3-09/10/11)
- [ ] Cada QA Plan com: resumo, pre-requisitos, cenarios por criterio de aceite, edge cases, tabela de rastreabilidade, checklist de validacao
- [ ] **Backfill** dos QA Plans faltantes das Fases 1/2 (priorizar dominios criticos: OS, estoque, auth)
- [ ] Indice de QA Plans (`docs/qa-plans/README.md`) com status de cobertura (quais historias tem plano)
- [ ] Regra reforcada: cada criterio de aceite tem ao menos um cenario de teste

## Notas

- Nao precisa cobrir 100% das historias antigas de uma vez; priorizar por risco. Registrar no indice o que ficou pendente.
