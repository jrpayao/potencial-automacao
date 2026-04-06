import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { ListaUsuariosComponent } from './lista-usuarios.component';
import { UsuariosService } from './usuarios.service';
import { of } from 'rxjs';
import { Perfil, SituacaoUsuario } from '@ipa/shared';

const mockUsuarios = [
  {
    id: 1,
    nome: 'João Silva',
    email: 'joao@org.gov.br',
    perfil: Perfil.ANALISTA,
    situacao: SituacaoUsuario.ATIVO,
    organizacaoId: 1,
  },
  {
    id: 2,
    nome: 'Maria Souza',
    email: 'maria@org.gov.br',
    perfil: Perfil.ADMIN,
    situacao: SituacaoUsuario.INATIVO,
    organizacaoId: 1,
  },
];

describe('ListaUsuariosComponent', () => {
  let usuariosServiceSpy: any;

  beforeEach(async () => {
    usuariosServiceSpy = {
      listar: () => of(mockUsuarios),
      criar: () => of(mockUsuarios[0]),
      atualizar: () => of(mockUsuarios[0]),
      alterarSituacao: () => of(mockUsuarios[0]),
    };

    await TestBed.configureTestingModule({
      imports: [ListaUsuariosComponent],
      providers: [
        provideHttpClient(),
        { provide: UsuariosService, useValue: usuariosServiceSpy },
      ],
    }).compileComponents();
  });

  it('deve criar o componente', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('deve carregar lista de usuarios ao inicializar', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.usuarios().length).toBe(2);
  });

  it('deve filtrar usuarios por nome', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('joão');
    expect(fixture.componentInstance.filteredUsuarios().length).toBe(1);
    expect(fixture.componentInstance.filteredUsuarios()[0].nome).toBe('João Silva');
  });

  it('deve filtrar usuarios por email', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('maria@');
    expect(fixture.componentInstance.filteredUsuarios().length).toBe(1);
    expect(fixture.componentInstance.filteredUsuarios()[0].email).toBe('maria@org.gov.br');
  });

  it('deve retornar todos quando busca esta vazia', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    fixture.componentInstance.onSearch('');
    expect(fixture.componentInstance.filteredUsuarios().length).toBe(2);
  });

  it('deve iniciar com carregando=true e terminar com false', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    expect(fixture.componentInstance.carregando()).toBe(true);
    fixture.detectChanges();
    expect(fixture.componentInstance.carregando()).toBe(false);
  });

  it('deve mostrar perfis disponiveis', () => {
    const fixture = TestBed.createComponent(ListaUsuariosComponent);
    fixture.detectChanges();
    expect(fixture.componentInstance.perfis).toContain(Perfil.ANALISTA);
    expect(fixture.componentInstance.perfis).toContain(Perfil.ADMIN);
  });
});
