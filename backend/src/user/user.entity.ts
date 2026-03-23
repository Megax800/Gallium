import {
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/decorators/legacy";
import { Cascade, Collection } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";
import { Chat, Group } from "../chatroom/chatroom.entity.js";
import { Message } from "../message/message.entity.js";

@Entity()
export class User extends BaseEntity {
  @Property({ type: "string" })
  nickname!: string;
  @Property({ type: "string" })
  firstname!: string;
  @Property({ type: "string" })
  lastname!: string;
  @Property({ type: "string" })
  email!: string;
  @Property({ type: "string" })
  passwd!: string;
  @ManyToMany(() => Chat, (chatroom) => chatroom.users, {
    pivotTable: "chattables",
    discriminator: "chattable",
    owner: true,
  })
  chatrooms = new Collection<Chat>(this);
  @OneToMany(() => Message, (message) => message.sender)
  messages = new Collection<Message>(this);
  @ManyToMany(() => Group, (chatroom) => chatroom.admin, {
    cascade: [Cascade.ALL],
  })
  admin = new Collection<Chat>(this);
}
