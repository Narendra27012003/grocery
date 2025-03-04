import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  imports: [CommonModule, FormsModule, RouterLink]
})
export class SignInComponent {
  username = '';
  password = '';

  constructor(private router: Router, private userService: UserService) {}

  onSignIn() {
    if (this.userService.validateUser(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      alert('Invalid credentials!');
    }
  }
}
