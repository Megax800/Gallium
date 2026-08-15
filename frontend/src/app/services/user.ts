import { inject, Injectable } from '@angular/core';
import { UserLogin } from '../dto/userLogin';
import { HttpClient } from '@angular/common/http';
import { UserTokenId } from '../dto/userTokenId';

@Injectable({
  providedIn: 'root',
})
export class User {
  http = inject(HttpClient);
  getUser() {
    return this.http.get<UserLogin>(
      `http://localhost:3000/api/user/login/${localStorage.getItem('id')}`,
    );
  }
  getToken(email: string, passwd: string) {
    return this.http.post<UserTokenId>(`http://localhost:3000/api/user/auth/login/`, {
      passwd: passwd,
      email: email,
    });
  }
  signup(nickname: string, firstname: string, lastname: string, email: string, passwd: string) {
    return this.http.post<string>('http://localhost:3000/api/user/verify', {
      nickname: nickname,
      firstname: firstname,
      lastname: lastname,
      email: email,
      passwd: passwd,
    });
  }
}
