import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

export class Message{
    constructor(
        public body: string,
        public date: string,
        public time: string,
        public sender: string,
        public receiver: string,
        public _id?: ObjectId,
    ){}
}