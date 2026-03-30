import { describe, it, expect } from 'vitest';
import { StatusIpa } from '../enums/status-ipa.enum.js';
import {
  calcularIT,
  calcularImpactoCidadao,
  calcularEficiencia,
  calcularIN,
  calcularIPA,
  classificarIPA,
} from './calcular-ipa.js';

describe('calcularIT', () => {
  it('deve calcular IT com notas médias', () => {
    // 3*0.4 + 3*0.3 + 3*0.3 = 1.2 + 0.9 + 0.9 = 3.0
    expect(calcularIT(3, 3, 3)).toBeCloseTo(3.0);
  });

  it('deve retornar 0 quando todas notas são 0', () => {
    expect(calcularIT(0, 0, 0)).toBe(0);
  });

  it('deve retornar 5 quando todas notas são 5', () => {
    // 5*0.4 + 5*0.3 + 5*0.3 = 2.0 + 1.5 + 1.5 = 5.0
    expect(calcularIT(5, 5, 5)).toBeCloseTo(5.0);
  });

  it('deve ponderar corretamente notas diferentes', () => {
    // 4*0.4 + 2*0.3 + 3*0.3 = 1.6 + 0.6 + 0.9 = 3.1
    expect(calcularIT(4, 2, 3)).toBeCloseTo(3.1);
  });
});

describe('calcularImpactoCidadao', () => {
  it('deve calcular impacto cidadão com notas médias', () => {
    // 3*0.5 + 3*0.35 + 3*0.25 = 1.5 + 1.05 + 0.75 = 3.30
    expect(calcularImpactoCidadao(3, 3, 3)).toBeCloseTo(3.3);
  });

  it('deve normalizar resultado para máximo 5.0', () => {
    // 5*0.5 + 5*0.35 + 5*0.25 = 2.5 + 1.75 + 1.25 = 5.50 → min(5.50, 5.0) = 5.0
    expect(calcularImpactoCidadao(5, 5, 5)).toBeCloseTo(5.0);
  });

  it('deve retornar 0 quando todas notas são 0', () => {
    expect(calcularImpactoCidadao(0, 0, 0)).toBe(0);
  });

  it('deve permitir valor abaixo de 5.0 sem normalizar', () => {
    // 2*0.5 + 2*0.35 + 2*0.25 = 1.0 + 0.7 + 0.5 = 2.20
    expect(calcularImpactoCidadao(2, 2, 2)).toBeCloseTo(2.2);
  });
});

describe('calcularEficiencia', () => {
  it('deve calcular eficiência com notas médias', () => {
    // 3*0.5 + 3*0.5 = 1.5 + 1.5 = 3.0
    expect(calcularEficiencia(3, 3)).toBeCloseTo(3.0);
  });

  it('deve retornar 0 quando todas notas são 0', () => {
    expect(calcularEficiencia(0, 0)).toBe(0);
  });

  it('deve retornar 5 quando todas notas são 5', () => {
    expect(calcularEficiencia(5, 5)).toBeCloseTo(5.0);
  });
});

describe('calcularIN', () => {
  it('deve calcular IN com notas médias', () => {
    // 3*0.5 + 3*0.3 + 3*0.2 = 1.5 + 0.9 + 0.6 = 3.0
    expect(calcularIN(3, 3, 3)).toBeCloseTo(3.0);
  });

  it('deve retornar 0 quando todas notas são 0', () => {
    expect(calcularIN(0, 0, 0)).toBe(0);
  });

  it('deve retornar 5 quando todas notas são 5', () => {
    // 5*0.5 + 5*0.3 + 5*0.2 = 2.5 + 1.5 + 1.0 = 5.0
    expect(calcularIN(5, 5, 5)).toBeCloseTo(5.0);
  });
});

describe('calcularIPA', () => {
  it('deve calcular IPA com notas médias e fatores neutros', () => {
    // ipaBase = 0.5*3 + 0.5*3 = 3.0
    // ipaFinal = 3.0 * 1.0 * 1.0 = 3.0
    const resultado = calcularIPA(3, 3, 1.0, 1.0);
    expect(resultado.ipaBase).toBeCloseTo(3.0);
    expect(resultado.ipaFinal).toBeCloseTo(3.0);
    expect(resultado.status).toBe(StatusIpa.BACKLOG);
  });

  it('deve retornar IPA 0 quando todas notas são 0', () => {
    const resultado = calcularIPA(0, 0, 1.0, 1.0);
    expect(resultado.ipaBase).toBe(0);
    expect(resultado.ipaFinal).toBe(0);
    expect(resultado.status).toBe(StatusIpa.DESCARTE);
  });

  it('deve retornar IPA máximo (6.0) com notas 5, FI=1.0, FU=1.20', () => {
    // ipaBase = 0.5*5 + 0.5*5 = 5.0
    // ipaFinal = 5.0 * 1.0 * 1.2 = 6.0
    const resultado = calcularIPA(5, 5, 1.0, 1.2);
    expect(resultado.ipaBase).toBeCloseTo(5.0);
    expect(resultado.ipaFinal).toBeCloseTo(6.0);
    expect(resultado.status).toBe(StatusIpa.PRIORIDADE_ALTA);
  });

  it('deve retornar IPA 0 quando FI=0 (impedimento absoluto)', () => {
    const resultado = calcularIPA(5, 5, 0, 1.0);
    expect(resultado.ipaBase).toBeCloseTo(5.0);
    expect(resultado.ipaFinal).toBe(0);
    expect(resultado.status).toBe(StatusIpa.DESCARTE);
  });

  it('deve aplicar fator de urgência corretamente', () => {
    // ipaBase = 0.5*4 + 0.5*4 = 4.0
    // ipaFinal = 4.0 * 0.8 * 1.1 = 3.52
    const resultado = calcularIPA(4, 4, 0.8, 1.1);
    expect(resultado.ipaBase).toBeCloseTo(4.0);
    expect(resultado.ipaFinal).toBeCloseTo(3.52);
    expect(resultado.status).toBe(StatusIpa.BACKLOG);
  });
});

describe('classificarIPA', () => {
  it('deve classificar >= 4.0 como prioridade_alta', () => {
    expect(classificarIPA(4.0)).toBe(StatusIpa.PRIORIDADE_ALTA);
    expect(classificarIPA(5.5)).toBe(StatusIpa.PRIORIDADE_ALTA);
    expect(classificarIPA(6.0)).toBe(StatusIpa.PRIORIDADE_ALTA);
  });

  it('deve classificar 2.5 a 3.99 como backlog', () => {
    expect(classificarIPA(2.5)).toBe(StatusIpa.BACKLOG);
    expect(classificarIPA(3.0)).toBe(StatusIpa.BACKLOG);
    expect(classificarIPA(3.99)).toBe(StatusIpa.BACKLOG);
  });

  it('deve classificar < 2.5 como descarte', () => {
    expect(classificarIPA(0)).toBe(StatusIpa.DESCARTE);
    expect(classificarIPA(1.0)).toBe(StatusIpa.DESCARTE);
    expect(classificarIPA(2.49)).toBe(StatusIpa.DESCARTE);
  });
});
