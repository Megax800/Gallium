import {
  Entity,
  Enum,
  ManyToMany,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/decorators/legacy";
import { User } from "../user/user.entity.js";
import { Message } from "../message/message.entity.js";
import { Cascade, Collection, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";

@Entity()
export class Chat extends BaseEntity {
  @OneToMany(() => Message, (message: Message) => message.chatroom)
  messages = new Collection<Message>(this);
  @ManyToMany(() => User, (user) => user.chatrooms, {
    owner: true,
    cascade: [Cascade.ALL],
  })
  users = new Collection<User>(this);
  @ManyToOne(() => User, { nullable: true, cascade: [Cascade.ALL] })
  admin!: User;
  @Property({ type: "string", nullable: true })
  chatname?: string;
  @Property({ type: "string", nullable: true })
  description?: string;
  @Property({ type: "boolean", nullable: false })
  isGroup!: boolean;
}
