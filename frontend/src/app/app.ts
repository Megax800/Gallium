import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Chatroom } from '../components/chatroom/chatroom';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Chatroom],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
