import {
  afterEveryRender,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  Input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { catchError } from 'rxjs';
import { User } from '../../services/user';
import { Chatrooms } from '../../services/chatrooms';
import { UserLogin } from '../../dto/userLogin';
import { ChatroomPreview } from '../../dto/chatroomPreview';
import { MessagesLastN } from '../../dto/messagesLastN';
import { Messages } from '../../services/messages';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatIdChatname } from '../../dto/chatIdChatname';

@Component({
  selector: 'app-chatroom',
  imports: [ReactiveFormsModule],
  templateUrl: './chatroom.html',
  styleUrl: './chatroom.css',
})
export class Chatroom implements OnInit {
  @Input() id!: string;
  myMessages = viewChild<ElementRef<HTMLUListElement>>('myMessages');
  sendInput = viewChild<ElementRef<HTMLInputElement>>('sendInput');
  userService = inject(User);
  chatroomService = inject(Chatrooms);
  messageService = inject(Messages);
  user = signal<UserLogin | null>(null);
  filteredChatrooms = computed<Array<ChatIdChatname>>(() => {
    return (
      this.user()?.chatrooms.filter((chat) =>
        chat.chatname.toLowerCase().includes(this.chatFilter().toLowerCase()),
      ) ?? []
    );
  });
  chatFilter = signal('');
  chatrooms = signal<Array<ChatroomPreview>>([]);
  messages = signal<Array<MessagesLastN>>([]);
  chatName = signal('');
  currentChat = signal<ChatroomPreview | null>(null);
  usersMail = signal<Array<string>>([]);
  lastUserId = '';
  lastDay = '';
  mailControl = new FormControl('', [Validators.required, Validators.email]);
  chatnameControl = new FormControl('', [Validators.required, Validators.pattern(/.*\S.*/)]);
  descriptionControl = new FormControl('', Validators.pattern(/.*\S.*/));
  messageControl = new FormControl('', [Validators.required, Validators.pattern(/.*\S.*/)]);
  constructor() {
    effect(() => {
      this.inputFocus();
    });
    afterEveryRender(() => {
      if (this.messages().length) {
        const ul = this.myMessages()?.nativeElement;
        ul!.scrollTop = ul!.scrollHeight;
      }
    });
  }
  inputFocus() {
    this.sendInput()?.nativeElement.focus();
  }
  differentUser(id: string) {
    this.lastUserId = id;
    return this.currentChat()?.users?.find((user) => user.id === id)?.nickname;
  }
  differentDay(date: string) {
    this.lastDay = date;
    return this.lastDay;
  }
  clear(control: FormControl) {
    control.setValue('');
  }
  createChatroom() {
    const isGroup = this.usersMail().length > 1;
    this.usersMail.update((arr) => [this.user()?.email!, ...arr]);
    this.chatroomService
      .postChat(
        isGroup,
        this.user()?.id!,
        this.usersMail(),
        this.chatnameControl.value!.trim(),
        this.descriptionControl.value!.trim(),
      )
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((chat) => {
        this.user.update((arr) => ({ ...arr!, chatrooms: [...arr?.chatrooms!, chat] }));
      });
    this.clear(this.mailControl);
    this.clear(this.chatnameControl);
    this.clear(this.descriptionControl);
    this.usersMail.set([]);
  }
  removeUserMail(mail: string) {
    this.usersMail.update((arr) => arr.filter((user) => user !== mail));
  }
  addUserMail() {
    if (!this.usersMail().includes(this.mailControl.value!)) {
      this.usersMail.update((arr) => [...arr, this.mailControl.value!]);
    }
    this.clear(this.mailControl);
  }
  sendMessage() {
    this.messageService
      .postMessage(this.messageControl.value!.trim(), this.user()!.id, this.currentChat()!.id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((message) => {
        this.messages.update((arr) => [message, ...arr]);
      });
    this.clear(this.messageControl);
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
  getChatrooms(id: string, chatname: string) {
    const selectedChat = this.chatrooms().find((chat) => chat.id === id);
    if (!selectedChat) {
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
          this.currentChat.set(chat);
        });
    } else {
      this.currentChat.set(selectedChat);
    }
    this.chatName.set(chatname);
    this.getMessages(id, 25);
    this.inputFocus();
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
