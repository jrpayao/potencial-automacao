# Justificativas Individuais por Critério de Negócio — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar campos `justifReducaoSla`, `justifAbrangencia` e `justifVolumeMensal` do banco de dados até o PDF, passando por DTO, service backend, wizard Angular e PdfService.

**Architecture:** Os 3 novos campos são opcionais em todo o stack (colunas nullable no banco, campos opcionais no DTO). O `CreateAvaliacaoDto` na lib shared é a fonte única de tipos — `UpdateAvaliacaoDto` e `DraftAvaliacaoDto` são derivados via `Partial`, então uma alteração no `create` propaga automaticamente. O wizard Angular usa o `negocioGroup` (FormGroup) como estado local, que depois serializa para `DraftAvaliacaoDto`.

**Tech Stack:** NestJS + TypeORM + PostgreSQL (backend) · Angular 19 Signals + ReactiveFormsModule (frontend) · pdfmake (geração PDF) · `@ipa/shared` (DTOs/interfaces compartilhados)

**Verificação:** Use `./node_modules/.bin/tsc --noEmit -p tsconfig.base.json` após cada task para confirmar que não há erros de tipo. Os testes unitários incluídos são referência para execução futura quando o runner estiver configurado.

---

## Mapa de Arquivos

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `libs/shared/src/lib/dtos/create-avaliacao.dto.ts` | Modificar | Adicionar 3 campos opcionais ao DTO base |
| `apps/api/src/avaliacoes/avaliacao.entity.ts` | Modificar | Adicionar 3 colunas nullable no banco |
| `apps/api/src/avaliacoes/avaliacoes.service.ts` | Modificar | Mapear os 3 campos em `toAvaliacaoFields`, `mapAvaliacaoToDraft`, `assertDraftCompleto` |
| `apps/api/src/avaliacoes/avaliacoes.service.spec.ts` | Modificar | Adicionar teste para `mapAvaliacaoToDraft` com os 3 novos campos |
| `apps/api/src/avaliacoes/pdf.service.ts` | Modificar | Substituir 3 `'-'` pelos novos campos da entidade |
| `apps/frontend/.../wizard.component.ts` | Modificar | +3 `FormControl` no `negocioGroup` + patchValue draft + buildDraftDto |
| `apps/frontend/.../step-negocio.component.ts` | Modificar | `controlJustif?` em `SubCriterio` + mapear nos 3 sub-critérios |
| `apps/frontend/.../step-negocio.component.html` | Modificar | Renderizar textarea inline quando `sc.controlJustif` existir |

---

## Task 1 — DTO + Entidade (fundação de dados)

**Files:**
- Modify: `libs/shared/src/lib/dtos/create-avaliacao.dto.ts`
- Modify: `apps/api/src/avaliacoes/avaliacao.entity.ts`

- [ ] **Step 1.1: Adicionar 3 campos opcionais ao `CreateAvaliacaoDto`**

Abra `libs/shared/src/lib/dtos/create-avaliacao.dto.ts` e adicione após `notaAbrangencia`:

```ts
// Dimensão Negócio (IN)
notaGestaoRisco: number;
justifGestaoRisco: string;
notaReducaoSla: number;
justifReducaoSla?: string;      // NOVO
notaAbrangencia: number;
justifAbrangencia?: string;     // NOVO
notaExperienciaCidadao: number;
justifImpactoCidadao: string;
notaVolumeMensal: number;
justifVolumeMensal?: string;    // NOVO
notaFteLiberado: number;
justifEficiencia: string;
```

O arquivo completo final deve ser:

```ts
import { FatorImpedimento } from '../enums/fator-impedimento.enum.js';
import { FatorUrgencia } from '../enums/fator-urgencia.enum.js';

export interface CreateAvaliacaoDto {
  processoId: number;

  // Dimensão Técnica (IT)
  notaSegurancaAcessos: number;
  justifSegurancaAcessos: string;
  notaEstabilidadeLegado: number;
  justifEstabilidadeLegado: string;
  notaEstruturacaoDados: number;
  justifEstruturacaoDados: string;

  // Dimensão Negócio (IN)
  notaGestaoRisco: number;
  justifGestaoRisco: string;
  notaReducaoSla: number;
  justifReducaoSla?: string;
  notaAbrangencia: number;
  justifAbrangencia?: string;
  notaExperienciaCidadao: number;
  justifImpactoCidadao: string;
  notaVolumeMensal: number;
  justifVolumeMensal?: string;
  notaFteLiberado: number;
  justifEficiencia: string;

  // Fatores
  fatorImpedimento: FatorImpedimento;
  justifImpedimento: string;
  fatorUrgencia: FatorUrgencia;
  justifUrgencia: string;

  // Riscos
  riscosContingencia?: string;
}
```

> `UpdateAvaliacaoDto = Partial<CreateAvaliacaoDto>` e `DraftAvaliacaoDto = Partial<Omit<CreateAvaliacaoDto, 'processoId'>>` — os 3 campos ficam automaticamente opcionais neles.

- [ ] **Step 1.2: Adicionar 3 colunas nullable na entidade**

Abra `apps/api/src/avaliacoes/avaliacao.entity.ts` e adicione após o bloco de `NU_NOTA_ABRANGENCIA`:

```ts
@Column({ name: 'NU_NOTA_ABRANGENCIA', type: 'int', nullable: false })
nuNotaAbrangencia!: number;

// NOVO — adicionado após nuNotaAbrangencia
@Column({ name: 'DE_JUSTIF_REDUCAO_SLA', type: 'text', nullable: true })
deJustifReducaoSla!: string | null;

@Column({ name: 'DE_JUSTIF_ABRANGENCIA', type: 'text', nullable: true })
deJustifAbrangencia!: string | null;
```

E após `NU_NOTA_VOLUME_MENSAL`:

```ts
@Column({ name: 'NU_NOTA_VOLUME_MENSAL', type: 'int', nullable: false })
nuNotaVolumeMensal!: number;

// NOVO — adicionado após nuNotaVolumeMensal
@Column({ name: 'DE_JUSTIF_VOLUME_MENSAL', type: 'text', nullable: true })
deJustifVolumeMensal!: string | null;
```

> TypeORM com `synchronize: true` (configuração atual em produção) cria as colunas automaticamente no próximo boot da API. Nenhuma migration manual necessária.

- [ ] **Step 1.3: Verificar TypeScript**

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.base.json 2>&1 | head -20
```

Saída esperada: sem erros (ou erros não relacionados a estes arquivos).

- [ ] **Step 1.4: Commitar**

```bash
git add libs/shared/src/lib/dtos/create-avaliacao.dto.ts \
        apps/api/src/avaliacoes/avaliacao.entity.ts
git commit -m "feat(pdf): adicionar campos de justificativa para reducaoSla, abrangencia e volumeMensal"
```

---

## Task 2 — Service Backend (mapeamento dos novos campos)

**Files:**
- Modify: `apps/api/src/avaliacoes/avaliacoes.service.ts`
- Modify: `apps/api/src/avaliacoes/avaliacoes.service.spec.ts`

- [ ] **Step 2.1: Atualizar `toAvaliacaoFields`**

Em `avaliacoes.service.ts`, localize o método `toAvaliacaoFields` (linha ~408) e adicione os 3 novos campos:

```ts
private toAvaliacaoFields(dto: CreateAvaliacaoDto) {
  return {
    nuNotaSegurancaAcessos: dto.notaSegurancaAcessos,
    deJustifSegurancaAcessos: dto.justifSegurancaAcessos,
    nuNotaEstabilidadeLegado: dto.notaEstabilidadeLegado,
    deJustifEstabilidadeLegado: dto.justifEstabilidadeLegado,
    nuNotaEstruturacaoDados: dto.notaEstruturacaoDados,
    deJustifEstruturacaoDados: dto.justifEstruturacaoDados,
    nuNotaGestaoRisco: dto.notaGestaoRisco,
    deJustifGestaoRisco: dto.justifGestaoRisco,
    nuNotaReducaoSla: dto.notaReducaoSla,
    deJustifReducaoSla: dto.justifReducaoSla ?? null,        // NOVO
    nuNotaAbrangencia: dto.notaAbrangencia,
    deJustifAbrangencia: dto.justifAbrangencia ?? null,      // NOVO
    nuNotaExperienciaCidadao: dto.notaExperienciaCidadao,
    deJustifImpactoCidadao: dto.justifImpactoCidadao,
    nuNotaVolumeMensal: dto.notaVolumeMensal,
    deJustifVolumeMensal: dto.justifVolumeMensal ?? null,    // NOVO
    nuNotaFteLiberado: dto.notaFteLiberado,
    deJustifEficiencia: dto.justifEficiencia,
    vrFatorImpedimento: dto.fatorImpedimento,
    deJustifImpedimento: dto.justifImpedimento,
    vrFatorUrgencia: dto.fatorUrgencia,
    deJustifUrgencia: dto.justifUrgencia,
    deRiscosContingencia: dto.riscosContingencia ?? null,
  };
}
```

- [ ] **Step 2.2: Atualizar `mapAvaliacaoToDraft`**

Localize `mapAvaliacaoToDraft` (linha ~383) e adicione os 3 novos campos:

```ts
private mapAvaliacaoToDraft(avaliacao: Avaliacao): DraftAvaliacaoDto {
  return {
    notaSegurancaAcessos: avaliacao.nuNotaSegurancaAcessos,
    justifSegurancaAcessos: avaliacao.deJustifSegurancaAcessos,
    notaEstabilidadeLegado: avaliacao.nuNotaEstabilidadeLegado,
    justifEstabilidadeLegado: avaliacao.deJustifEstabilidadeLegado,
    notaEstruturacaoDados: avaliacao.nuNotaEstruturacaoDados,
    justifEstruturacaoDados: avaliacao.deJustifEstruturacaoDados,
    notaGestaoRisco: avaliacao.nuNotaGestaoRisco,
    justifGestaoRisco: avaliacao.deJustifGestaoRisco,
    notaReducaoSla: avaliacao.nuNotaReducaoSla,
    justifReducaoSla: avaliacao.deJustifReducaoSla ?? undefined,       // NOVO
    notaAbrangencia: avaliacao.nuNotaAbrangencia,
    justifAbrangencia: avaliacao.deJustifAbrangencia ?? undefined,     // NOVO
    notaExperienciaCidadao: avaliacao.nuNotaExperienciaCidadao,
    justifImpactoCidadao: avaliacao.deJustifImpactoCidadao,
    notaVolumeMensal: avaliacao.nuNotaVolumeMensal,
    justifVolumeMensal: avaliacao.deJustifVolumeMensal ?? undefined,   // NOVO
    notaFteLiberado: avaliacao.nuNotaFteLiberado,
    justifEficiencia: avaliacao.deJustifEficiencia,
    fatorImpedimento: avaliacao.vrFatorImpedimento,
    justifImpedimento: avaliacao.deJustifImpedimento,
    fatorUrgencia: avaliacao.vrFatorUrgencia,
    justifUrgencia: avaliacao.deJustifUrgencia,
    riscosContingencia: avaliacao.deRiscosContingencia ?? undefined,
  };
}
```

- [ ] **Step 2.3: Atualizar `assertDraftCompleto`**

Localize `assertDraftCompleto` (linha ~317) e adicione os 3 campos opcionais no return:

```ts
return {
  processoId,
  notaSegurancaAcessos: draft.notaSegurancaAcessos!,
  justifSegurancaAcessos: draft.justifSegurancaAcessos!,
  notaEstabilidadeLegado: draft.notaEstabilidadeLegado!,
  justifEstabilidadeLegado: draft.justifEstabilidadeLegado!,
  notaEstruturacaoDados: draft.notaEstruturacaoDados!,
  justifEstruturacaoDados: draft.justifEstruturacaoDados!,
  notaGestaoRisco: draft.notaGestaoRisco!,
  justifGestaoRisco: draft.justifGestaoRisco!,
  notaReducaoSla: draft.notaReducaoSla!,
  justifReducaoSla: draft.justifReducaoSla,               // NOVO (opcional)
  notaAbrangencia: draft.notaAbrangencia!,
  justifAbrangencia: draft.justifAbrangencia,             // NOVO (opcional)
  notaExperienciaCidadao: draft.notaExperienciaCidadao!,
  justifImpactoCidadao: draft.justifImpactoCidadao!,
  notaVolumeMensal: draft.notaVolumeMensal!,
  justifVolumeMensal: draft.justifVolumeMensal,           // NOVO (opcional)
  notaFteLiberado: draft.notaFteLiberado!,
  justifEficiencia: draft.justifEficiencia!,
  fatorImpedimento: draft.fatorImpedimento!,
  justifImpedimento: draft.justifImpedimento!,
  fatorUrgencia: draft.fatorUrgencia!,
  justifUrgencia: draft.justifUrgencia!,
  riscosContingencia: draft.riscosContingencia,
};
```

> **Nota:** Os 3 campos NÃO são adicionados ao array `requiredFields` — eles são opcionais para finalização (conforme "Fora de escopo" da spec).

- [ ] **Step 2.4: Adicionar teste em `avaliacoes.service.spec.ts`**

Adicione ao final do `describe('AvaliacoesService')`:

```ts
it('deve mapear deJustifReducaoSla, deJustifAbrangencia e deJustifVolumeMensal para o draft', async () => {
  const processo = {
    idProcesso: 5,
    idOrganizacao: 1,
    coSituacao: 'avaliado',
    deRascunhoAvaliacao: null,
    avaliacao: {
      nuNotaSegurancaAcessos: 3, deJustifSegurancaAcessos: 'a',
      nuNotaEstabilidadeLegado: 3, deJustifEstabilidadeLegado: 'b',
      nuNotaEstruturacaoDados: 3, deJustifEstruturacaoDados: 'c',
      nuNotaGestaoRisco: 3, deJustifGestaoRisco: 'd',
      nuNotaReducaoSla: 2, deJustifReducaoSla: 'SLA justif',
      nuNotaAbrangencia: 4, deJustifAbrangencia: 'Abrangencia justif',
      nuNotaExperienciaCidadao: 3, deJustifImpactoCidadao: 'e',
      nuNotaVolumeMensal: 1, deJustifVolumeMensal: 'Volume justif',
      nuNotaFteLiberado: 2, deJustifEficiencia: 'f',
      vrFatorImpedimento: 1, deJustifImpedimento: 'g',
      vrFatorUrgencia: 1, deJustifUrgencia: 'h',
      deRiscosContingencia: null,
    },
  };

  mockProcessoRepo.findOne.mockResolvedValue(processo);

  const draft = await service.getProcessoRascunho(5, 1);

  expect(draft.justifReducaoSla).toBe('SLA justif');
  expect(draft.justifAbrangencia).toBe('Abrangencia justif');
  expect(draft.justifVolumeMensal).toBe('Volume justif');
});

it('deve mapear null em deJustifReducaoSla como undefined no draft', async () => {
  const processo = {
    idProcesso: 6,
    idOrganizacao: 1,
    coSituacao: 'avaliado',
    deRascunhoAvaliacao: null,
    avaliacao: {
      nuNotaSegurancaAcessos: 3, deJustifSegurancaAcessos: 'a',
      nuNotaEstabilidadeLegado: 3, deJustifEstabilidadeLegado: 'b',
      nuNotaEstruturacaoDados: 3, deJustifEstruturacaoDados: 'c',
      nuNotaGestaoRisco: 3, deJustifGestaoRisco: 'd',
      nuNotaReducaoSla: 2, deJustifReducaoSla: null,
      nuNotaAbrangencia: 4, deJustifAbrangencia: null,
      nuNotaExperienciaCidadao: 3, deJustifImpactoCidadao: 'e',
      nuNotaVolumeMensal: 1, deJustifVolumeMensal: null,
      nuNotaFteLiberado: 2, deJustifEficiencia: 'f',
      vrFatorImpedimento: 1, deJustifImpedimento: 'g',
      vrFatorUrgencia: 1, deJustifUrgencia: 'h',
      deRiscosContingencia: null,
    },
  };

  mockProcessoRepo.findOne.mockResolvedValue(processo);

  const draft = await service.getProcessoRascunho(6, 1);

  expect(draft.justifReducaoSla).toBeUndefined();
  expect(draft.justifAbrangencia).toBeUndefined();
  expect(draft.justifVolumeMensal).toBeUndefined();
});
```

- [ ] **Step 2.5: Verificar TypeScript**

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.base.json 2>&1 | head -20
```

Saída esperada: sem erros.

- [ ] **Step 2.6: Commitar**

```bash
git add apps/api/src/avaliacoes/avaliacoes.service.ts \
        apps/api/src/avaliacoes/avaliacoes.service.spec.ts
git commit -m "feat(pdf): mapear justificativas individuais no service backend"
```

---

## Task 3 — PdfService (substituir '-' pelos novos campos)

**Files:**
- Modify: `apps/api/src/avaliacoes/pdf.service.ts`

- [ ] **Step 3.1: Substituir `'-'` pelos novos campos na Seção 3 do PDF**

Abra `apps/api/src/avaliacoes/pdf.service.ts`. Localize a seção `// Seção 3: Dimensão Negócio` (linha ~86). Substitua as 3 linhas que têm `'-'` como justificativa:

```ts
// ANTES — Redução de SLA (linha ~105)
[
  'Redução de SLA',
  { text: String(avaliacao.nuNotaReducaoSla), alignment: 'center' },
  '-',
],

// DEPOIS
[
  'Redução de SLA',
  { text: String(avaliacao.nuNotaReducaoSla), alignment: 'center' },
  avaliacao.deJustifReducaoSla || '-',
],
```

```ts
// ANTES — Abrangência (linha ~112)
[
  'Abrangência',
  { text: String(avaliacao.nuNotaAbrangencia), alignment: 'center' },
  '-',
],

// DEPOIS
[
  'Abrangência',
  { text: String(avaliacao.nuNotaAbrangencia), alignment: 'center' },
  avaliacao.deJustifAbrangencia || '-',
],
```

```ts
// ANTES — Volume Mensal (linha ~119)
[
  'Volume Mensal',
  { text: String(avaliacao.nuNotaVolumeMensal), alignment: 'center' },
  '-',
],

// DEPOIS
[
  'Volume Mensal',
  { text: String(avaliacao.nuNotaVolumeMensal), alignment: 'center' },
  avaliacao.deJustifVolumeMensal || '-',
],
```

- [ ] **Step 3.2: Verificar TypeScript**

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.base.json 2>&1 | head -20
```

Saída esperada: sem erros.

- [ ] **Step 3.3: Commitar**

```bash
git add apps/api/src/avaliacoes/pdf.service.ts
git commit -m "feat(pdf): preencher justificativas de reducaoSla, abrangencia e volumeMensal no PDF"
```

---

## Task 4 — Wizard Angular: FormGroup + draft

**Files:**
- Modify: `apps/frontend/src/app/features/avaliacao-wizard/wizard.component.ts`

- [ ] **Step 4.1: Adicionar 3 `FormControl` ao `negocioGroup`**

Localize o `negocioGroup` (linha ~93). Adicione os 3 novos controles nos locais corretos:

```ts
readonly negocioGroup = new FormGroup({
  notaGestaoRisco: new FormControl<number | null>(null, Validators.required),
  justifGestaoRisco: new FormControl(''),
  notaReducaoSla: new FormControl<number | null>(null, Validators.required),
  justifReducaoSla: new FormControl(''),        // NOVO
  justifImpactoCidadao: new FormControl(''),
  notaAbrangencia: new FormControl<number | null>(null, Validators.required),
  justifAbrangencia: new FormControl(''),       // NOVO
  notaExperienciaCidadao: new FormControl<number | null>(null, Validators.required),
  notaVolumeMensal: new FormControl<number | null>(null, Validators.required),
  justifVolumeMensal: new FormControl(''),      // NOVO
  justifEficiencia: new FormControl(''),
  notaFteLiberado: new FormControl<number | null>(null, Validators.required),
});
```

- [ ] **Step 4.2: Atualizar o `patchValue` para carregamento do draft**

Localize o `patchValue` do `negocioGroup` (linha ~216) e adicione os 3 novos campos:

```ts
this.negocioGroup.patchValue({
  notaGestaoRisco: draft.notaGestaoRisco ?? null,
  justifGestaoRisco: draft.justifGestaoRisco ?? '',
  notaReducaoSla: draft.notaReducaoSla ?? null,
  justifReducaoSla: draft.justifReducaoSla ?? '',        // NOVO
  justifImpactoCidadao: draft.justifImpactoCidadao ?? '',
  notaAbrangencia: draft.notaAbrangencia ?? null,
  justifAbrangencia: draft.justifAbrangencia ?? '',      // NOVO
  notaExperienciaCidadao: draft.notaExperienciaCidadao ?? null,
  notaVolumeMensal: draft.notaVolumeMensal ?? null,
  justifVolumeMensal: draft.justifVolumeMensal ?? '',    // NOVO
  justifEficiencia: draft.justifEficiencia ?? '',
  notaFteLiberado: draft.notaFteLiberado ?? null,
});
```

- [ ] **Step 4.3: Atualizar `buildDraftDto` para incluir os 3 novos campos**

Localize `buildDraftDto` (linha ~396) e adicione após `notaReducaoSla`:

```ts
return {
  notaSegurancaAcessos: tec.notaSegurancaAcessos ?? undefined,
  justifSegurancaAcessos: this.nonEmpty(tec.justifSegurancaAcessos),
  notaEstabilidadeLegado: tec.notaEstabilidadeLegado ?? undefined,
  justifEstabilidadeLegado: this.nonEmpty(tec.justifEstabilidadeLegado),
  notaEstruturacaoDados: tec.notaEstruturacaoDados ?? undefined,
  justifEstruturacaoDados: this.nonEmpty(tec.justifEstruturacaoDados),
  notaGestaoRisco: neg.notaGestaoRisco ?? undefined,
  justifGestaoRisco: this.nonEmpty(neg.justifGestaoRisco),
  notaReducaoSla: neg.notaReducaoSla ?? undefined,
  justifReducaoSla: this.nonEmpty(neg.justifReducaoSla),        // NOVO
  justifImpactoCidadao: this.nonEmpty(neg.justifImpactoCidadao),
  notaAbrangencia: neg.notaAbrangencia ?? undefined,
  justifAbrangencia: this.nonEmpty(neg.justifAbrangencia),      // NOVO
  notaExperienciaCidadao: neg.notaExperienciaCidadao ?? undefined,
  notaVolumeMensal: neg.notaVolumeMensal ?? undefined,
  justifVolumeMensal: this.nonEmpty(neg.justifVolumeMensal),    // NOVO
  justifEficiencia: this.nonEmpty(neg.justifEficiencia),
  notaFteLiberado: neg.notaFteLiberado ?? undefined,
  fatorImpedimento: (imp.fatorImpedimento ?? undefined) as FatorImpedimento | undefined,
  justifImpedimento: this.nonEmpty(imp.justifImpedimento),
  fatorUrgencia: (urg.fatorUrgencia ?? undefined) as FatorUrgencia | undefined,
  justifUrgencia: this.nonEmpty(urg.justifUrgencia),
  riscosContingencia: riscosTexto || undefined,
};
```

- [ ] **Step 4.4: Verificar TypeScript**

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.base.json 2>&1 | head -20
```

Saída esperada: sem erros.

- [ ] **Step 4.5: Commitar**

```bash
git add apps/frontend/src/app/features/avaliacao-wizard/wizard.component.ts
git commit -m "feat(pdf): adicionar controles justifReducaoSla, justifAbrangencia e justifVolumeMensal ao wizard"
```

---

## Task 5 — Step Negócio: interface + template

**Files:**
- Modify: `apps/frontend/src/app/features/avaliacao-wizard/steps/negocio/step-negocio.component.ts`
- Modify: `apps/frontend/src/app/features/avaliacao-wizard/steps/negocio/step-negocio.component.html`

- [ ] **Step 5.1: Adicionar `controlJustif?` à interface `SubCriterio`**

Abra `step-negocio.component.ts`. Atualize a interface:

```ts
interface SubCriterio {
  label: string;
  control: string;
  descriptors: { value: number; label: string }[];
  controlJustif?: string; // NOVO — se presente, renderiza textarea individual
}
```

- [ ] **Step 5.2: Mapear `controlJustif` nos 3 sub-critérios**

Ainda em `step-negocio.component.ts`, adicione `controlJustif` nos 3 critérios:

```ts
// Bloco "Impacto no Cidadão" — sub-critério Redução de SLA
{
  label: 'Redução de SLA (Tempo de Resposta)',
  control: 'notaReducaoSla',
  controlJustif: 'justifReducaoSla',   // NOVO
  descriptors: [
    { value: 5, label: 'Reduz SLA em > 80%' },
    { value: 4, label: 'Reduz SLA em 60-80%' },
    { value: 3, label: 'Reduz SLA em 40-60%' },
    { value: 2, label: 'Reduz SLA em 20-40%' },
    { value: 1, label: 'Reduz SLA em até 20%' },
    { value: 0, label: 'Sem impacto no SLA' },
  ],
},
// Bloco "Impacto no Cidadão" — sub-critério Abrangência
{
  label: 'Abrangência (Volume de Cidadãos)',
  control: 'notaAbrangencia',
  controlJustif: 'justifAbrangencia',  // NOVO
  descriptors: [
    { value: 5, label: '> 100 mil cidadãos/ano' },
    { value: 4, label: '50-100 mil cidadãos/ano' },
    { value: 3, label: '10-50 mil cidadãos/ano' },
    { value: 2, label: '1-10 mil cidadãos/ano' },
    { value: 1, label: '< 1 mil cidadãos/ano' },
    { value: 0, label: 'Uso exclusivamente interno' },
  ],
},
// Bloco "Eficiência Operacional" — sub-critério Volume Mensal
{
  label: 'Volume Mensal de Execuções',
  control: 'notaVolumeMensal',
  controlJustif: 'justifVolumeMensal', // NOVO
  descriptors: [
    { value: 5, label: '> 10 mil execuções/mês' },
    { value: 4, label: '5-10 mil execuções/mês' },
    { value: 3, label: '1-5 mil execuções/mês' },
    { value: 2, label: '500-1000 execuções/mês' },
    { value: 1, label: '100-500 execuções/mês' },
    { value: 0, label: '< 100 execuções/mês' },
  ],
},
```

- [ ] **Step 5.3: Atualizar o template para renderizar textarea inline**

Abra `step-negocio.component.html`. Localize o bloco `@for (sub of bloco.subCriterios ...)` e adicione o bloco `@if` logo após o fechamento da `div.options-grid`:

```html
@for (sub of bloco.subCriterios; track sub.control) {
  <div class="sub-criterio">
    <label class="sub-label">{{ sub.label }}</label>

    <div class="options-grid">
      @for (desc of sub.descriptors; track desc.value) {
        <label class="option-item" [class.selected]="form().get(sub.control)?.value === desc.value">
          <input
            type="radio"
            [name]="sub.control"
            [value]="desc.value"
            [formControlName]="sub.control"
            class="radio-input"
          />
          <div class="option-content">
            <span class="option-value">{{ desc.value }}</span>
            <span class="option-text">{{ desc.label }}</span>
          </div>
        </label>
      }
    </div>

    @if (sub.controlJustif) {
      <div class="justificativa-field">
        <label [for]="sub.controlJustif" class="field-label">Justificativa</label>
        <textarea
          [id]="sub.controlJustif"
          [formControlName]="sub.controlJustif"
          class="textarea-control"
          placeholder="Descreva o impacto esperado..."
          rows="2"
        ></textarea>
      </div>
    }
  </div>
}
```

- [ ] **Step 5.4: Verificar TypeScript**

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.base.json 2>&1 | head -20
```

Saída esperada: sem erros.

- [ ] **Step 5.5: Verificar build completo (shared + api + frontend)**

```bash
NX_IGNORE_UNSUPPORTED_TS_SETUP=true npm run build:shared 2>&1 | tail -5
NX_IGNORE_UNSUPPORTED_TS_SETUP=true npm run build:api 2>&1 | tail -5
NX_IGNORE_UNSUPPORTED_TS_SETUP=true npm run build:frontend 2>&1 | tail -5
```

Saída esperada para cada: `Successfully ran target build`.

- [ ] **Step 5.6: Commitar**

```bash
git add apps/frontend/src/app/features/avaliacao-wizard/steps/negocio/step-negocio.component.ts \
        apps/frontend/src/app/features/avaliacao-wizard/steps/negocio/step-negocio.component.html
git commit -m "feat(pdf): exibir textareas individuais para justificativas de negocio no wizard"
```

---

## Critérios de Aceite (verificação manual)

Após todas as tasks:

- [ ] Abrir o wizard → Step Negócio → verificar que Redução de SLA e Abrangência têm textarea individual após cada nota
- [ ] Verificar que Volume Mensal também tem textarea individual
- [ ] Verificar que as justificativas de bloco (Impacto no Cidadão, Eficiência) ainda aparecem ao final de cada bloco
- [ ] Preencher o wizard completo e exportar PDF → verificar que os 3 campos antes `'-'` agora mostram o texto preenchido
- [ ] Editar uma avaliação existente → verificar que os novos campos carregam vazios (sem erro)
- [ ] Avaliações existentes no banco continuam abrindo sem erro (colunas nullable)
