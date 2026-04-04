import {
  BeforeCreate,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/decorators/legacy";
import { Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";
import { Chat } from "../chatroom/chatroom.entity.js";
import { Message } from "../message/message.entity.js";
import { IsEmail, Length, IsNotEmpty } from "class-validator";

@Entity()
export class User extends BaseEntity {
  @Property({ type: "string", nullable: false })
  @IsNotEmpty()
  nickname!: string;
  @Property({ type: "string", nullable: false })
  @IsNotEmpty()
  firstname!: string;
  @Property({ type: "string", nullable: false })
  @IsNotEmpty()
  lastname!: string;
  @Property({ type: "string", nullable: false })
  @IsEmail()
  email!: string;
  @Property({ type: "string", nullable: false })
  @Length(8, 16)
  passwd!: string;
  @ManyToMany(() => Chat, (chatroom) => chatroom.users, {
    cascade: [Cascade.ALL],
  })
  chatrooms = new Collection<Chat>(this);
  @OneToMany(() => Message, (message) => message.sender)
  messages = new Collection<Message>(this);
}
