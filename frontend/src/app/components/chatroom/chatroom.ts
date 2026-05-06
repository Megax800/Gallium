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
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-chatroom',
  imports: [ReactiveFormsModule, MatSidenavModule, MatIconModule, MatButtonModule],
  templateUrl: './chatroom.html',
  styleUrl: './chatroom.css',
})
export class Chatroom implements OnInit {
  @Input() id!: string;
  myMessages = viewChild<ElementRef<HTMLUListElement>>('myMessages');
  sendInput = viewChild<ElementRef<HTMLInputElement>>('sendInput');
  nameInput = viewChild<ElementRef<HTMLInputElement>>('nameInput');
  addUser = viewChild<ElementRef<HTMLInputElement>>('addUser');
  info = viewChild<MatDrawer>('info');
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
  addUsersMail = signal<Array<string>>([]);
  editingName = signal<boolean>(false);
  addingUser = signal<boolean>(false);
  lastUserId = '';
  lastDay = '';
  mailControl = new FormControl('', [Validators.required, Validators.email]);
  chatnameControl = new FormControl('', [Validators.required, Validators.pattern(/.*\S.*/)]);
  descriptionControl = new FormControl('', Validators.pattern(/.*\S.*/));
  messageControl = new FormControl('', [Validators.required, Validators.pattern(/.*\S.*/)]);
  changeNameControl = new FormControl('', [Validators.required, Validators.pattern(/.*\S.*/)]);
  addUserGroup = new FormControl('', [Validators.required, Validators.email]);
  constructor() {
    effect(() => {
      this.inputFocus();
    });
    effect(() => {
      this.nameInput()?.nativeElement.focus();
    });
    effect(() => {
      this.addUser()?.nativeElement.focus();
    });
    afterEveryRender(() => {
      if (this.messages().length) {
        const ul = this.myMessages()?.nativeElement;
        ul!.scrollTop = ul!.scrollHeight;
      }
    });
  }
  deleteChatroom(id: string) {
    this.chatroomService
      .deleteChat(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe(() => {
        this.user.update((user) => ({
          ...user!,
          chatrooms: this.user()!.chatrooms.filter((chat) => chat.id !== id),
        }));
        this.chatrooms.set(this.chatrooms().filter((chat) => chat.id !== id));
        this.currentChat.set(null);
        this.info()?.close();
      });
  }
  setBooleansFalse() {
    this.editingName.set(false);
    this.addingUser.set(false);
  }
  removeUserChat(id: string, userId: string) {
    this.chatroomService
      .removeUsers(id, new Array(userId))
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((allUsers) => {
        this.currentChat.update((chat) => ({
          ...chat!,
          users: allUsers,
        }));
      });
  }
  addUsersChat(id: string) {
    this.chatroomService
      .addUsers(id, this.addUsersMail())
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((allUsers) => {
        this.currentChat.update((chat) => ({
          ...chat!,
          users: allUsers,
        }));
      });
    this.clear(this.addUserGroup);
    this.addUsersMail.set([]);
    this.addingUser.set(false);
  }
  removeAddedUserMail(mail: string) {
    this.addUsersMail.update((arr) => arr.filter((user) => user !== mail));
  }
  addUserToGroup() {
    if (!this.addUsersMail().includes(this.addUserGroup.value!)) {
      this.addUsersMail.update((arr) => [...arr, this.addUserGroup.value!]);
    }
    this.clear(this.addUserGroup);
  }
  changeChatname(id: string, chatname: string) {
    this.chatroomService
      .patchChatname(id, chatname)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe((chatname: string) => {
        this.chatName.set(chatname);
      });
  }
  editName() {
    this.editingName.set(true);
    this.changeNameControl.setValue(this.chatName());
  }
  acceptName() {
    if (this.changeNameControl.valid) {
      this.changeChatname(this.currentChat()!.id, this.changeNameControl.value!);
    }
    this.editingName.set(false);
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
  deleteMessage(id: string) {
    this.messageService
      .deleteMessage(id)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw err;
        }),
      )
      .subscribe(() => {
        this.messages.set(this.messages().filter((message) => message.id !== id));
      });
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
        this.user.update((user) => ({ ...user!, chatrooms: [...user?.chatrooms!, chat] }));
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
    this.changeNameControl.setValue(chatname);
    this.setBooleansFalse();
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
