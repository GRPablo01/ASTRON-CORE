import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ApiHealthService } from './core/services/api-health.service';

type ApiStatus = 'loading' | 'online' | 'offline';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly apiHealth = inject(ApiHealthService);

  protected readonly apiStatus = signal<ApiStatus>('loading');
  protected readonly serviceName = signal('ASTRON CORE API');
  protected readonly lastChecked = signal<string | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  constructor() {
    this.checkApi();
  }

  protected checkApi(): void {
    this.apiStatus.set('loading');
    this.errorMessage.set(null);

    this.apiHealth.check().subscribe({
      next: (response) => {
        this.apiStatus.set(response.success && response.data.status === 'ok' ? 'online' : 'offline');
        this.serviceName.set(response.data.service);
        this.lastChecked.set(new Date().toLocaleTimeString('fr-FR'));
      },
      error: (error: HttpErrorResponse) => {
        this.apiStatus.set('offline');
        this.errorMessage.set(
          error.status
            ? `L’API a répondu avec le statut HTTP ${error.status}.`
            : 'Impossible de joindre l’API. Vérifie que le serveur backend est démarré.',
        );
        this.lastChecked.set(new Date().toLocaleTimeString('fr-FR'));
      },
    });
  }
}
