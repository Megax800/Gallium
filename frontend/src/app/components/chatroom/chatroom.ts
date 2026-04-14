import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { catchError } from 'rxjs';
import { User } from '../../services/user';
import { Chatrooms } from '../../services/chatrooms';
import { UserLogin } from '../../dto/userLogin';
import { ChatroomPreview } from '../../dto/chatroomPreview';
import { MessagesLastN } from '../../dto/messagesLastN';
import { Messages } from '../../services/messages';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-chatroom',
  imports: [ReactiveFormsModule],
  templateUrl: './chatroom.html',
  styleUrl: './chatroom.css',
})
export class Chatroom implements OnInit {
  @Input() id!: string;
  userService = inject(User);
  chatroomService = inject(Chatrooms);
  messageService = inject(Messages);
  user = signal<UserLogin | null>(null);
  chatrooms = signal<Array<ChatroomPreview>>([]);
  messages = signal<Array<MessagesLastN>>([]);
  chatName = signal('');
  chatId = signal('');
  messageControl = new FormControl('', [(Validators.required, Validators.pattern(/^(?!\s*$).+/))]);
  clear() {
    this.messageControl.setValue('');
  }
  sendMessage() {
    this.messageService
      .postMessage(this.messageControl.value!.trim(), this.user()!.id, this.chatId())
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((message) => {
        this.messages.update((arr) => [message, ...arr]);
      });
    this.clear();
  }
  getMessages(id: string, n: number) {
    this.messageService
      .getNMessages(id, n)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((messages) => {
        this.messages.set(messages);
      });
  }
  getChatrooms(id: string) {
    if (!this.chatrooms().some((chat) => chat.id === id)) {
      this.chatroomService
        .getPreview(id)
        .pipe(
          catchError((err) => {
            console.log(err);
            throw err;
          }),
        )
        .subscribe((chat) => {
          this.chatrooms.update((arr) => [...arr, chat]);
        });
    }
    this.chatName.set(id); //cambiarlo a chatname
    this.chatId.set(id);
    this.getMessages(id, 25);
  }
  getuser() {
    this.userService
      .getUser(this.id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((user) => {
        this.user.set(user);
      });
  }
  ngOnInit(): void {
    this.getuser();
  }
}
