import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements AfterViewInit {
  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  ngAfterViewInit(): void {
    this.route.fragment.subscribe((fragment) => {
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) {
            const navbarOffset = 80;
            const elementPosition = el.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.scrollY - navbarOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth',
            });
          }
        }, 50);
      }
    });
  }
}
