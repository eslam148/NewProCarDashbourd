import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="home-container">
      <h2>Welcome to the New Layout</h2>
      <p>This is the home page of our new layout.</p>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 2rem;
    }
    h2 {
      color: #2c3e50;
      margin-bottom: 1rem;
    }
    p {
      color: #666;
      font-size: 1.1rem;
    }
  `]
})
export class HomeComponent {}
