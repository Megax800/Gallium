import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { MessagesLastN } from '../dto/messagesLastN';

@Injectable({
  providedIn: 'root',
})
export class Messages {
  http = inject(HttpClient);
  getNMessages(id: string, n: number) {
    return this.http.get<Array<MessagesLastN>>(`http://localhost:3000/api/message/chat/${id}/${n}`);
  }
  postMessage(body: string, sender: string, receiver: string) {
    return this.http.post<MessagesLastN>('http://localhost:3000/api/message/', {
      body: body,
      sender: sender,
      receiver: receiver,
    });
  }
  deleteMessage(id: string) {
    return this.http.delete(`http://localhost:3000/api/message/${id}`);
  }
}
