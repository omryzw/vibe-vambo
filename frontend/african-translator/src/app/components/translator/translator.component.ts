import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslationService, Language, TranslationRequest, TranslationResponse } from '../../services/translation.service';

@Component({
  selector: 'app-translator',
  templateUrl: './translator.component.html',
  styleUrls: ['./translator.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TranslatorComponent implements OnInit {
  languages: Language[] = [];
  sourceText: string = '';
  translatedText: string = '';
  selectedSourceLanguage: string = 'auto';
  selectedTargetLanguage: string = 'en';
  detectedLanguage: string = '';
  confidence: number = 0;
  isLoading: boolean = false;
  error: string = '';

  constructor(private translationService: TranslationService) { }

  ngOnInit(): void {
    this.loadLanguages();
  }

  loadLanguages(): void {
    this.translationService.getAvailableLanguages().subscribe({
      next: (languages) => {
        this.languages = languages;
      },
      error: (error) => {
        this.error = 'Failed to load languages. Please try again later.';
        console.error('Error loading languages:', error);
      }
    });
  }

  onSourceTextChange(): void {
    if (this.sourceText.trim()) {
      this.detectLanguage();
    } else {
      this.detectedLanguage = '';
      this.confidence = 0;
    }
  }

  detectLanguage(): void {
    this.isLoading = true;
    this.translationService.detectLanguage(this.sourceText).subscribe({
      next: (result) => {
        this.detectedLanguage = result.language;
        this.confidence = result.confidence;
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Failed to detect language. Please try again.';
        this.isLoading = false;
        console.error('Error detecting language:', error);
      }
    });
  }

  translate(): void {
    if (!this.sourceText.trim()) {
      this.translatedText = '';
      return;
    }

    this.isLoading = true;
    this.error = '';

    const request: TranslationRequest = {
      text: this.sourceText,
      targetLanguage: this.selectedTargetLanguage
    };

    if (this.selectedSourceLanguage !== 'auto') {
      request.sourceLanguage = this.selectedSourceLanguage;
    }

    this.translationService.translate(request).subscribe({
      next: (response: TranslationResponse) => {
        this.translatedText = response.translatedText;
        if (response.detectedLanguage) {
          this.detectedLanguage = response.detectedLanguage;
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.error = 'Translation failed. Please try again.';
        this.isLoading = false;
        console.error('Translation error:', error);
      }
    });
  }

  swapLanguages(): void {
    if (this.selectedSourceLanguage === 'auto') return;
    
    const tempLang = this.selectedSourceLanguage;
    this.selectedSourceLanguage = this.selectedTargetLanguage;
    this.selectedTargetLanguage = tempLang;
    
    const tempText = this.sourceText;
    this.sourceText = this.translatedText;
    this.translatedText = tempText;
    
    this.translate();
  }
}
