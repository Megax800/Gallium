import { Entity, ManyToMany, ManyToOne, OneToMany, Property} from '@mikro-orm/decorators/legacy'
import { Cascade, Collection} from '@mikro-orm/core';
import { BaseEntity } from '../../shared/baseEntity.entity.js';
import { Chatroom } from '../chatroom/chatroom.entity.js';
import { Message } from '../message/message.entity.js';

@Entity()

export class User extends BaseEntity{
    @Property({type: 'string'})
    nickname!: string
    @Property({type: 'string'})
    firstname!: string
    @Property({type: 'string'})
    lastname!: string
    @Property({type: 'string'})
    email!: string
    @Property({type: 'string'})
    passwd!: string
    @ManyToMany(() => Chatroom, chatroom => chatroom.members, {cascade: [Cascade.ALL], owner: true})
    chatrooms = new Collection<Chatroom>(this)
    @OneToMany(() => Message, message => message.sender)
    messages = new Collection<Message>(this)
    @OneToMany(() => Chatroom, (chatroom) => chatroom.admin, {cascade: [Cascade.ALL]})
    admin = new Collection<Chatroom>(this)
}