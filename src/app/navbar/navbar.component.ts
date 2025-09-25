import { Component, HostListener, ElementRef } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  isSticky: boolean = false;

  headerHeight: number = 1;

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
