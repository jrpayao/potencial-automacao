import { Injectable } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Avaliacao } from './avaliacao.entity.js';

const NAVY = '#003461';
const GRAY = '#888888';
const GREEN = '#15803d';
const YELLOW = '#ca8a04';
const RED = '#dc2626';
const LIGHT_GRAY = '#f3f4f6';
const BORDER = '#d1d5db';
const CELL_PAD = 6;
const LEFT = 40;
const FONT_SIZE = 9;
const HEADER_H = 22;

@Injectable()
export class PdfService {
  async gerarPdf(avaliacao: Avaliacao): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const chunks: Buffer[] = [];
      doc.on('data', (c: Buffer) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      this.render(doc, avaliacao);
      doc.end();
    });
  }

  private render(doc: PDFKit.PDFDocument, av: Avaliacao): void {
    const W = doc.page.width - LEFT * 2;
    const p = av.processo;

    // Cabeçalho
    doc.fontSize(8).fillColor(GRAY).font('Helvetica')
      .text('IPA — Índice de Potencial de Automação', LEFT, 20, { align: 'center', width: W });
    doc.moveDown(0.5);
    doc.fontSize(18).fillColor(NAVY).font('Helvetica-Bold')
      .text('Relatório de Avaliação IPA', { align: 'center', width: W });
    doc.moveDown(1.2);

    // 1. Identificação
    this.section(doc, '1. Identificação do Processo');
    this.table(doc, W,
      ['Campo', 'Valor'],
      [150, W - 150],
      [
        ['Processo',          p?.noProcesso        ?? `#${av.idProcesso}`],
        ['Área',              p?.noArea            ?? '-'],
        ['Departamento',      p?.noDepartamento    ?? '-'],
        ['Dono do Processo',  p?.noDonoProcesso    ?? '-'],
        ['Solicitante',       p?.noSolicitante     ?? '-'],
        ['Data Levantamento', p?.dtLevantamento    ?? '-'],
        ['Situação',          p?.coSituacao        ?? '-'],
      ],
    );

    // 2. Dimensão Técnica
    this.section(doc, '2. Dimensão Técnica (IT)');
    this.table(doc, W,
      ['Critério', 'Nota', 'Justificativa'],
      [170, 40, W - 210],
      [
        ['Segurança e Acessos',    String(av.nuNotaSegurancaAcessos),  av.deJustifSegurancaAcessos  ?? '-'],
        ['Estabilidade do Legado', String(av.nuNotaEstabilidadeLegado), av.deJustifEstabilidadeLegado ?? '-'],
        ['Estruturação dos Dados', String(av.nuNotaEstruturacaoDados),  av.deJustifEstruturacaoDados  ?? '-'],
      ],
    );

    // 3. Dimensão Negócio
    this.section(doc, '3. Dimensão Negócio (IN)');
    this.table(doc, W,
      ['Critério', 'Nota', 'Justificativa'],
      [170, 40, W - 210],
      [
        ['Gestão de Risco',       String(av.nuNotaGestaoRisco),        av.deJustifGestaoRisco       ?? '-'],
        ['Redução de SLA',        String(av.nuNotaReducaoSla),         av.deJustifReducaoSla        ?? '-'],
        ['Abrangência',           String(av.nuNotaAbrangencia),        av.deJustifAbrangencia       ?? '-'],
        ['Experiência do Cidadão',String(av.nuNotaExperienciaCidadao), av.deJustifImpactoCidadao    ?? '-'],
        ['Volume Mensal',         String(av.nuNotaVolumeMensal),       av.deJustifVolumeMensal      ?? '-'],
        ['FTE Liberado',          String(av.nuNotaFteLiberado),        av.deJustifEficiencia        ?? '-'],
      ],
    );

    // 4. Fatores
    this.section(doc, '4. Fatores de Ajuste');
    this.table(doc, W,
      ['Fator', 'Valor', 'Justificativa'],
      [170, 55, W - 225],
      [
        ['Fator de Impedimento', String(av.vrFatorImpedimento), av.deJustifImpedimento ?? '-'],
        ['Fator de Urgência',    String(av.vrFatorUrgencia),    av.deJustifUrgencia    ?? '-'],
      ],
    );

    // 5. Riscos
    this.section(doc, '5. Riscos e Contingência');
    doc.x = LEFT;
    doc.fontSize(10).fillColor('#111111').font('Helvetica')
      .text(av.deRiscosContingencia ?? 'Nenhum risco ou contingência informado.', { width: W });
    doc.x = LEFT;
    doc.moveDown(1);

    // 6. Resultado
    this.section(doc, '6. Resultado Final — Memória de Cálculo');
    const s = av.coStatusIpa;
    this.table(doc, W,
      ['Indicador', 'Valor'],
      [W - 90, 90],
      [
        ['Índice Técnico (IT)',             Number(av.vrIndiceTecnico).toFixed(2)],
        ['Índice de Negócio (IN)',           Number(av.vrIndiceNegocio).toFixed(2)],
        ['IPA Base (0.5×IT + 0.5×IN)',      Number(av.vrIpaBase).toFixed(2)],
        ['IPA Final (Base × FI × FU)',      Number(av.vrIpaFinal).toFixed(2)],
        ['Status',                           this.formatStatus(s)],
      ],
      s,
    );

    // Rodapé
    doc.x = LEFT;
    doc.moveDown(1);
    doc.x = LEFT;
    doc.fontSize(8).fillColor(GRAY).font('Helvetica')
      .text(`Avaliação realizada em ${new Date(av.tsCriacao).toLocaleDateString('pt-BR')}`,
        { align: 'right', width: W });
  }

  private section(doc: PDFKit.PDFDocument, title: string): void {
    if (doc.y + 22 + HEADER_H + 40 > doc.page.height - 60) doc.addPage();
    doc.x = LEFT; // resetar X — moveDown() não o reseta
    doc.moveDown(0.5);
    doc.x = LEFT;
    doc.fontSize(13).fillColor(NAVY).font('Helvetica-Bold').text(title, { width: doc.page.width - LEFT * 2 });
    doc.x = LEFT;
    doc.moveDown(0.5);
  }

  private drawTableHeader(
    doc: PDFKit.PDFDocument,
    y: number,
    headers: string[],
    colWidths: number[],
  ): void {
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    doc.rect(LEFT, y, totalW, HEADER_H).fill(NAVY);
    let x = LEFT;
    headers.forEach((h, i) => {
      // Setar doc.x e doc.y diretamente antes de cada célula evita acúmulo de cursor
      doc.x = x + CELL_PAD;
      doc.y = y + CELL_PAD;
      doc.fontSize(FONT_SIZE).fillColor('white').font('Helvetica-Bold')
        .text(h, { width: colWidths[i] - CELL_PAD * 2, lineBreak: false });
      x += colWidths[i];
    });
  }

  private table(
    doc: PDFKit.PDFDocument,
    W: number,
    headers: string[],
    colWidths: number[],
    rows: string[][],
    highlightStatus?: string,
  ): void {
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    const isResult = headers[0] === 'Indicador';
    const BOTTOM = doc.page.height - 60;

    // Calcula altura de cada linha
    const rowHeights = rows.map(row =>
      Math.max(
        HEADER_H,
        ...row.map((cell, ci) => {
          doc.fontSize(FONT_SIZE).font('Helvetica');
          return doc.heightOfString(cell, { width: colWidths[ci] - CELL_PAD * 2 }) + CELL_PAD * 2;
        }),
      ),
    );

    let y = doc.y;

    // Garante espaço para o header + primeira linha antes de começar
    if (y + HEADER_H + (rowHeights[0] ?? 0) > BOTTOM) {
      doc.addPage();
      y = doc.y;
    }

    this.drawTableHeader(doc, y, headers, colWidths);
    y += HEADER_H;

    rows.forEach((row, ri) => {
      const rh = rowHeights[ri];

      // Quebra de página: repete o cabeçalho na nova página
      if (y + rh > BOTTOM) {
        doc.addPage();
        y = doc.y;
        this.drawTableHeader(doc, y, headers, colWidths);
        y += HEADER_H;
      }

      const bg = ri % 2 === 0 ? 'white' : LIGHT_GRAY;
      doc.rect(LEFT, y, totalW, rh).fill(bg);
      doc.moveTo(LEFT, y + rh).lineTo(LEFT + totalW, y + rh)
        .strokeColor(BORDER).lineWidth(0.5).stroke();

      let cx = LEFT;
      row.forEach((cell, ci) => {
        let color = '#111111';
        let bold = false;

        if (isResult) {
          if (ri === 3) { color = NAVY; bold = true; }
          if (ri === 4 && highlightStatus) { color = this.statusColor(highlightStatus); bold = true; }
        }

        // Resetar posição explicitamente antes de cada célula
        doc.x = cx + CELL_PAD;
        doc.y = y + CELL_PAD;
        doc.fontSize(FONT_SIZE)
          .fillColor(color)
          .font(bold ? 'Helvetica-Bold' : 'Helvetica')
          .text(cell, { width: colWidths[ci] - CELL_PAD * 2, lineBreak: true });

        cx += colWidths[ci];
      });

      y += rh;
    });

    doc.x = LEFT;
    doc.y = y;
    doc.moveDown(0.8);
  }

  private formatStatus(s: string): string {
    const map: Record<string, string> = {
      prioridade_alta: 'PRIORIDADE ALTA',
      backlog: 'BACKLOG',
      descarte: 'DESCARTE',
    };
    return map[s] ?? s?.toUpperCase() ?? '-';
  }

  private statusColor(s: string): string {
    const map: Record<string, string> = {
      prioridade_alta: GREEN,
      backlog: YELLOW,
      descarte: RED,
    };
    return map[s] ?? '#000000';
  }
}
