import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslatorComponent } from './translator.component';
import { TranslationService, Language } from '../../services/translation.service';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TranslatorComponent', () => {
  let component: TranslatorComponent;
  let fixture: ComponentFixture<TranslatorComponent>;
  let translationService: jasmine.SpyObj<TranslationService>;

  const mockLanguages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('TranslationService', {
      getAvailableLanguages: of(mockLanguages),
      detectLanguage: of({ language: 'en', confidence: 0.95 }),
      translate: of({ translatedText: 'Hola mundo', detectedLanguage: 'en' })
    });

    await TestBed.configureTestingModule({
      imports: [
        TranslatorComponent,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: TranslationService, useValue: spy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TranslatorComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(TranslationService) as jasmine.SpyObj<TranslationService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load languages on init', () => {
    component.ngOnInit();
    expect(translationService.getAvailableLanguages).toHaveBeenCalled();
    expect(component.languages).toEqual(mockLanguages);
  });

  it('should handle language loading error', () => {
    translationService.getAvailableLanguages.and.returnValue(throwError(() => new Error('Failed to load languages')));
    component.ngOnInit();
    expect(component.error).toBe('Failed to load languages. Please try again later.');
  });

  it('should detect language when source text changes', () => {
    component.sourceText = 'Hello world';
    component.onSourceTextChange();
    
    expect(translationService.detectLanguage).toHaveBeenCalledWith('Hello world');
    expect(component.detectedLanguage).toBe('en');
    expect(component.confidence).toBe(0.95);
  });

  it('should not detect language for empty text', () => {
    component.sourceText = '';
    component.onSourceTextChange();
    
    expect(translationService.detectLanguage).not.toHaveBeenCalled();
    expect(component.detectedLanguage).toBe('');
    expect(component.confidence).toBe(0);
  });

  it('should translate text with auto-detection', () => {
    component.sourceText = 'Hello world';
    component.selectedSourceLanguage = 'auto';
    component.selectedTargetLanguage = 'es';
    component.translate();
    
    expect(translationService.translate).toHaveBeenCalledWith({
      text: 'Hello world',
      targetLanguage: 'es'
    });
    expect(component.translatedText).toBe('Hola mundo');
    expect(component.detectedLanguage).toBe('en');
  });

  it('should translate text with specified source language', () => {
    component.sourceText = 'Hello world';
    component.selectedSourceLanguage = 'en';
    component.selectedTargetLanguage = 'es';
    component.translate();
    
    expect(translationService.translate).toHaveBeenCalledWith({
      text: 'Hello world',
      sourceLanguage: 'en',
      targetLanguage: 'es'
    });
    expect(component.translatedText).toBe('Hola mundo');
  });

  it('should handle translation error', () => {
    translationService.translate.and.returnValue(throwError(() => new Error('Translation failed')));
    
    component.sourceText = 'Hello world';
    component.translate();
    
    expect(component.error).toBe('Translation failed. Please try again.');
  });

  it('should swap languages and texts', () => {
    component.selectedSourceLanguage = 'en';
    component.selectedTargetLanguage = 'es';
    component.sourceText = 'Hello';
    component.translatedText = 'Hola';
    
    component.swapLanguages();
    
    expect(component.selectedSourceLanguage).toBe('es');
    expect(component.selectedTargetLanguage).toBe('en');
    expect(component.sourceText).toBe('Hola');
    expect(component.translatedText).toBe('Hello');
  });

  it('should not swap languages when source is auto', () => {
    component.selectedSourceLanguage = 'auto';
    component.selectedTargetLanguage = 'es';
    component.sourceText = 'Hello';
    component.translatedText = 'Hola';
    
    component.swapLanguages();
    
    expect(component.selectedSourceLanguage).toBe('auto');
    expect(component.selectedTargetLanguage).toBe('es');
    expect(component.sourceText).toBe('Hello');
    expect(component.translatedText).toBe('Hola');
  });
});
