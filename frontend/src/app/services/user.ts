import { inject, Injectable } from '@angular/core';
import { UserLogin } from '../dto/userLogin';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class User {
  http = inject(HttpClient);
  getUser(id: string) {
    return this.http.get<UserLogin>(`http://localhost:3000/api/user/login/${id}`); //Cambiar para encontrar el usuario con mail y contraseña en lugar de id
  }
}
