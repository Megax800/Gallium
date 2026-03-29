import { Component, inject, OnInit, signal } from '@angular/core';
import { Chatrooms } from '../../services/chatrooms';
import { catchError } from 'rxjs';
import { ChatroomType } from '../../model/chatroomType';
import { NestedMessageType } from '../../model/nestedMessageType';

@Component({
  selector: 'app-chatroom',
  imports: [],
  templateUrl: './chatroom.html',
  styleUrl: './chatroom.css',
})
export class Chatroom implements OnInit {
  chatroomService = inject(Chatrooms);
  chatrooms = signal<Array<ChatroomType>>([]);
  messages = signal<Array<NestedMessageType>>([]);
  getMessages(chat: ChatroomType) {
    this.messages.set(chat.messages);
  }
  ngOnInit(): void {
    this.chatroomService
      .getChatrooms()
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((chatrooms) => {
        this.chatrooms.set(chatrooms);
      });
  }
}
