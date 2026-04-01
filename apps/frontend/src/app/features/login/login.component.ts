import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="login-container">
      <mat-card class="login-card">
        <mat-card-header>
          <mat-card-title class="login-title">Sistema IPA</mat-card-title>
          <mat-card-subtitle>Indice de Potencial de Automacao</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="form" (ngSubmit)="onSubmit()">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>E-mail</mat-label>
              <input matInput type="email" formControlName="email" placeholder="seu@email.gov.br" />
              <mat-icon matPrefix>email</mat-icon>
              @if (emailControl.hasError('required') && emailControl.touched) {
                <mat-error>E-mail e obrigatorio</mat-error>
              }
              @if (emailControl.hasError('email') && !emailControl.hasError('required')) {
                <mat-error>Formato de e-mail invalido</mat-error>
              }
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Senha</mat-label>
              <input
                matInput
                [type]="hidePassword() ? 'password' : 'text'"
                formControlName="senha"
                placeholder="Sua senha"
              />
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix type="button" (click)="hidePassword.set(!hidePassword())">
                <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              @if (senhaControl.hasError('required') && senhaControl.touched) {
                <mat-error>Senha e obrigatoria</mat-error>
              }
            </mat-form-field>

            @if (errorMessage()) {
              <div class="error-banner">
                <mat-icon>error</mat-icon>
                <span>{{ errorMessage() }}</span>
              </div>
            }

            <button
              mat-flat-button
              color="primary"
              class="full-width login-button"
              type="submit"
              [disabled]="loading()"
            >
              @if (loading()) {
                <mat-spinner diameter="20"></mat-spinner>
              } @else {
                Entrar
              }
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: `
    .login-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #003461 0%, #000033 100%);
      padding: 16px;
    }

    .login-card {
      width: 100%;
      max-width: 420px;
      padding: 32px;
    }

    .login-title {
      font-size: 24px;
      font-weight: 700;
      color: #003461;
    }

    mat-card-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 24px;
    }

    mat-card-content {
      display: flex;
      flex-direction: column;
    }

    .full-width {
      width: 100%;
    }

    mat-form-field {
      margin-bottom: 8px;
    }

    .login-button {
      margin-top: 16px;
      height: 48px;
      font-size: 16px;
      font-weight: 600;
    }

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background-color: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 8px;
      color: #ef4444;
      font-size: 14px;
      margin-bottom: 8px;
    }

    .error-banner mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
  `,
})
export class LoginComponent {
  readonly form: FormGroup<{ email: FormControl<string>; senha: FormControl<string> }>;
  readonly emailControl: FormControl<string>;
  readonly senhaControl: FormControl<string>;
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly hidePassword = signal(true);

  private readonly authService: AuthService;
  private readonly router: Router;

  constructor(fb: FormBuilder, authService: AuthService, router: Router) {
    this.authService = authService;
    this.router = router;
    this.form = fb.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required]],
    });
    this.emailControl = this.form.controls.email;
    this.senhaControl = this.form.controls.senha;
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.errorMessage.set(null);

    const { email, senha } = this.form.getRawValue();

    try {
      await this.authService.login(email, senha);
      await this.router.navigate(['/admin/dashboard']);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login';
      this.errorMessage.set(message);
    } finally {
      this.loading.set(false);
    }
  }
}
