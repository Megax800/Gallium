import {
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from "@mikro-orm/decorators/legacy";
import { User } from "../user/user.entity.js";
import { Collection, Cascade, Rel } from "@mikro-orm/core";
import { BaseEntity } from "../../shared/baseEntity.entity.js";
import { Chat } from "../chatroom/chatroom.entity.js";

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
  @ManyToOne(() => Chat)
  receiver!: Rel<Chat>;
}
