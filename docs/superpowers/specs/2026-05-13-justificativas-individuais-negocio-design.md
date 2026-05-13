# SPEC — Justificativas Individuais por Critério de Negócio
> Status: APROVADO
> Issue: #276 (sub-issue de #267 — Exportar PDF)

## Contexto

O PDF gerado pelo sistema exibia `'-'` nas linhas de Redução de SLA, Abrangência e Volume Mensal
porque a entidade `Avaliacao` não possuía campos de justificativa individuais para esses critérios.
O wizard coletava apenas uma justificativa por bloco (Impacto no Cidadão e Eficiência).

Esta spec cobre a adição de justificativas individuais para os 3 critérios faltantes, mantendo
o estilo de relatório atual e sem campos de assinatura.

## Decisões de design

- **Manter compatibilidade:** novas colunas no banco são `nullable: true`; avaliações existentes não quebram
- **Manter bloco justificativa:** os textareas de bloco (`justifImpactoCidadao`, `justifEficiencia`) permanecem no wizard sem remoção
- **PDF inalterado em layout:** apenas substituição de `'-'` pelos novos campos; sem redesenho da estrutura do relatório
- **Campos opcionais no DTO de update/draft:** obrigatórios apenas no create; no PDF exibe `'-'` se nulo/vazio

## Arquivos modificados (9 arquivos, 0 criados)

| Arquivo | Mudança |
|---|---|
| `libs/shared/src/lib/dtos/create-avaliacao.dto.ts` | +3 campos obrigatórios |
| `libs/shared/src/lib/dtos/update-avaliacao.dto.ts` | +3 campos opcionais |
| `libs/shared/src/lib/dtos/draft-avaliacao.dto.ts` | +3 campos opcionais |
| `apps/api/src/avaliacoes/avaliacao.entity.ts` | +3 colunas `nullable: true` |
| `apps/api/src/avaliacoes/avaliacoes.service.ts` | mapear 3 campos em `create`, `update`, `getProcessoRascunho` |
| `apps/api/src/avaliacoes/pdf.service.ts` | substituir 3 `'-'` pelos novos campos |
| `apps/frontend/.../wizard.component.ts` | +3 `FormControl` no `negocioGroup` + `patchValue` + `buildDto` |
| `apps/frontend/.../step-negocio.component.ts` | `controlJustif?` em `SubCriterio` + mapear nos 3 critérios |
| `apps/frontend/.../step-negocio.component.html` | textarea inline quando `sc.controlJustif` existir |

## Novos campos

### Entidade (`IPATB004_AVALIACAO`)

```
DE_JUSTIF_REDUCAO_SLA    TEXT  nullable
DE_JUSTIF_ABRANGENCIA    TEXT  nullable
DE_JUSTIF_VOLUME_MENSAL  TEXT  nullable
```

### DTOs (`@ipa/shared`)

```ts
// create-avaliacao.dto.ts (obrigatório)
justifReducaoSla: string;
justifAbrangencia: string;
justifVolumeMensal: string;

// update-avaliacao.dto.ts e draft-avaliacao.dto.ts (opcional)
justifReducaoSla?: string;
justifAbrangencia?: string;
justifVolumeMensal?: string;
```

## Wizard — Step Negócio (comportamento pós-mudança)

```
Bloco: Impacto no Cidadão
  ├─ Redução de SLA        [radio 0–5]
  │    └─ [textarea] Justificativa Redução de SLA   ← NOVO (controlJustif: 'justifReducaoSla')
  ├─ Abrangência           [radio 0–5]
  │    └─ [textarea] Justificativa Abrangência       ← NOVO (controlJustif: 'justifAbrangencia')
  ├─ Experiência do Usuário [radio 0–5]
  └─ [textarea] Justificativa do bloco (existente — justifImpactoCidadao)

Bloco: Eficiência Operacional
  ├─ Volume Mensal          [radio 0–5]
  │    └─ [textarea] Justificativa Volume Mensal     ← NOVO (controlJustif: 'justifVolumeMensal')
  ├─ FTE Liberado           [radio 0–5]
  └─ [textarea] Justificativa do bloco (existente — justifEficiencia)
```

### Interface `SubCriterio` atualizada

```ts
interface SubCriterio {
  label: string;
  control: string;
  descriptors: { value: number; label: string }[];
  controlJustif?: string; // NOVO — se presente, renderiza textarea individual
}
```

### Template — lógica de renderização

```html
@if (sc.controlJustif) {
  <div class="justificativa-field">
    <label [for]="sc.controlJustif" class="field-label">Justificativa</label>
    <textarea
      [id]="sc.controlJustif"
      [formControlName]="sc.controlJustif"
      class="textarea-control"
      rows="2"
    ></textarea>
  </div>
}
```

## PDF — Seção 3 (Dimensão Negócio) pós-mudança

| Critério | Nota | Justificativa |
|---|---|---|
| Gestão de Risco | nota | `deJustifGestaoRisco` |
| Redução de SLA | nota | `deJustifReducaoSla` ← antes `'-'` |
| Abrangência | nota | `deJustifAbrangencia` ← antes `'-'` |
| Experiência do Cidadão | nota | `deJustifImpactoCidadao` |
| Volume Mensal | nota | `deJustifVolumeMensal` ← antes `'-'` |
| FTE Liberado | nota | `deJustifEficiencia` |

Fallback: `avaliacao.deJustifReducaoSla || '-'` (comportamento idêntico ao atual para campos nulos).

## Critérios de aceite

- [ ] Avaliações existentes no banco não quebram (colunas nullable)
- [ ] Novo formulário exibe textareas individuais para Redução de SLA, Abrangência e Volume Mensal
- [ ] Textareas de bloco existentes continuam visíveis e funcionando
- [ ] PDF exportado preenche os 3 campos antes exibidos como `'-'`
- [ ] Editar avaliação existente preenche os novos campos corretamente (draft/patch)
- [ ] TypeScript compila sem erros (`tsc --noEmit`)

## Fora de escopo

- Redesenho do layout do PDF
- Campos de assinatura ou cabeçalho institucional
- Remoção de justificativas de bloco existentes
- Tornar as 3 justificativas obrigatórias na validação do wizard
