import { ObjectId } from 'mongodb';
import crypto from 'node:crypto'

export class Chatroom{
    constructor(
        public admin: number[],
        public chatname: string,
        public isGroup: boolean,
        public description: string,
        public _id?: ObjectId,
    ){}
}