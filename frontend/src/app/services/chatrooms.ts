import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChatroomType } from '../model/chatroomType';

@Injectable({
  providedIn: 'root',
})
export class Chatrooms {
  http = inject(HttpClient);
  getChatrooms() {
    return this.http.get<Array<ChatroomType>>('http://localhost:3000/api/chatroom');
  }
}
