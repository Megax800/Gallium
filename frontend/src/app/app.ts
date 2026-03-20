import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chatroom } from './components/chatroom/chatroom';
import { Home } from './components/home/home';
import { Login } from './components/login/login';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('frontend');
}
