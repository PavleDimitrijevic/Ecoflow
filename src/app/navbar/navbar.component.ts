import {
  Component,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isSticky: boolean = false;
  headerHeight: number = 1;

  // --------------------------
  // Za jezik
  // --------------------------
  @Input() currentLang!: string;
  @Output() langToggle = new EventEmitter<void>();

  onToggleLang() {
    this.langToggle.emit();
  }

  get langClass() {
    return this.currentLang === 'en' ? 'lang-en' : 'lang-sr';
  }

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const header = document.querySelector('.home__header') as HTMLElement;
    if (header) {
      this.headerHeight = header.offsetHeight;
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky = window.scrollY >= this.headerHeight;
  }
}
