import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { IUsuario } from '@ipa/shared';
import { environment } from '../../../environments/environment';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: IUsuario;
}

const ACCESS_TOKEN_KEY = 'ipa_access_token';
const REFRESH_TOKEN_KEY = 'ipa_refresh_token';
const USER_KEY = 'ipa_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.apiUrl;
  private readonly router: Router;

  readonly isAuthenticated = signal<boolean>(this.hasValidToken());
  readonly currentUser = signal<IUsuario | null>(this.loadUser());

  readonly userPerfil = computed(() => this.currentUser()?.perfil ?? null);

  constructor(router: Router) {
    this.router = router;
  }

  async login(email: string, senha: string): Promise<void> {
    const response = await fetch(`${this.apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message ?? 'Credenciais invalidas');
    }

    const data: LoginResponse = await response.json();
    this.saveTokens({ accessToken: data.accessToken, refreshToken: data.refreshToken });
    this.saveUser(data.user);
    this.isAuthenticated.set(true);
    this.currentUser.set(data.user);
  }

  async refresh(): Promise<string | null> {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data: AuthTokens = await response.json();
      this.saveTokens(data);
      return data.accessToken;
    } catch {
      this.logout();
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.isAuthenticated.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private hasValidToken(): boolean {
    return !!localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  private loadUser(): IUsuario | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as IUsuario;
    } catch {
      return null;
    }
  }

  private saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  private saveUser(user: IUsuario): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.currentUser.set(user);
  }
}
