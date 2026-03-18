import { Entity, ManyToMany, Property, OneToMany, ManyToOne} from '@mikro-orm/decorators/legacy'
import { User } from '../user/user.entity.js';
import { Message } from '../message/message.entity.js';
import { Cascade, Collection, Rel } from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';

@Entity()
export class Chatroom extends BaseEntity{
        @ManyToOne(() => User)
        admin?: Rel<User>
        @Property({type: 'string'})
        chatname!: string
        @Property({type: 'boolean'})
        isGroup!: boolean
        @Property({type: 'string'})
        description?: string
        @ManyToMany(() => Message, message => message.receiver, {cascade: [Cascade.ALL], owner: true})
        messages?: Message[]
        @ManyToMany(() => User, user => user.chatrooms, {cascade: [Cascade.ALL]})
        members!: Rel<User>
    
}