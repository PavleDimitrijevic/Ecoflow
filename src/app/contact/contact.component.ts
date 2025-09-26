import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  ngOnInit(): void {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }
}
