import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, timeout } from 'rxjs';

export interface ApiHealthResponse {
  success: boolean;
  data: {
    status: string;
    service: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class ApiHealthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://127.0.0.1:3000/api/health';

  check(): Observable<ApiHealthResponse> {
    return this.http.get<ApiHealthResponse>(this.apiUrl).pipe(
      timeout(5000),
    );
  }
}
