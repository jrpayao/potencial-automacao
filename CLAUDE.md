Comunique-se SEMPRE em portugues brasileiro (pt-BR).

## Workflow: Spec-Driven Development (SDD)

Este projeto segue o workflow SDD. Todas as decisoes de dominio, arquitetura,
paginas e regras de negocio estao nos documentos SDD em `docs/sdd/`:

- **SPEC.md** — Requisitos no formato GEARS
- **PLAN.md** — Decisoes tecnicas, stack, estrutura de pastas
- **TASKS.md** — Tasks atomicas numeradas (T01 a T{NN})

O design aprovado esta em `docs/superpowers/specs/`.

**SEMPRE consulte os docs SDD antes de implementar qualquer feature.**

## Git e Documentacao

### Commits por Grupo (Feature)

- Agrupe as tasks por grupo (G1, G2, ...) e faca UM commit por grupo completo
- NAO pedir permissao para commitar — commitar automaticamente ao concluir cada grupo
- NAO adicionar Co-Authored-By nos commits
- Formato: `feat({feature}): {descricao em portugues}`

### OBRIGATORIO apos cada grupo concluido

1. **Marcar tasks como feitas** em `docs/sdd/TASKS.md`:
   - Trocar `- [ ]` por `- [x]` em cada task concluida
   - Adicionar timestamp: `- [x] **T{NN}** — descricao *(concluida em YYYY-MM-DD HH:MM)*`

2. **Atualizar CHANGELOG** em `docs/CHANGELOG.md`:
   ```
   ## [YYYY-MM-DD] — feat({feature})
   - O que foi implementado
   - Arquivos criados/modificados
   - Tasks cobertas: T{NN}, T{NN}, T{NN}
   ```

3. **Commitar** tudo junto (codigo + TASKS.md + CHANGELOG.md):
   ```
   feat({feature}): {descricao em portugues}
   ```

4. **Mostrar progresso**:
   - "✅ Feature {nome} commitada — T{NN} a T{NN}"
   - Resumo: "{N} de 50 tasks concluidas ({X}%)"

### Branch

- Nao fazer push sem minha autorizacao explicita

### Progresso

- Ao iniciar um grupo, mostre: "🔨 Feature: {nome} — Tasks T{NN} a T{NN}"
- Ao concluir e commitar, mostre resumo do progresso geral

## Testes

### Unitarios

- Backend: Jest
- Frontend: Vitest
- Lib shared: testada por ambos

### E2E — Playwright

- Uma spec por pagina/feature, organizar por pasta
- Page Object Model (POM) para cada pagina
- Auth compartilhada — login uma vez, salvar session state
- Rodar apos cada feature concluida
- Screenshots em falha automatico
- Testar comportamento do usuario, nao seletores internos

### Fluxo

```
Feature implementada
    ↓
Escrever testes da feature
    ↓
Rodar testes
    ↓
Se PASSA: "✅ Feature {nome} pronta + testes passando — commitar?"
Se FALHA: corrigir e rodar de novo (loop)
    ↓
Commit: feat({feature}): {descricao}
```

## Banco de Dados

Nomenclatura segue o Guia de Diagramacao e Dicionarizacao de Dados
em `docs/db/guia-diagramacao-dicionarizacao-dados.md`.

Regras principais:
- Tabelas: `{SIGLA}TB{NNN}_{NOME}` (ex: `IPATB001_ORGANIZACAO`)
- Colunas: classe + termos (ex: `NO_PROCESSO`, `VR_IPA_FINAL`, `DT_LEVANTAMENTO`)
- Classes: ID, NO, DE, IC, SG, TS, VR, NU, CO, DT
- PKs: `PK_{codigo_tabela}`
- FKs: `FK_{tabela_filha}_{tabela_pai}`
- Indices: `IN_{codigo_tabela}_{NN}`

## Registro Visual de Evolucao

### Screenshots por Feature

Apos concluir cada feature funcionando:

1. Usar Playwright para capturar screenshots de cada pagina da feature
2. Salvar em `docs/evolucao/{feature}/` com nome descritivo
3. Formato: `docs/evolucao/{feature}/{pagina}-{data}.png`

### Video E2E

Ao concluir cada GRUPO de features:

1. Rodar Playwright com gravacao de video habilitada
2. Navegar por todo o app (fluxo completo do usuario)
3. Salvar em `docs/evolucao/videos/e2e-grupo{N}-{data}.webm`

## Referencias Visuais

Se existirem telas de referencia (Figma ou imagens), estarao em `docs/figma/`.

- Antes de criar qualquer componente visual, verificar se ha referencia em `docs/figma/`
- Replicar cores, espacamentos, icones e layout fielmente a referencia
- Se precisar de detalhe que nao esta claro, perguntar
