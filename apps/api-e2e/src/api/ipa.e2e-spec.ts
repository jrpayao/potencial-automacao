import axios, { AxiosInstance } from 'axios';

/**
 * E2E tests for the full IPA flow:
 * - Login → Create processo → Create avaliacao → Verify IPA calculated → Dashboard ranking
 * - Tenant isolation: org A cannot see org B data
 */

const baseURL = `http://${process.env.HOST ?? 'localhost'}:${process.env.PORT ?? '3000'}`;

function createClient(): AxiosInstance {
  return axios.create({ baseURL });
}

describe('IPA Full Flow E2E', () => {
  let adminToken: string;
  let analistaToken: string;

  // IDs created during tests
  let processoId: number;
  let avaliacaoId: number;

  beforeAll(async () => {
    // Login as admin (superadmin) — from seed data
    const adminLogin = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@ipa.gov.br',
      senha: 'admin123',
    });
    adminToken = adminLogin.data.accessToken;

    // Login as analista — from seed data
    const analistaLogin = await axios.post(`${baseURL}/auth/login`, {
      email: 'analista@ipa.gov.br',
      senha: 'analista123',
    });
    analistaToken = analistaLogin.data.accessToken;
  });

  describe('Auth', () => {
    it('should login and return tokens', async () => {
      const res = await axios.post(`${baseURL}/auth/login`, {
        email: 'admin@ipa.gov.br',
        senha: 'admin123',
      });

      expect(res.status).toBe(200);
      expect(res.data.accessToken).toBeDefined();
      expect(res.data.refreshToken).toBeDefined();
      expect(res.data.usuario).toBeDefined();
      expect(res.data.usuario.email).toBe('admin@ipa.gov.br');
    });

    it('should reject invalid credentials', async () => {
      try {
        await axios.post(`${baseURL}/auth/login`, {
          email: 'admin@ipa.gov.br',
          senha: 'wrongpassword',
        });
        fail('Should have thrown');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });
  });

  describe('Processo CRUD', () => {
    it('should create a processo', async () => {
      const res = await axios.post(
        `${baseURL}/api/processos`,
        {
          nome: 'E2E Test - Processo Automação',
          area: 'TI',
          departamento: 'DTI',
          donoProcesso: 'E2E Tester',
          solicitante: 'E2E Runner',
          dataLevantamento: '2026-03-30',
        },
        { headers: { Authorization: `Bearer ${analistaToken}` } },
      );

      expect(res.status).toBe(201);
      expect(res.data.idProcesso).toBeDefined();
      expect(res.data.noProcesso).toBe('E2E Test - Processo Automação');
      expect(res.data.coSituacao).toBe('rascunho');
      processoId = res.data.idProcesso;
    });

    it('should list processos', async () => {
      const res = await axios.get(`${baseURL}/api/processos`, {
        headers: { Authorization: `Bearer ${analistaToken}` },
      });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.data)).toBe(true);
      expect(res.data.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Avaliacao CRUD + IPA Calculation', () => {
    it('should create an avaliacao with IPA calculated', async () => {
      const res = await axios.post(
        `${baseURL}/api/avaliacoes`,
        {
          processoId,

          // Dimensão Técnica
          notaSegurancaAcessos: 5,
          justifSegurancaAcessos: 'E2E test - alta segurança necessária',
          notaEstabilidadeLegado: 4,
          justifEstabilidadeLegado: 'E2E test - legado estável',
          notaEstruturacaoDados: 4,
          justifEstruturacaoDados: 'E2E test - dados bem estruturados',

          // Dimensão Negócio
          notaGestaoRisco: 5,
          justifGestaoRisco: 'E2E test - alto risco regulatório',
          notaReducaoSla: 4,
          notaAbrangencia: 5,
          notaExperienciaCidadao: 4,
          justifImpactoCidadao: 'E2E test - impacta cidadãos diretamente',
          notaVolumeMensal: 4,
          notaFteLiberado: 5,
          justifEficiencia: 'E2E test - liberaria 5 analistas',

          // Fatores
          fatorImpedimento: 1.0, // Nenhum
          justifImpedimento: 'E2E test - sem impedimentos',
          fatorUrgencia: 1.2, // Iminente
          justifUrgencia: 'E2E test - prazo iminente',

          // Riscos
          riscosContingencia: 'E2E test - contingência manual durante transição',
        },
        { headers: { Authorization: `Bearer ${analistaToken}` } },
      );

      expect(res.status).toBe(201);
      expect(res.data.idAvaliacao).toBeDefined();
      avaliacaoId = res.data.idAvaliacao;

      // Verify IPA was calculated
      expect(res.data.vrIndiceTecnico).toBeDefined();
      expect(res.data.vrIndiceNegocio).toBeDefined();
      expect(res.data.vrIpaBase).toBeDefined();
      expect(res.data.vrIpaFinal).toBeDefined();
      expect(res.data.coStatusIpa).toBeDefined();

      // IT = 5*0.4 + 4*0.3 + 4*0.3 = 2.0 + 1.2 + 1.2 = 4.4
      expect(Number(res.data.vrIndiceTecnico)).toBeCloseTo(4.4, 1);

      // IPA Final should be > 0
      expect(Number(res.data.vrIpaFinal)).toBeGreaterThan(0);

      // With high notes and iminente urgency, should be prioridade_alta
      expect(res.data.coStatusIpa).toBe('prioridade_alta');
    });

    it('should get avaliacao by id', async () => {
      const res = await axios.get(
        `${baseURL}/api/avaliacoes/${avaliacaoId}`,
        { headers: { Authorization: `Bearer ${analistaToken}` } },
      );

      expect(res.status).toBe(200);
      expect(res.data.idAvaliacao).toBe(avaliacaoId);
      expect(res.data.processo).toBeDefined();
      expect(res.data.processo.noProcesso).toBe('E2E Test - Processo Automação');
    });

    it('should reject duplicate avaliacao for same processo', async () => {
      try {
        await axios.post(
          `${baseURL}/api/avaliacoes`,
          {
            processoId,
            notaSegurancaAcessos: 3,
            justifSegurancaAcessos: 'Duplicate test',
            notaEstabilidadeLegado: 3,
            justifEstabilidadeLegado: 'Duplicate test',
            notaEstruturacaoDados: 3,
            justifEstruturacaoDados: 'Duplicate test',
            notaGestaoRisco: 3,
            justifGestaoRisco: 'Duplicate test',
            notaReducaoSla: 3,
            notaAbrangencia: 3,
            notaExperienciaCidadao: 3,
            justifImpactoCidadao: 'Duplicate test',
            notaVolumeMensal: 3,
            notaFteLiberado: 3,
            justifEficiencia: 'Duplicate test',
            fatorImpedimento: 1.0,
            justifImpedimento: 'Duplicate test',
            fatorUrgencia: 1.0,
            justifUrgencia: 'Duplicate test',
          },
          { headers: { Authorization: `Bearer ${analistaToken}` } },
        );
        fail('Should have thrown ConflictException');
      } catch (err: any) {
        expect(err.response.status).toBe(409);
      }
    });
  });

  describe('PDF Export', () => {
    it('should return a PDF for an avaliacao', async () => {
      const res = await axios.get(
        `${baseURL}/api/avaliacoes/${avaliacaoId}/pdf`,
        {
          headers: { Authorization: `Bearer ${analistaToken}` },
          responseType: 'arraybuffer',
        },
      );

      expect(res.status).toBe(200);
      expect(res.headers['content-type']).toBe('application/pdf');

      // PDF files start with %PDF
      const pdfHeader = Buffer.from(res.data).subarray(0, 5).toString('ascii');
      expect(pdfHeader).toBe('%PDF-');
    });

    it('should return 404 for non-existent avaliacao', async () => {
      try {
        await axios.get(`${baseURL}/api/avaliacoes/99999/pdf`, {
          headers: { Authorization: `Bearer ${analistaToken}` },
        });
        fail('Should have thrown');
      } catch (err: any) {
        expect(err.response.status).toBe(404);
      }
    });
  });

  describe('Dashboard', () => {
    it('should return ranking with pagination', async () => {
      const res = await axios.get(
        `${baseURL}/api/dashboard/ranking?page=1&limit=10`,
        { headers: { Authorization: `Bearer ${analistaToken}` } },
      );

      expect(res.status).toBe(200);
      expect(res.data.data).toBeDefined();
      expect(Array.isArray(res.data.data)).toBe(true);
      expect(res.data.total).toBeDefined();
      expect(res.data.page).toBe(1);
      expect(res.data.limit).toBe(10);
      expect(res.data.data.length).toBeGreaterThanOrEqual(1);

      // Ranking should be ordered by IPA Final DESC
      const ipaValues = res.data.data.map((item: any) => Number(item.vrIpaFinal));
      for (let i = 1; i < ipaValues.length; i++) {
        expect(ipaValues[i - 1]).toBeGreaterThanOrEqual(ipaValues[i]);
      }
    });

    it('should return resumo with counts', async () => {
      const res = await axios.get(`${baseURL}/api/dashboard/resumo`, {
        headers: { Authorization: `Bearer ${analistaToken}` },
      });

      expect(res.status).toBe(200);
      expect(res.data.total).toBeDefined();
      expect(typeof res.data.total).toBe('number');
      expect(res.data.total).toBeGreaterThanOrEqual(1);
      expect(typeof res.data.prioridadeAlta).toBe('number');
      expect(typeof res.data.backlog).toBe('number');
      expect(typeof res.data.descarte).toBe('number');

      // Sum of statuses should equal total
      expect(
        res.data.prioridadeAlta + res.data.backlog + res.data.descarte,
      ).toBe(res.data.total);
    });

    it('should reject unauthenticated requests', async () => {
      try {
        await axios.get(`${baseURL}/api/dashboard/ranking`);
        fail('Should have thrown');
      } catch (err: any) {
        expect(err.response.status).toBe(401);
      }
    });
  });

  describe('Tenant Isolation', () => {
    let orgBId: number;
    let orgBAnalistaToken: string;
    let orgBProcessoId: number;

    beforeAll(async () => {
      // Create a second organization (as superadmin)
      const orgRes = await axios.post(
        `${baseURL}/api/organizacoes`,
        { nome: 'E2E Org B', slug: 'e2e-org-b' },
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );
      orgBId = orgRes.data.idOrganizacao;

      // Create a user in org B (as superadmin)
      await axios.post(
        `${baseURL}/api/usuarios`,
        {
          nome: 'Analista Org B',
          email: 'analista-orgb@ipa.gov.br',
          senha: 'orgb123',
          perfil: 'analista',
          organizacaoId: orgBId,
        },
        { headers: { Authorization: `Bearer ${adminToken}` } },
      );

      // Login as org B analista
      const loginRes = await axios.post(`${baseURL}/auth/login`, {
        email: 'analista-orgb@ipa.gov.br',
        senha: 'orgb123',
      });
      orgBAnalistaToken = loginRes.data.accessToken;

      // Create a processo in org B
      const procRes = await axios.post(
        `${baseURL}/api/processos`,
        {
          nome: 'Org B - Processo Isolado',
          area: 'Org B Area',
          donoProcesso: 'Org B Owner',
          dataLevantamento: '2026-03-30',
        },
        { headers: { Authorization: `Bearer ${orgBAnalistaToken}` } },
      );
      orgBProcessoId = procRes.data.idProcesso;

      // Create avaliacao in org B
      await axios.post(
        `${baseURL}/api/avaliacoes`,
        {
          processoId: orgBProcessoId,
          notaSegurancaAcessos: 3,
          justifSegurancaAcessos: 'Org B test',
          notaEstabilidadeLegado: 3,
          justifEstabilidadeLegado: 'Org B test',
          notaEstruturacaoDados: 3,
          justifEstruturacaoDados: 'Org B test',
          notaGestaoRisco: 3,
          justifGestaoRisco: 'Org B test',
          notaReducaoSla: 3,
          notaAbrangencia: 3,
          notaExperienciaCidadao: 3,
          justifImpactoCidadao: 'Org B test',
          notaVolumeMensal: 3,
          notaFteLiberado: 3,
          justifEficiencia: 'Org B test',
          fatorImpedimento: 1.0,
          justifImpedimento: 'Org B test',
          fatorUrgencia: 1.0,
          justifUrgencia: 'Org B test',
        },
        { headers: { Authorization: `Bearer ${orgBAnalistaToken}` } },
      );
    });

    it('org A should NOT see org B processos', async () => {
      const res = await axios.get(`${baseURL}/api/processos`, {
        headers: { Authorization: `Bearer ${analistaToken}` },
      });

      const processNames = res.data.map((p: any) => p.noProcesso);
      expect(processNames).not.toContain('Org B - Processo Isolado');
    });

    it('org B should NOT see org A processos', async () => {
      const res = await axios.get(`${baseURL}/api/processos`, {
        headers: { Authorization: `Bearer ${orgBAnalistaToken}` },
      });

      const processNames = res.data.map((p: any) => p.noProcesso);
      expect(processNames).not.toContain('E2E Test - Processo Automação');
      expect(processNames).toContain('Org B - Processo Isolado');
    });

    it('org A dashboard should NOT include org B data', async () => {
      const res = await axios.get(
        `${baseURL}/api/dashboard/ranking?page=1&limit=100`,
        { headers: { Authorization: `Bearer ${analistaToken}` } },
      );

      const processNames = res.data.data.map((item: any) => item.noProcesso);
      expect(processNames).not.toContain('Org B - Processo Isolado');
    });

    it('org B dashboard should NOT include org A data', async () => {
      const res = await axios.get(
        `${baseURL}/api/dashboard/ranking?page=1&limit=100`,
        { headers: { Authorization: `Bearer ${orgBAnalistaToken}` } },
      );

      const processNames = res.data.data.map((item: any) => item.noProcesso);
      expect(processNames).toContain('Org B - Processo Isolado');
      expect(processNames).not.toContain('E2E Test - Processo Automação');
    });

    it('org A should NOT access org B avaliacao directly', async () => {
      // Get org B's avaliacao id via org B's dashboard
      const orgBRanking = await axios.get(
        `${baseURL}/api/dashboard/ranking?page=1&limit=100`,
        { headers: { Authorization: `Bearer ${orgBAnalistaToken}` } },
      );
      const orgBAvaliacaoId = orgBRanking.data.data[0]?.idAvaliacao;

      if (orgBAvaliacaoId) {
        try {
          await axios.get(`${baseURL}/api/avaliacoes/${orgBAvaliacaoId}`, {
            headers: { Authorization: `Bearer ${analistaToken}` },
          });
          fail('Org A should not access Org B avaliacao');
        } catch (err: any) {
          expect(err.response.status).toBe(404);
        }
      }
    });
  });
});
