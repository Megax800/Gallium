import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ChatroomPreview } from '../dto/chatroomPreview';
import { ChatIdChatname } from '../dto/chatIdChatname';
import { UserIdNickname } from '../dto/userIdNickname';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Chatrooms {
  http = inject(HttpClient);
  getPreview(id: string) {
    return this.http.get<ChatroomPreview>(`${environment.apiUrl}/api/chatroom/preview/${id}`);
  }
  postChat(isGroup: boolean, id: string, mails: string[], chatname: string, description: string) {
    return this.http.post<ChatIdChatname>(
      `${environment.apiUrl}/api/chatroom/`,
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
  patchChatname(id: string, chatname: string) {
    return this.http.patch<string>(`${environment.apiUrl}/api/chatroom/chatname/${id}`, {
      chatname: chatname,
    });
  }
  addUsers(id: string, users: string[]) {
    return this.http.patch<UserIdNickname[]>(`${environment.apiUrl}/api/chatroom/addUsers/${id}`, {
      users: users,
    });
  }
  removeUsers(id: string, users: string[]) {
    return this.http.patch<UserIdNickname[]>(
      `${environment.apiUrl}/api/chatroom/removeUser/${id}`,
      {
        users: users,
      },
    );
  }
  deleteChat(id: string) {
    return this.http.delete(`${environment.apiUrl}/api/chatroom/${id}`);
  }
}
