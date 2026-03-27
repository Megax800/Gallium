import {
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from "@mikro-orm/decorators/legacy";
import { User } from "../user/user.entity.js";
import { Collection, Cascade, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";
import { Chatroom } from "../chatroom/chatroom.entity.js";

@Entity()
export class Message extends BaseEntity {
  @Property({ type: "string" })
  body!: string;
  @Property({ type: "string" })
  date!: string;
  @Property({ type: "string" })
  time!: string;
  @ManyToOne(() => User)
  sender!: Rel<User>;
  @ManyToMany(() => Chatroom, (chatrooms) => chatrooms.messages, {
    owner: true,
  })
  chatrooms = new Collection<Chatroom>(this);
}
