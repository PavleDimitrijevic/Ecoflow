import {
  Component,
  HostListener,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  inject,
} from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, TranslateModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit {
  private readonly router = inject(Router);
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

  constructor() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => {
        setTimeout(() => this.updateHeaderHeight());
      });
  }

  ngAfterViewInit() {
    this.updateHeaderHeight();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isSticky =
      this.headerHeight > 1
        ? window.scrollY >= this.headerHeight
        : window.scrollY > 0;
  }

  private updateHeaderHeight() {
    const header = document.querySelector('.home__header') as HTMLElement | null;
    this.headerHeight = header?.offsetHeight ?? 1;
    this.onWindowScroll();
  }
}
