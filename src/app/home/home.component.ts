import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../services/language.service';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, RevealDirective],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  currentLang: string = 'sr';

  // capacityShare: upper daily capacity as a share of the largest model (1200 kg)
  readonly products = [
    { index: 1, fragment: 'griffon-70', image: '/images/gr50.png', capacityShare: 4 },
    { index: 2, fragment: 'griffon-150', image: '/images/gr150.png', capacityShare: 17 },
    { index: 3, fragment: 'griffon-250', image: '/images/gr250.png', capacityShare: 25 },
    { index: 4, fragment: 'griffon-500', image: '/images/gr500.png', capacityShare: 50 },
    { index: 5, fragment: 'griffon-1000', image: '/images/gr1000.png', capacityShare: 100 },
  ];

  // icon: SVG path data drawn on a 24x24 grid
  readonly benefits = [
    { index: 1, icon: 'M3 10l9-5 9 5v9H3zM8 19v-6h8v6' },
    { index: 2, icon: 'M4 7l6 6 4-4 6 7M20 12v4h-4' },
    {
      index: 3,
      icon: 'M2 7h11v9H2zM13 10h4l3 3v3h-7M6 15.7a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6zM16.5 15.7a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6z',
    },
    {
      index: 4,
      icon: 'M7 18a4 4 0 0 1-.5-8 5.5 5.5 0 0 1 10.6 1.2A3.5 3.5 0 0 1 17 18z',
    },
    {
      index: 5,
      icon: 'M7 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M12 4c-2 2.5 2 4.5 0 7s2 4.5 0 7M17 4c-2 2.5 2 4.5 0 7s2 4.5 0 7',
    },
    {
      index: 6,
      icon: 'M4.5 8h15A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-8A1.5 1.5 0 0 1 4.5 8zM9 8V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18',
    },
  ];

  constructor(private languageService: LanguageService) {}

  ngOnInit() {
    this.languageService.currentLang$.subscribe((lang) => {
      this.currentLang = lang;
    });
  }

  get industriesImage(): string {
    return this.currentLang === 'sr'
      ? '/images/industries-sr.jpg'
      : '/images/industries-en.jpg';
  }
}
