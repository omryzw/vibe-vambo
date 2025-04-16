import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage?: string;
  targetLanguage: string;
}

export interface TranslationResponse {
  translatedText: string;
  detectedLanguage?: string;
  confidence?: number;
}

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your actual API URL

  constructor(private http: HttpClient) { }

  getAvailableLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`${this.apiUrl}/languages`);
  }

  detectLanguage(text: string): Observable<{ language: string; confidence: number }> {
    return this.http.post<{ language: string; confidence: number }>(`${this.apiUrl}/detect`, { text });
  }

  translate(request: TranslationRequest): Observable<TranslationResponse> {
    return this.http.post<TranslationResponse>(`${this.apiUrl}/translate`, request);
  }
}
