import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000', {
      // Your backend URL
      auth: {
        userId: '69c939906535a62b46204c19' /*localStorage.getItem('access_token')*/,
      },
    });
  }

  // Send a message to the server
  sendMessage(msg: string, dest: string) {
    this.socket.emit('message', msg, dest);
  }

  // Joins chats from user
  joinChats(chats: string[]) {
    this.socket.emit('join', chats);
  }

  // Listen for messages from the server
  getMessage() {
    return new Observable((observer) => {
      this.socket.on('message', (data) => {
        observer.next(data);
      });
    });
  }
  onMessage(callback: (message: string) => void): void {
    this.socket.on('message', callback);
  }
}
