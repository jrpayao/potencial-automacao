import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ListaOrganizacoesComponent } from './lista-organizacoes.component';
import { OrganizacoesService } from './organizacoes.service';
import { of } from 'rxjs';

const mockOrgs = [
  { id: 1, nome: 'Secretaria do Tesouro', slug: 'stn', situacao: 'A', criadoEm: '2026-01-01' },
  { id: 2, nome: 'Polícia Federal', slug: 'pf', situacao: 'I', criadoEm: '2026-01-02' },
];

describe('ListaOrganizacoesComponent', () => {
  let orgServiceSpy: any;

  beforeEach(async () => {
    orgServiceSpy = {
      listar: () => of(mockOrgs),
      criar: () => of(mockOrgs[0]),
      atualizar: () => of(mockOrgs[0]),
      arquivar: () => of(undefined),
      ativar: () => of(mockOrgs[0]),
    };

    await TestBed.configureTestingModule({
      imports: [ListaOrganizacoesComponent],
      providers: [
        provideHttpClient(),
        { provide: OrganizacoesService, useValue: orgServiceSpy },
      ],
    }).compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve carregar lista ao inicializar', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.organizacoes().length).toBe(2);
  });

  it('deve filtrar organizacoes por nome', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('tesouro');
    expect(fixture.componentInstance.filteredOrganizacoes().length).toBe(1);
    expect(fixture.componentInstance.filteredOrganizacoes()[0].nome).toBe('Secretaria do Tesouro');
  });

  it('deve filtrar organizacoes por slug', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('pf');
    expect(fixture.componentInstance.filteredOrganizacoes().length).toBe(1);
    expect(fixture.componentInstance.filteredOrganizacoes()[0].slug).toBe('pf');
  });

  it('deve retornar todos quando busca esta vazia', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('');
    expect(fixture.componentInstance.filteredOrganizacoes().length).toBe(2);
  });

  it('deve iniciar com carregando=true e terminar com false', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    expect(fixture.componentInstance.carregando()).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.carregando()).toBe(false);
  });

  it('deve arquivar organizacao atualizando situacao localmente', () => {
    const fixture = TestBed.createComponent(ListaOrganizacoesComponent);
    fixture.detectChanges();
    fixture.componentInstance.arquivar(1);
    const org = fixture.componentInstance.organizacoes().find((o) => o.id === 1);
    expect(org?.situacao).toBe('I');
  });
});
