import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private langSubject = new BehaviorSubject<string>('sr');
  currentLang$ = this.langSubject.asObservable();

  setLang(lang: string) {
    this.langSubject.next(lang);
  }
}
