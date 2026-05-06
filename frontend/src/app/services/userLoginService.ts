import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  userId = signal('');

  login(userId: string) {
    this.userId.set(userId);
  }
  logout() {
    this.userId.set('');
  }
}
