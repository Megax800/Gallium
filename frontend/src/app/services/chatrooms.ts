import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChatroomPreview } from '../dto/chatroomPreview';
import { ChatIdChatname } from '../dto/chatIdChatname';

@Injectable({
  providedIn: 'root',
})
export class Chatrooms {
  http = inject(HttpClient);
  getPreview(id: string) {
    return this.http.get<ChatroomPreview>(`http://localhost:3000/api/chatroom/preview/${id}`);
  }
  postChat(isGroup: boolean, id: string, mails: string[], chatname: string, description: string) {
    return this.http.post<ChatIdChatname>(
      'http://localhost:3000/api/chatroom/',
      isGroup
        ? {
            isGroup: isGroup,
            users: mails,
            admin: id,
            chatname: chatname,
            description: description,
          }
        : {
            isGroup: isGroup,
            users: mails,
          },
    );
  }
}
