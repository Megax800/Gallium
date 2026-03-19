import { Component, inject, OnInit, signal } from '@angular/core';
import { Chatrooms } from '../../services/chatrooms';
import { catchError } from 'rxjs';
import { ChatroomType } from '../../model/chatroomType';

@Component({
  selector: 'app-chatroom',
  imports: [],
  templateUrl: './chatroom.html',
  styleUrl: './chatroom.css',
})
export class Chatroom implements OnInit {
  chatroomService = inject(Chatrooms);
  chatrooms = signal<Array<ChatroomType>>([]);
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
