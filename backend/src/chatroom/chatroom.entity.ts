import {
  Entity,
  ManyToMany,
  Property,
  OneToMany,
  ManyToOne,
} from "@mikro-orm/decorators/legacy";
import { User } from "../user/user.entity.js";
import { Message } from "../message/message.entity.js";
import { Cascade, Collection, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";

@Entity()
export class Chatroom extends BaseEntity {
  @ManyToOne(() => User, { nullable: true })
  admin?: User;
  @Property({ type: "string", nullable: true })
  chatname?: string;
  @Property({ type: "boolean" })
  isGroup!: boolean;
  @Property({ type: "string", nullable: true })
  description?: string;
  @ManyToMany(() => Message, (message) => message.chatrooms)
  messages = new Collection<Message>(this);
  @ManyToMany(() => User, (user) => user.chatrooms)
  members = new Collection<User>(this);
}
