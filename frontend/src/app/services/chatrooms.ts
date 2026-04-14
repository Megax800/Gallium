import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChatroomPreview } from '../dto/chatroomPreview';

@Injectable({
  providedIn: 'root',
})
export class Chatrooms {
  http = inject(HttpClient);
  getPreview(id: string) {
    return this.http.get<ChatroomPreview>(`http://localhost:3000/api/chatroom/preview/${id}`);
  }
}
