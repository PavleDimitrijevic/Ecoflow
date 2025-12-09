// src/app/translate-loader.factory.ts
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private prefix: string = '/i18n/',
    private suffix: string = '.json'
  ) {}

  getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}

// factory funkcija koju koristiš u TranslateModule.forRoot(...)
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http, '/i18n/', '.json');
}
