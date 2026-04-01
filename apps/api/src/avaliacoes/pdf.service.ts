import { Injectable } from '@nestjs/common';
import { Avaliacao } from './avaliacao.entity.js';

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfMake = require('pdfmake/build/pdfmake');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfFonts = require('pdfmake/build/vfs_fonts');
pdfMake.vfs = pdfFonts.pdfMake?.vfs ?? pdfFonts.vfs ?? pdfFonts;

@Injectable()
export class PdfService {
  async gerarPdf(avaliacao: Avaliacao): Promise<Buffer> {
    const processo = avaliacao.processo;

    const docDefinition: Record<string, unknown> = {
      defaultStyle: { fontSize: 10 },
      pageMargins: [40, 60, 40, 40],
      header: {
        text: 'IPA — Índice de Potencial de Automação',
        alignment: 'center',
        fontSize: 8,
        color: '#888888',
        margin: [0, 20, 0, 0],
      },
      content: [
        // Título
        {
          text: 'Relatório de Avaliação IPA',
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 20],
        },

        // Seção 1: Identificação do Processo
        this.sectionTitle('1. Identificação do Processo'),
        {
          table: {
            widths: [150, '*'],
            body: [
              [{ text: 'Processo', bold: true }, processo?.noProcesso ?? `#${avaliacao.idProcesso}`],
              [{ text: 'Área', bold: true }, processo?.noArea ?? '-'],
              [{ text: 'Departamento', bold: true }, processo?.noDepartamento ?? '-'],
              [{ text: 'Dono do Processo', bold: true }, processo?.noDonoProcesso ?? '-'],
              [{ text: 'Solicitante', bold: true }, processo?.noSolicitante ?? '-'],
              [{ text: 'Data Levantamento', bold: true }, processo?.dtLevantamento ?? '-'],
              [{ text: 'Situação', bold: true }, processo?.coSituacao ?? '-'],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 15],
        },

        // Seção 2: Dimensão Técnica
        this.sectionTitle('2. Dimensão Técnica (IT)'),
        {
          table: {
            widths: [180, 40, '*'],
            body: [
              [
                { text: 'Critério', bold: true },
                { text: 'Nota', bold: true, alignment: 'center' },
                { text: 'Justificativa', bold: true },
              ],
              [
                'Segurança e Acessos',
                { text: String(avaliacao.nuNotaSegurancaAcessos), alignment: 'center' },
                avaliacao.deJustifSegurancaAcessos,
              ],
              [
                'Estabilidade do Legado',
                { text: String(avaliacao.nuNotaEstabilidadeLegado), alignment: 'center' },
                avaliacao.deJustifEstabilidadeLegado,
              ],
              [
                'Estruturação dos Dados',
                { text: String(avaliacao.nuNotaEstruturacaoDados), alignment: 'center' },
                avaliacao.deJustifEstruturacaoDados,
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 15],
        },

        // Seção 3: Dimensão Negócio
        this.sectionTitle('3. Dimensão Negócio (IN)'),
        {
          table: {
            widths: [180, 40, '*'],
            body: [
              [
                { text: 'Critério', bold: true },
                { text: 'Nota', bold: true, alignment: 'center' },
                { text: 'Justificativa', bold: true },
              ],
              [
                'Gestão de Risco',
                { text: String(avaliacao.nuNotaGestaoRisco), alignment: 'center' },
                avaliacao.deJustifGestaoRisco,
              ],
              [
                'Redução de SLA',
                { text: String(avaliacao.nuNotaReducaoSla), alignment: 'center' },
                '-',
              ],
              [
                'Abrangência',
                { text: String(avaliacao.nuNotaAbrangencia), alignment: 'center' },
                '-',
              ],
              [
                'Experiência do Cidadão',
                { text: String(avaliacao.nuNotaExperienciaCidadao), alignment: 'center' },
                avaliacao.deJustifImpactoCidadao,
              ],
              [
                'Volume Mensal',
                { text: String(avaliacao.nuNotaVolumeMensal), alignment: 'center' },
                '-',
              ],
              [
                'FTE Liberado',
                { text: String(avaliacao.nuNotaFteLiberado), alignment: 'center' },
                avaliacao.deJustifEficiencia,
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 15],
        },

        // Seção 4: Fatores
        this.sectionTitle('4. Fatores de Ajuste'),
        {
          table: {
            widths: [180, 60, '*'],
            body: [
              [
                { text: 'Fator', bold: true },
                { text: 'Valor', bold: true, alignment: 'center' },
                { text: 'Justificativa', bold: true },
              ],
              [
                'Fator de Impedimento',
                { text: String(avaliacao.vrFatorImpedimento), alignment: 'center' },
                avaliacao.deJustifImpedimento,
              ],
              [
                'Fator de Urgência',
                { text: String(avaliacao.vrFatorUrgencia), alignment: 'center' },
                avaliacao.deJustifUrgencia,
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 15],
        },

        // Seção 5: Riscos
        this.sectionTitle('5. Riscos e Contingência'),
        {
          text: avaliacao.deRiscosContingencia || 'Nenhum risco ou contingência informado.',
          margin: [0, 0, 0, 15],
        },

        // Seção 6: Resultado Final
        this.sectionTitle('6. Resultado Final — Memória de Cálculo'),
        {
          table: {
            widths: [200, '*'],
            body: [
              [{ text: 'Indicador', bold: true }, { text: 'Valor', bold: true, alignment: 'center' }],
              ['Índice Técnico (IT)', { text: String(Number(avaliacao.vrIndiceTecnico).toFixed(2)), alignment: 'center' }],
              ['Índice de Negócio (IN)', { text: String(Number(avaliacao.vrIndiceNegocio).toFixed(2)), alignment: 'center' }],
              ['IPA Base (0.5×IT + 0.5×IN)', { text: String(Number(avaliacao.vrIpaBase).toFixed(2)), alignment: 'center' }],
              [
                'IPA Final (Base × FI × FU)',
                {
                  text: String(Number(avaliacao.vrIpaFinal).toFixed(2)),
                  alignment: 'center',
                  bold: true,
                  fontSize: 14,
                },
              ],
              [
                'Status',
                {
                  text: this.formatStatus(avaliacao.coStatusIpa),
                  alignment: 'center',
                  bold: true,
                  color: this.statusColor(avaliacao.coStatusIpa),
                  fontSize: 12,
                },
              ],
            ],
          },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 15],
        },

        // Rodapé informativo
        {
          text: `Avaliação realizada em ${new Date(avaliacao.tsCriacao).toLocaleDateString('pt-BR')}`,
          fontSize: 8,
          color: '#888888',
          alignment: 'right',
          margin: [0, 20, 0, 0],
        },
      ],
    };

    return new Promise<Buffer>((resolve, reject) => {
      const pdfDoc = pdfMake.createPdf(docDefinition);
      pdfDoc.getBuffer((buffer: Buffer) => {
        resolve(Buffer.from(buffer));
      }, (err: Error) => {
        reject(err);
      });
    });
  }

  private sectionTitle(text: string): Record<string, unknown> {
    return {
      text,
      fontSize: 13,
      bold: true,
      margin: [0, 10, 0, 8],
      color: '#003461',
    };
  }

  private formatStatus(status: string): string {
    switch (status) {
      case 'prioridade_alta':
        return 'PRIORIDADE ALTA';
      case 'backlog':
        return 'BACKLOG';
      case 'descarte':
        return 'DESCARTE';
      default:
        return status.toUpperCase();
    }
  }

  private statusColor(status: string): string {
    switch (status) {
      case 'prioridade_alta':
        return '#15803d';
      case 'backlog':
        return '#ca8a04';
      case 'descarte':
        return '#dc2626';
      default:
        return '#000000';
    }
  }
}
