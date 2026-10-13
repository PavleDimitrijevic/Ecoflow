import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements AfterViewInit {
  readonly products = [
    { index: 1, id: 'griffon-70', code: 'G-70', image: '/images/gr50.png' },
    { index: 2, id: 'griffon-150', code: 'G-150', image: '/images/gr150.1.png' },
    { index: 3, id: 'griffon-250', code: 'G-250', image: '/images/gr250.png' },
    { index: 4, id: 'griffon-500', code: 'G-500', image: '/images/gr500.png' },
    { index: 5, id: 'griffon-1000', code: 'G-1000', image: '/images/gr1000.png' },
  ];
  readonly featureNumbers = [1, 2, 3, 4, 5];

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
            const navbarOffset = 96;
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
