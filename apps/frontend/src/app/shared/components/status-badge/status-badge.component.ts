import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="badge" [style.--badge-color]="config().color" [style.--badge-bg]="config().bg">
      @if (showDot()) {
        <span class="dot"></span>
      }
      {{ label() || config().label }}
    </span>
  `,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 12px;
      border-radius: 99px;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--badge-color, #64748b);
      background-color: var(--badge-bg, #f1f5f9);
      white-space: nowrap;
      transition: all 0.2s;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: currentColor;
    }
  `
})
export class StatusBadgeComponent {
  status = input.required<string>();
  label = input<string>();
  showDot = input<boolean>(true);

  config = computed(() => {
    const s = this.status().toLowerCase();
    switch (s) {
      // Status de Processos/Avaliações
      case 'rascunho': return { label: 'Rascunho', color: '#64748b', bg: '#f1f5f9' };
      case 'avaliado': return { label: 'Avaliado', color: '#166534', bg: '#dcfce7' };
      case 'arquivado': return { label: 'Arquivado', color: '#991b1b', bg: '#fee2e2' };
      
      // Status de Atividade (Usuários/Orgs)
      case 'a':
      case 'ativo': return { label: 'Ativo', color: '#166534', bg: '#dcfce7' };
      case 'i':
      case 'inativo': return { label: 'Inativo', color: '#991b1b', bg: '#fee2e2' };
      
      // Perfis
      case 'superadmin': return { label: 'Superadmin', color: '#7e22ce', bg: '#f3e8ff' };
      case 'admin': return { label: 'Admin', color: '#1d4ed8', bg: '#dbeafe' };
      case 'analista': return { label: 'Analista', color: '#047857', bg: '#d1fae5' };
      case 'visualizador': return { label: 'Visualizador', color: '#475569', bg: '#f1f5f9' };

      default: return { label: s, color: '#64748b', bg: '#f1f5f9' };
    }
  });
}
