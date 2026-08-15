import { Routes } from '@angular/router';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { Chatroom } from './components/chatroom/chatroom';
import { authGuard } from './guards/authGuard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'signup', component: Signup },
  { path: 'chatroom', component: Chatroom, canActivate: [authGuard] },
  { path: '**', component: Home },
];
