import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { ProductsComponent } from './products/products.component';
import { ContactComponent } from './contact/contact.component';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    HomeComponent,
    ProductsComponent,
    ContactComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ecoflow';
  currentLang = localStorage.getItem('lang') || 'sr';

  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
  ) {
    translate.addLangs(['en', 'sr']);
    translate.setDefaultLang('sr');
    translate.use(this.currentLang);

    this.languageService.setLang(this.currentLang); // inicijalizuj servis
  }

  toggleLang() {
    this.currentLang = this.currentLang === 'en' ? 'sr' : 'en';
    this.translate.use(this.currentLang);
    this.languageService.setLang(this.currentLang); // update servis
    localStorage.setItem('lang', this.currentLang);
  }
}
