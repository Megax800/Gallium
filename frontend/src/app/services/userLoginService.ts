import { inject, Injectable, signal } from '@angular/core';
import { User } from './user';
import { catchError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserLoginService {
  userService = inject(User);
  router = inject(Router);
  login(email: string, passwd: string) {
    this.userService
      .getToken(email, passwd)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((user) => {
        localStorage.setItem('token', user.token);
        localStorage.setItem('id', user.id);
        this.router.navigate(['/chatroom']);
      });
  }
  isLogged() {
    return !!localStorage.getItem('token');
  }
  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('id', '');
  }
}
