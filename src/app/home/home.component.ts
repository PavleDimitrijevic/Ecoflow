import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentLang: string = 'sr';

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  get technologyImage(): string {
    return this.currentLang === 'sr'
      ? '/images/technology3.png'
      : '/images/technology2.png';
  }
}
