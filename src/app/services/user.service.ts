import { Injectable } from '@angular/core';

export interface User {
  username: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private users: User[] = []; // In-memory user list from JSON

  constructor() {
    this.loadUsersFromJson();
  }

  // Fetch users from JSON file (in the public folder)
  private loadUsersFromJson(): void {
    fetch('/users.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load users.json');
        }
        return response.json();
      })
      .then(data => {
        this.users = data.users || [];
      })
      .catch(error => {
        console.error('Error loading users:', error);
      });
  }

  // Validate user credentials against the loaded JSON users.
  validateUser(username: string, password: string): boolean {
    return this.users.some(u => u.username === username && u.password === password);
  }
}
