import {
  Entity,
  Enum,
  ManyToMany,
  Property,
} from "@mikro-orm/decorators/legacy";
import { User } from "../user/user.entity.js";
import { Message } from "../message/message.entity.js";
import { Cascade, Collection, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";

@Entity({
  discriminatorColumn: "discr",
  discriminatorMap: { chat: "Chat", group: "Group" },
})
export class Chat extends BaseEntity {
  @ManyToMany(() => Message, (message) => message.chatrooms)
  messages = new Collection<Message>(this);
  @ManyToMany(() => User, (user) => user.chatrooms)
  users = new Collection<User>(this);
}

@Entity()
export class Group extends Chat {
  @ManyToMany(() => User, (user) => user.admin, {
    nullable: false,
    owner: true,
  })
  admin?: User;
  @Property({ type: "string", nullable: false })
  chatname?: string;
  @Property({ type: "boolean" })
  isGroup!: boolean;
  @Property({ type: "string", nullable: false })
  description?: string;
}
