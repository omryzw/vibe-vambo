import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TranslationResult {
  translatedText: string;
  detectedLanguage: string;
}

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  translate(text: string, sourceLanguage: string, targetLanguage: string): Promise<TranslationResult> {
    return this.http.post<TranslationResult>(`${this.apiUrl}/translate`, {
      sourceText: text,
      sourceLanguageCode: sourceLanguage,
      targetLanguageCode: targetLanguage
    }).toPromise();
  }
} 