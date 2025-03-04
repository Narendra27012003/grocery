import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet, CommonModule]
})
export class AppComponent {}
