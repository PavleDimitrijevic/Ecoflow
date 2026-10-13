import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  private readonly router = inject(Router);
  isScrolled: boolean = false;
  isMenuOpen: boolean = false;

  // --------------------------
  // Za jezik
  // --------------------------
  @Input() currentLang!: string;
  @Output() langToggle = new EventEmitter<void>();

  onToggleLang() {
    this.langToggle.emit();
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.closeMenu());
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 8;
  }

  @HostListener('document:keydown.escape', [])
  onEscape() {
    this.closeMenu();
  }
}
