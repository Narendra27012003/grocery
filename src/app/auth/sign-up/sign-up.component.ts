import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  imports: [CommonModule, FormsModule]
})
export class SignUpComponent {
  username = '';
  password = '';
  confirmPassword = '';

  constructor(private router: Router) {}

  onSignUp() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    // Since the JSON file is static, no user is added.
    // Simply alert success and navigate back to the sign-in page.
    alert('Sign Up successful! Please sign in using the credentials from the JSON file.');
    this.router.navigate(['/']);
  }
}
