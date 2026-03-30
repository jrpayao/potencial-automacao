import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import {
  calcularIT,
  calcularImpactoCidadao,
  calcularEficiencia,
  calcularIN,
  calcularIPA,
  FatorImpedimento,
  FatorUrgencia,
  Perfil,
} from '@ipa/shared';
import { Organizacao } from '../organizacoes/organizacao.entity.js';
import { Usuario } from '../usuarios/usuario.entity.js';
import { Processo } from '../processos/processo.entity.js';
import { Avaliacao } from '../avaliacoes/avaliacao.entity.js';

const dataSource = new DataSource({
  type: 'better-sqlite3',
  database: 'data/ipa.sqlite',
  synchronize: true,
  entities: [Organizacao, Usuario, Processo, Avaliacao],
});

interface SeedProcesso {
  nome: string;
  area: string;
  departamento: string;
  donoProcesso: string;
  solicitante: string;
  dataLevantamento: string;
  avaliacao: {
    notaSegurancaAcessos: number;
    justifSegurancaAcessos: string;
    notaEstabilidadeLegado: number;
    justifEstabilidadeLegado: string;
    notaEstruturacaoDados: number;
    justifEstruturacaoDados: string;
    notaGestaoRisco: number;
    justifGestaoRisco: string;
    notaReducaoSla: number;
    notaAbrangencia: number;
    notaExperienciaCidadao: number;
    justifImpactoCidadao: string;
    notaVolumeMensal: number;
    notaFteLiberado: number;
    justifEficiencia: string;
    fatorImpedimento: number;
    justifImpedimento: string;
    fatorUrgencia: number;
    justifUrgencia: string;
    riscosContingencia: string;
  };
}

const SEED_PROCESSOS: SeedProcesso[] = [
  {
    nome: 'Zelar pelos cumprimentos minimos para celebracao dos Instrumentos',
    area: 'Gestão de Transferências',
    departamento: 'DTRANS',
    donoProcesso: 'Carlos Silva',
    solicitante: 'Maria Oliveira',
    dataLevantamento: '2026-01-15',
    avaliacao: {
      notaSegurancaAcessos: 5,
      justifSegurancaAcessos:
        'Processo envolve dados sensíveis de contratos, necessita controle rigoroso de acessos e trilha de auditoria',
      notaEstabilidadeLegado: 4,
      justifEstabilidadeLegado:
        'Sistema legado SICONV apresenta instabilidade moderada, com janelas de manutenção frequentes',
      notaEstruturacaoDados: 4,
      justifEstruturacaoDados:
        'Dados parcialmente estruturados em planilhas, necessitando normalização para automação',
      notaGestaoRisco: 5,
      justifGestaoRisco:
        'Alto risco regulatório: descumprimento pode resultar em devolução de recursos e sanções do TCU',
      notaReducaoSla: 4,
      notaAbrangencia: 5,
      notaExperienciaCidadao: 4,
      justifImpactoCidadao:
        'Impacta diretamente 27 estados; atraso na celebração paralisa obras e serviços públicos essenciais',
      notaVolumeMensal: 4,
      notaFteLiberado: 5,
      justifEficiencia:
        '~800 instrumentos/mês analisados manualmente; liberaria 5 analistas para atividades estratégicas',
      fatorImpedimento: FatorImpedimento.NENHUM,
      justifImpedimento: 'Sem impedimentos técnicos ou legais identificados',
      fatorUrgencia: FatorUrgencia.IMINENTE,
      justifUrgencia:
        'Prazo legal iminente para cumprimento das metas do PPA 2024-2027',
      riscosContingencia:
        'Contingência: manter equipe manual reduzida durante transição; rollback possível em 48h',
    },
  },
  {
    nome: 'Analise de Prestacao de Contas',
    area: 'Prestação de Contas',
    departamento: 'DPC',
    donoProcesso: 'Ana Beatriz Costa',
    solicitante: 'Roberto Santos',
    dataLevantamento: '2026-02-10',
    avaliacao: {
      notaSegurancaAcessos: 4,
      justifSegurancaAcessos:
        'Dados financeiros requerem controle de acesso, mas já possuem estrutura básica de permissões',
      notaEstabilidadeLegado: 3,
      justifEstabilidadeLegado:
        'Sistema Transferegov é estável mas com limitações de API para integração',
      notaEstruturacaoDados: 3,
      justifEstruturacaoDados:
        'Dados em múltiplos formatos (PDF, planilhas, sistemas), necessitando extração e padronização',
      notaGestaoRisco: 4,
      justifGestaoRisco:
        'Risco médio-alto: atraso na análise gera passivo de prestações pendentes e notificações do TCU',
      notaReducaoSla: 3,
      notaAbrangencia: 4,
      notaExperienciaCidadao: 3,
      justifImpactoCidadao:
        'Afeta gestores municipais que aguardam aprovação para novos repasses; impacto indireto na população',
      notaVolumeMensal: 3,
      notaFteLiberado: 3,
      justifEficiencia:
        '~400 prestações/mês; liberaria 3 analistas parcialmente',
      fatorImpedimento: FatorImpedimento.LEVE,
      justifImpedimento:
        'Impedimento leve: necessita adequação de API do Transferegov para automação completa',
      fatorUrgencia: FatorUrgencia.ESTRATEGICO,
      justifUrgencia:
        'Alinhado com a estratégia de modernização da gestão, prazo até 2027',
      riscosContingencia:
        'Contingência: análise manual parcial durante implantação; equipe de suporte dedicada',
    },
  },
  {
    nome: 'Triagem de Correspondencia',
    area: 'Administrativa',
    departamento: 'DADM',
    donoProcesso: 'José Pereira',
    solicitante: 'Lucia Fernandes',
    dataLevantamento: '2026-03-05',
    avaliacao: {
      notaSegurancaAcessos: 2,
      justifSegurancaAcessos:
        'Correspondências internas de baixo sigilo; controle de acesso básico é suficiente',
      notaEstabilidadeLegado: 2,
      justifEstabilidadeLegado:
        'Processo majoritariamente manual com protocolo em papel; sem sistema legado relevante',
      notaEstruturacaoDados: 1,
      justifEstruturacaoDados:
        'Dados não estruturados: correspondências em papel, e-mails não classificados',
      notaGestaoRisco: 2,
      justifGestaoRisco:
        'Risco baixo: atraso na triagem causa inconveniência mas não impacto regulatório',
      notaReducaoSla: 2,
      notaAbrangencia: 1,
      notaExperienciaCidadao: 1,
      justifImpactoCidadao:
        'Impacto restrito ao ambiente interno do órgão; sem reflexo direto no cidadão',
      notaVolumeMensal: 2,
      notaFteLiberado: 1,
      justifEficiencia:
        '~200 correspondências/mês; liberaria apenas 0.5 FTE',
      fatorImpedimento: FatorImpedimento.MODERADO,
      justifImpedimento:
        'Impedimento moderado: digitalização prévia necessária para viabilizar automação',
      fatorUrgencia: FatorUrgencia.BAIXA,
      justifUrgencia:
        'Sem prazo definido; melhoria operacional de baixa prioridade estratégica',
      riscosContingencia:
        'Contingência: manter processo manual atual, sem risco adicional',
    },
  },
];

function computeIPA(av: SeedProcesso['avaliacao']) {
  const it = calcularIT(
    av.notaSegurancaAcessos,
    av.notaEstabilidadeLegado,
    av.notaEstruturacaoDados,
  );
  const impactoCidadao = calcularImpactoCidadao(
    av.notaReducaoSla,
    av.notaAbrangencia,
    av.notaExperienciaCidadao,
  );
  const eficiencia = calcularEficiencia(
    av.notaVolumeMensal,
    av.notaFteLiberado,
  );
  const in_ = calcularIN(av.notaGestaoRisco, impactoCidadao, eficiencia);
  const { ipaBase, ipaFinal, status } = calcularIPA(
    it,
    in_,
    av.fatorImpedimento,
    av.fatorUrgencia,
  );
  return {
    vrIndiceTecnico: Number(it.toFixed(2)),
    vrIndiceNegocio: Number(in_.toFixed(2)),
    vrIpaBase: Number(ipaBase.toFixed(2)),
    vrIpaFinal: Number(ipaFinal.toFixed(2)),
    coStatusIpa: status,
  };
}

async function seed() {
  await dataSource.initialize();
  console.log('DataSource inicializado');

  const orgRepo = dataSource.getRepository(Organizacao);
  const userRepo = dataSource.getRepository(Usuario);
  const procRepo = dataSource.getRepository(Processo);
  const avalRepo = dataSource.getRepository(Avaliacao);

  // --- Organização ---
  let org = await orgRepo.findOne({ where: { coSlug: 'mgestao' } });
  if (!org) {
    org = orgRepo.create({
      noOrganizacao: 'Ministerio da Gestao',
      coSlug: 'mgestao',
    });
    org = await orgRepo.save(org);
    console.log(`Organização criada: ${org.noOrganizacao} (id=${org.idOrganizacao})`);
  } else {
    console.log(`Organização já existe: ${org.noOrganizacao} (id=${org.idOrganizacao})`);
  }

  // --- Usuários ---
  const usuarios = [
    {
      nome: 'Administrador IPA',
      email: 'admin@ipa.gov.br',
      senha: 'admin123',
      perfil: Perfil.SUPERADMIN,
    },
    {
      nome: 'Analista IPA',
      email: 'analista@ipa.gov.br',
      senha: 'analista123',
      perfil: Perfil.ANALISTA,
    },
  ];

  const userMap: Record<string, Usuario> = {};

  for (const u of usuarios) {
    let existing = await userRepo.findOne({ where: { deEmail: u.email } });
    if (!existing) {
      const hash = await bcrypt.hash(u.senha, 10);
      existing = userRepo.create({
        noUsuario: u.nome,
        deEmail: u.email,
        coSenhaHash: hash,
        coPerfil: u.perfil,
        idOrganizacao: org.idOrganizacao,
      });
      existing = await userRepo.save(existing);
      console.log(`Usuário criado: ${u.email} (id=${existing.idUsuario})`);
    } else {
      console.log(`Usuário já existe: ${u.email} (id=${existing.idUsuario})`);
    }
    userMap[u.email] = existing;
  }

  const analista = userMap['analista@ipa.gov.br'];

  // --- Processos + Avaliações ---
  for (const sp of SEED_PROCESSOS) {
    let processo = await procRepo.findOne({
      where: { noProcesso: sp.nome, idOrganizacao: org.idOrganizacao },
    });
    if (!processo) {
      processo = procRepo.create({
        noProcesso: sp.nome,
        noArea: sp.area,
        noDepartamento: sp.departamento,
        noDonoProcesso: sp.donoProcesso,
        noSolicitante: sp.solicitante,
        dtLevantamento: sp.dataLevantamento,
        idOrganizacao: org.idOrganizacao,
        idUsuarioCriacao: analista.idUsuario,
        coSituacao: 'avaliado',
      });
      processo = await procRepo.save(processo);
      console.log(`Processo criado: "${sp.nome}" (id=${processo.idProcesso})`);
    } else {
      console.log(`Processo já existe: "${sp.nome}" (id=${processo.idProcesso})`);
      continue; // Se processo existe, pula a avaliação
    }

    const calculated = computeIPA(sp.avaliacao);

    const avaliacao = avalRepo.create({
      idProcesso: processo.idProcesso,
      idOrganizacao: org.idOrganizacao,
      idUsuarioAvaliador: analista.idUsuario,

      nuNotaSegurancaAcessos: sp.avaliacao.notaSegurancaAcessos,
      deJustifSegurancaAcessos: sp.avaliacao.justifSegurancaAcessos,
      nuNotaEstabilidadeLegado: sp.avaliacao.notaEstabilidadeLegado,
      deJustifEstabilidadeLegado: sp.avaliacao.justifEstabilidadeLegado,
      nuNotaEstruturacaoDados: sp.avaliacao.notaEstruturacaoDados,
      deJustifEstruturacaoDados: sp.avaliacao.justifEstruturacaoDados,

      nuNotaGestaoRisco: sp.avaliacao.notaGestaoRisco,
      deJustifGestaoRisco: sp.avaliacao.justifGestaoRisco,
      nuNotaReducaoSla: sp.avaliacao.notaReducaoSla,
      nuNotaAbrangencia: sp.avaliacao.notaAbrangencia,
      nuNotaExperienciaCidadao: sp.avaliacao.notaExperienciaCidadao,
      deJustifImpactoCidadao: sp.avaliacao.justifImpactoCidadao,
      nuNotaVolumeMensal: sp.avaliacao.notaVolumeMensal,
      nuNotaFteLiberado: sp.avaliacao.notaFteLiberado,
      deJustifEficiencia: sp.avaliacao.justifEficiencia,

      vrFatorImpedimento: sp.avaliacao.fatorImpedimento,
      deJustifImpedimento: sp.avaliacao.justifImpedimento,
      vrFatorUrgencia: sp.avaliacao.fatorUrgencia,
      deJustifUrgencia: sp.avaliacao.justifUrgencia,

      deRiscosContingencia: sp.avaliacao.riscosContingencia,

      ...calculated,
    });

    const savedAval = await avalRepo.save(avaliacao);
    console.log(
      `  Avaliação criada: IPA Final=${calculated.vrIpaFinal} (${calculated.coStatusIpa}) id=${savedAval.idAvaliacao}`,
    );
  }

  console.log('\nSeed concluído com sucesso!');
  await dataSource.destroy();
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
