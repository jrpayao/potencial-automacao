# SPEC — Sistema IPA (Indice de Potencial de Automacao)

> Requisitos no formato GEARS (Goals, Entities, Actions, Rules, Stories)

---

## G — Goals (Objetivos)

### G1. Objetivo Principal
Permitir que analistas avaliem o potencial de automacao de processos organizacionais
atraves de uma metodologia estruturada (IPA), gerando um ranking priorizado para
tomada de decisao.

### G2. Objetivos Especificos
- G2.1: Cadastrar processos com identificacao completa (nome, area, dono, solicitante)
- G2.2: Avaliar cada processo nas dimensoes Tecnica e de Negocio com notas 0-5 justificadas
- G2.3: Aplicar fatores multiplicadores (Impedimento e Urgencia)
- G2.4: Calcular automaticamente IT, IN, IPA Base e IPA Final
- G2.5: Classificar processos em Prioridade Alta / Backlog / Descarte
- G2.6: Exibir dashboard com ranking e resumo estatistico
- G2.7: Suportar multi-tenancy (organizacoes independentes)
- G2.8: Exportar memoria de calculo em PDF

---

## E — Entities (Entidades)

### E1. Organizacao (IPATB001_ORGANIZACAO)
Tenant do sistema. Cada organizacao tem seus proprios usuarios, processos e avaliacoes.
- Campos: ID_ORGANIZACAO, NO_ORGANIZACAO, CO_SLUG, IC_SITUACAO, TS_CRIACAO

### E2. Usuario (IPATB002_USUARIO)
Pessoa que acessa o sistema com um perfil especifico.
- Campos: ID_USUARIO, NO_USUARIO, DE_EMAIL, CO_SENHA_HASH, CO_PERFIL, ID_ORGANIZACAO, IC_SITUACAO, TS_CRIACAO
- Perfis: superadmin, admin, analista, visualizador

### E3. Processo (IPATB003_PROCESSO)
Processo organizacional candidato a automacao.
- Campos: ID_PROCESSO, NO_PROCESSO, NO_AREA, NO_DEPARTAMENTO, NO_DONO_PROCESSO, NO_SOLICITANTE, DT_LEVANTAMENTO, ID_ORGANIZACAO, ID_USUARIO_CRIACAO, CO_SITUACAO, TS_CRIACAO, TS_ATUALIZACAO
- Situacoes: rascunho, avaliado, arquivado

### E4. Avaliacao (IPATB004_AVALIACAO)
Avaliacao IPA completa de um processo. Relacao 1:1 (1 processo → 1 avaliacao ativa).
- Dimensao Tecnica: seguranca_acessos, estabilidade_legado, estruturacao_dados (nota 0-5 + justificativa)
- Dimensao Negocio: gestao_risco, reducao_sla, abrangencia, experiencia_cidadao, volume_mensal, fte_liberado (nota 0-5 + justificativa)
- Fatores: fator_impedimento (0.00-1.00), fator_urgencia (0.90-1.20), ambos com justificativa
- Riscos: array de {risco, contingencia}
- Calculados: VR_INDICE_TECNICO, VR_INDICE_NEGOCIO, VR_IPA_BASE, VR_IPA_FINAL, CO_STATUS_IPA

---

## A — Actions (Acoes do Sistema)

### A1. Autenticacao
- A1.1: Login com email + senha → JWT (access + refresh token)
- A1.2: Refresh token para renovacao automatica
- A1.3: Logout com invalidacao do refresh token
- A1.4: Endpoint /me para perfil do usuario logado

### A2. CRUD Organizacoes (superadmin)
- A2.1: Listar organizacoes
- A2.2: Criar organizacao (nome, slug)
- A2.3: Atualizar organizacao

### A3. CRUD Usuarios (admin do tenant)
- A3.1: Listar usuarios (scoped por tenant)
- A3.2: Criar usuario (nome, email, senha, perfil)
- A3.3: Atualizar usuario
- A3.4: Desativar usuario

### A4. CRUD Processos
- A4.1: Listar processos com filtros (area, status, periodo)
- A4.2: Criar processo (step 1 do wizard)
- A4.3: Detalhar processo
- A4.4: Atualizar identificacao do processo
- A4.5: Arquivar processo

### A5. Avaliacoes
- A5.1: Criar avaliacao completa (calcula IPA no backend)
- A5.2: Detalhar avaliacao com calculos
- A5.3: Atualizar avaliacao (recalcula IPA)
- A5.4: Salvar rascunho parcial (wizard em progresso)
- A5.5: Exportar memoria de calculo em PDF

### A6. Dashboard
- A6.1: Ranking de processos por IPA Final (paginado, ordenado desc)
- A6.2: Cards resumo: total processos, prioridade_alta, backlog, descarte

### A7. Calculo IPA (lib shared)
- A7.1: calcularIT(seguranca, estabilidade, estruturacao) → DECIMAL
- A7.2: calcularIN(gestaoRisco, impactoCidadao, eficiencia) → DECIMAL
- A7.3: calcularIPA(it, in, fi, fu) → { ipaBase, ipaFinal, status }
- A7.4: classificarIPA(ipaFinal) → prioridade_alta | backlog | descarte

---

## R — Rules (Regras de Negocio)

### R1. Formula IPA
```
IT = (Seguranca × 0.40) + (Estabilidade × 0.30) + (Estruturacao × 0.30)

ImpactoCidadao = (ReducaoSLA × 0.50) + (Abrangencia × 0.35) + (ExperienciaCidadao × 0.25)
  → min(valor, 5.0) para normalizar

Eficiencia = (VolumeMensal × 0.50) + (FTELiberado × 0.50)

IN = (GestaoRisco × 0.50) + (ImpactoCidadao × 0.30) + (Eficiencia × 0.20)

IPA Base = (0.50 × IT) + (0.50 × IN)
IPA Final = IPA Base × FI × FU
```

### R2. Classificacao
| Score IPA | Status | Acao |
|---|---|---|
| >= 4.0 | prioridade_alta | Aprovacao imediata |
| 2.5 - 3.9 | backlog | Reavaliacao Quick Wins |
| < 2.5 | descarte | ROI insuficiente |

### R3. Fator de Impedimento (FI)
| FI | Interpretacao |
|---|---|
| 1.00 | Nenhum impedimento |
| 0.80 | Restricao leve (automacao com supervisao) |
| 0.50 | Restricao moderada (automacao parcial) |
| 0.20 | Restricao severa (exige mudanca normativa) |
| 0.00 | Impedimento absoluto (vedacao legal expressa) |

### R4. Fator de Urgencia (FU)
| FU | Situacao |
|---|---|
| 1.20 | Prazo legal iminente (< 3 meses) |
| 1.10 | Oportunidade estrategica (< 6 meses) |
| 1.00 | Fluxo normal |
| 0.90 | Baixa urgencia |

### R5. Notas dos Criterios
- Todas as notas vao de 0 a 5 (inteiros)
- Cada nota obriga justificativa textual
- Descritores objetivos por nota conforme PDF da metodologia (docs/formulario_avaliacao.pdf)

### R6. Multi-tenancy
- Toda entidade tem ID_ORGANIZACAO
- JWT carrega organizacaoId no payload
- TenantGuard filtra automaticamente toda query
- Superadmin acessa cross-tenant

### R7. Perfis e Permissoes
| Perfil | Permissoes |
|---|---|
| superadmin | CRUD organizacoes + tudo de admin |
| admin | CRUD usuarios do tenant + tudo de analista |
| analista | CRUD processos, criar/editar avaliacoes |
| visualizador | Somente leitura (dashboard, processos, avaliacoes) |

### R8. Calculo no Backend
- Frontend faz preview em tempo real (UX)
- Backend e a fonte da verdade (recalcula ao salvar)
- Valores calculados sao persistidos na IPATB004_AVALIACAO

### R9. Wizard
- 6 steps: Identificacao → Tecnica → Negocio → Impedimento → Urgencia → Riscos
- Navegacao hibrida: sequencial + barra clicavel para steps visitados
- Rascunho salvo automaticamente
- Preview IPA lateral a partir do Step 2
- "Calcular e Salvar" so quando steps obrigatorios completos

### R10. Nomenclatura Banco de Dados
- Conforme Guia de Diagramacao e Dicionarizacao (docs/db/)
- Sigla do esquema: IPA
- Tabelas: IPATB{NNN}_{NOME}
- Colunas: {CLASSE}_{TERMOS}
- Constraints: PK_, FK_, IN_, CC_, AK_

---

## S — Stories (Historias de Usuario)

### S1. Login
**Como** usuario, **quero** fazer login com email e senha **para** acessar o sistema.
- Criterio: JWT retornado, redirecionamento para dashboard

### S2. Dashboard
**Como** analista, **quero** ver o ranking de processos por IPA **para** priorizar automacoes.
- Criterio: tabela rankeada com posicao, nome, IT, IN, IPA Final, status/badge
- Criterio: cards resumo com totais por classificacao

### S3. Nova Avaliacao
**Como** analista, **quero** preencher o wizard de avaliacao IPA **para** avaliar um processo.
- Criterio: 6 steps com navegacao hibrida
- Criterio: preview do IPA atualizado em tempo real no painel lateral
- Criterio: salvar rascunho automatico entre steps

### S4. Resultado
**Como** analista, **quero** ver a memoria de calculo detalhada **para** entender como o IPA foi calculado.
- Criterio: exibe todas as notas, pesos, calculos parciais e final
- Criterio: grafico radar IT vs IN
- Criterio: exportar em PDF

### S5. Gestao de Usuarios
**Como** admin, **quero** criar e gerenciar usuarios da minha organizacao **para** controlar acesso.
- Criterio: CRUD com filtro por perfil
- Criterio: scoped pelo tenant do admin

### S6. Gestao de Organizacoes
**Como** superadmin, **quero** criar e gerenciar organizacoes **para** onboarding de novos clientes.
- Criterio: CRUD de tenants

### S7. Editar Avaliacao
**Como** analista, **quero** editar uma avaliacao existente **para** atualizar notas apos mudanca de contexto.
- Criterio: reabrir wizard preenchido, recalcular IPA ao salvar

### S8. Filtrar Processos
**Como** usuario, **quero** filtrar processos por area, status e periodo **para** encontrar rapidamente.
- Criterio: filtros combinaveis na listagem
