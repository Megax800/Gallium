import { Injectable, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { MessagesLastN } from '../dto/messagesLastN';
import { Observable, Subject } from 'rxjs';
import { UserIdNickname } from '../dto/userIdNickname';
import { UsersIdNicknameRoom } from '../dto/usersIdNicknameRoom';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  socket: Socket;
  messageSubject = new Subject<MessagesLastN>();
  deletedMessageSubject = new Subject<string>();
  deletedUserSubject = new Subject<UsersIdNicknameRoom>();
  room = signal('');
  constructor() {
    this.socket = io('http://localhost:3000', {
      auth: {
        token: localStorage.getItem('token'),
      },
    });
    this.socket.on('connect', () => {
      console.log('connected');
    });
    this.socket.on('receiveMessage', (message) => {
      this.messageSubject.next(message);
    });
    this.socket.on('messageDeleted', (id) => {
      this.deletedMessageSubject.next(id);
    });
    this.socket.on('userDeleted', (allUsers) => {
      this.deletedUserSubject.next(allUsers);
    });
  }
  userDeleted(): Observable<UsersIdNicknameRoom> {
    return this.deletedUserSubject.asObservable();
  }
  receiveMessage(): Observable<MessagesLastN> {
    return this.messageSubject.asObservable();
  }
  messageDeleted(): Observable<string> {
    return this.deletedMessageSubject.asObservable();
  }
  deleteUser(allUsers: UserIdNickname[]) {
    this.socket.emit('deleteUser', allUsers, this.room());
  }
  deleteMessage(id: string) {
    this.socket.emit('deleteMessage', id, this.room());
  }
  sendMessage(message: MessagesLastN) {
    this.socket.emit('sendMessage', message, this.room());
  }
  joinChat(id: string) {
    if (this.room()) {
      this.socket.emit('leaveChat', this.room());
    }
    this.socket.emit('joinChat', id);
    this.room.set(id);
  }
}
